import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarRange,
  Calendar as IconCalendar,
  Info,
  Mail,
  MapPin,
  Settings2,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { DateData } from "react-native-calendars";
import { Activities } from "./activities";
import { Details } from "./details";
import { tripStyles } from "./trip.styles";
import { validateInput } from "@/utils/validateInput";
import { participantsServer } from "@/server/participants-server";
import { tripStorage } from "@/storage/trip";

const {
  container,
  button,
  bottom,
  bottomContainer,
  buttonBottom,
  modalUpdateContainer,
  modalUpdateRemove,
  modalConfirmContainer,
  modalConfirmText,
  modalConfirmHighlight,
} = tripStyles();

export type TripData = TripDetails & { when: string };

enum TripModal {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
  CONFIRM_ATTENDANCE = 3,
}

export default function Trip() {
  // LOADING
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);
  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false);

  // MODAL
  const [showModal, setShowModal] = useState(TripModal.NONE);

  // DATA
  const [tripDetails, setTripDetails] = useState({} as TripData);
  const [option, setOption] = useState<"activity" | "details">("activity");
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [destination, setDestination] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // recupera os params da rota
  const tripParams = useLocalSearchParams<{
    id: string;
    participant?: string;
  }>();

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true);

      // se tem participant, quer dizer que acessei o apppelo deep link, abre modal para confirmar viajem
      if (!tripParams.participant) {
        setShowModal(TripModal.CONFIRM_ATTENDANCE);
      }

      if (!tripParams.id) {
        return router.back();
      }

      const trip = await tripServer.getById(tripParams.id);

      setDestination(trip.destination);

      const maxLengthDestination = 14;
      const destination =
        trip.destination.length > maxLengthDestination
          ? `${trip.destination.slice(0, maxLengthDestination)}...`
          : trip.destination;

      const startsAt = dayjs(trip.starts_at).format("DD");
      const endsAt = dayjs(trip.ends_at).format("DD");
      const startMonth = dayjs(trip.starts_at).format("MMM");
      const endMonth = dayjs(trip.ends_at).format("MMM");

      setTripDetails({
        ...trip,
        when: `${destination} de ${startsAt}/${startMonth} a ${endsAt}/${endMonth}`,
      });
    } catch (error) {
      console.log(error);
      // se der errado, redirect to index
      Alert.alert(
        "Detalhes da viagem",
        "Erro ao carregar os detalhes da viagem.",
        [
          {
            text: "OK.",
            onPress: () => router.navigate("/"),
          },
        ]
      );
    } finally {
      setIsLoadingTrip(false);
    }
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    });

    setSelectedDates(dates);
  }

  async function handleUpdateTrip() {
    try {
      if (!tripParams.id) {
        return;
      }

      if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
        return Alert.alert(
          "Atualizar viagem",
          "Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem."
        );
      }

      setIsUpdatingTrip(true);

      await tripServer.update({
        id: tripParams.id,
        destination,
        starts_at: dayjs(selectedDates.startsAt.dateString).toString(),
        ends_at: dayjs(selectedDates.endsAt.dateString).toString(),
      });

      Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setShowModal(TripModal.NONE);
            getTripDetails();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Atualizar viagem", "Erro ao atualizar a viagem.");
    } finally {
      setIsUpdatingTrip(false);
    }
  }

  async function handleConfirmAttendance() {
    try {
      if (!tripParams.id || !tripParams.participant) {
        return;
      }

      if (!guestName.trim() || !guestEmail.trim()) {
        return Alert.alert(
          "Confirmação",
          "Preencha nome e e-mail para confirmar a viagem!"
        );
      }

      if (!validateInput.email(guestEmail.trim())) {
        return Alert.alert("Confirmação", "E-mail inválido!");
      }

      setIsConfirmingAttendance(true);

      await participantsServer.confirmTripByParticipantId({
        participantId: tripParams.participant,
        name: guestName,
        email: guestEmail.trim(),
      });

      Alert.alert("Confirmação", "Viagem confirmada com sucesso!");

      await tripStorage.save(tripParams.id);

      setShowModal(TripModal.NONE);
    } catch (error) {
      console.log(error);
      Alert.alert("Confirmação", "Não foi possível confirmar!");
    } finally {
      setIsConfirmingAttendance(false);
    }
  }

  async function handleRemoveTrip() {
    try {
      Alert.alert("Remover viagem", "Tem certeza que deseja remover a viagem", [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await tripStorage.remove();
            router.navigate("/");
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTripDetails();
  }, []);

  if (isLoadingTrip) {
    return <Loading />;
  }

  return (
    <View className={container()}>
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when} readOnly />

        <TouchableOpacity
          activeOpacity={0.7}
          className={button()}
          onPress={() => setShowModal(TripModal.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {option === "activity" ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details tripId={tripDetails.id} />
      )}

      <View className={bottom()}>
        <View className={bottomContainer()}>
          <Button
            className={buttonBottom()}
            onPress={() => setOption("activity")}
            variant={option === "activity" ? "primary" : "secondary"}
          >
            <CalendarRange
              color={
                option === "activity" ? colors.lime[950] : colors.zinc[200]
              }
              size={20}
            />
            <Button.ButtonText>Atividades</Button.ButtonText>
          </Button>

          <Button
            className={buttonBottom()}
            onPress={() => setOption("details")}
            variant={option === "details" ? "primary" : "secondary"}
          >
            <Info
              color={option === "details" ? colors.lime[950] : colors.zinc[200]}
              size={20}
            />
            <Button.ButtonText>Detalhes</Button.ButtonText>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou a viagem pode editar."
        visible={showModal === TripModal.UPDATE_TRIP}
        onClose={() => setShowModal(TripModal.NONE)}
      >
        <View className={modalUpdateContainer()}>
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <IconCalendar color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Quando?"
              value={selectedDates.formatDatesInText}
              onPressIn={() => setShowModal(TripModal.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>
        </View>

        <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
          <Button.ButtonText>Atualizar</Button.ButtonText>
        </Button>

        <TouchableOpacity activeOpacity={0.7} onPress={handleRemoveTrip}>
          <Text className={modalUpdateRemove()}>Remover viagem</Text>
        </TouchableOpacity>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === TripModal.CALENDAR}
        onClose={() => setShowModal(TripModal.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectDate}
            markedDates={selectedDates.dates}
          />

          <Button onPress={() => setShowModal(TripModal.UPDATE_TRIP)}>
            <Button.ButtonText>Confirmar</Button.ButtonText>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={showModal === TripModal.CONFIRM_ATTENDANCE}
        // sem o onClose, só fecha quando o usuário confirma
      >
        <View className={modalConfirmContainer()}>
          <Text className={modalConfirmText()}>
            Você foi convidado (a) para participar de uma viagem para
            <Text className={modalConfirmHighlight()}>
              {" "}
              {tripDetails.destination}{" "}
            </Text>
            nas datas de{" "}
            <Text className={modalConfirmHighlight()}>
              {dayjs(tripDetails.starts_at).date()}/
              {dayjs(tripDetails.ends_at).format("MMM")} a{" "}
              {dayjs(tripDetails.ends_at).date()}/
              {dayjs(tripDetails.ends_at).format("MMM")}.
            </Text>
          </Text>

          <Text className={modalConfirmText()}>
            Para confirmar sua presença na viagem, preencha os dados abaixo:
          </Text>

          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Seu nome completo"
              value={guestName}
              onChangeText={setGuestName}
            />
          </Input>

          <Input variant="secondary">
            <Mail color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="E-mail de confirmação"
              value={guestEmail}
              onChangeText={setGuestEmail}
            />
          </Input>

          <Button
            isLoading={isConfirmingAttendance}
            onPress={handleConfirmAttendance}
          >
            <Button.ButtonText>Confirmar minha presença</Button.ButtonText>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
