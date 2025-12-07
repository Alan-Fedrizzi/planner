import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { GuestEmail } from "@/components/Email/email";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { tripServer } from "@/server/trip-server";
import { tripStorage } from "@/storage/trip";
import { colors } from "@/styles/colors";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { validateInput } from "@/utils/validateInput";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  ArrowRight,
  AtSign,
  Calendar as CalendarIcon,
  MapPin,
  Settings2,
  UserRoundPlus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, Keyboard, ScrollView, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { indexStyles } from "./index.styles";

const {
  container,
  image,
  imageBg,
  text,
  inputContainer,
  buttonContainer,
  policyText,
  policyTextInner,
  modalCalendarContainer,
  modalGuestsContainer,
  modalGuestNoEmail,
  modalGuestsBottom,
} = indexStyles();

enum StepForm {
  TRIP_DETAILS = 1,
  ADD_EMAIL = 2,
}

enum PageModal {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

// tem que exportar default para o expo router reconhecer
export default function Index() {
  // LOADING
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isGettingTrip, setIsGettingTrip] = useState(true);

  // DATA
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState<DatesSelected>(
    {} as DatesSelected
  );
  const [emailToInvite, setEmailToInvite] = useState("");
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  // MODAL
  const [showModal, setShowModal] = useState(PageModal.NONE);

  function handleNextStepForm() {
    // tem o onde e quando preenchidos?
    if (
      destination.trim().length === 0 ||
      !selectedDate.startsAt ||
      !selectedDate.endsAt
    ) {
      return Alert.alert(
        "Detalhes da viagem",
        "Preencha o destino e a data da viagem."
      );
    }

    // destino tem que ter pelo menos 4 caracteres
    if (destination.length < 4) {
      return Alert.alert(
        "Detalhes da viagem",
        "O destino deve ter pelo menos 4 caracteres."
      );
    }

    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }

    Alert.alert("Nova viagem", "Confirmar viagem?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: createTrip,
      },
    ]);
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay,
      // selectedDay: selectedDay
    });

    setSelectedDate(dates);
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevState) =>
      prevState.filter((email) => email !== emailToRemove)
    );
  }

  function handleAddEmail() {
    // verificar se o email é válido
    if (!validateInput.email(emailToInvite)) {
      return Alert.alert("Convidado", "E-mail inválido!");
    }

    // se email já existe
    const emailAlreadyExists = emailsToInvite.find(
      (email) => email === emailToInvite
    );

    if (emailAlreadyExists) {
      return Alert.alert("Convidado", "E-mail já foi adicionado!");
    }

    setEmailsToInvite((prevState) => [...prevState, emailToInvite]);
    setEmailToInvite("");
  }

  async function saveTrip(tripId: string) {
    try {
      await tripStorage.save(tripId);
      // dá erro
      // router.navigate(`/trip/${tripId}`);
      router.navigate({ pathname: "/trip/[id]", params: { id: tripId } });
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Salvar Viagem",
        "Não foi possível salvar o ID da viagem no dispositivo."
      );
    }
  }

  async function createTrip() {
    try {
      setIsCreatingTrip(true);

      const newTrip = await tripServer.create({
        destination,
        starts_at: dayjs(selectedDate.startsAt?.dateString).toString(),
        ends_at: dayjs(selectedDate.endsAt?.dateString).toString(),
        emails_to_invite: emailsToInvite,
      });

      Alert.alert("Nova viagem", "Viagem criada com sucesso!", [
        {
          text: "OK. Continuar.",
          // se não passar parêmetro, pode ser
          // onPress: saveTrip,
          onPress: () => saveTrip(newTrip.tripId),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Nova viagem", "Não foi possível criar nova viagem.");
      setIsCreatingTrip(false);
      // setamos o loading para false aqui, pois se der bom, redireciona para outra tela.
    }
  }

  async function getTrip() {
    try {
      // já inicia como true esse loading
      // setIsGettingTrip(true);
      const tripID = await tripStorage.get();

      if (!tripID) {
        // se não tiver trip, segue para tela index
        return setIsGettingTrip(false);
      }

      const trip = await tripServer.getById(tripID);

      if (trip) {
        // return router.navigate("/trip/" + trip.id)
        router.navigate({ pathname: "/trip/[id]", params: { id: trip.id } });
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Viagem",
        "Não foi possível acessar os dados da viagem salva no dispositivo."
      );
      setIsGettingTrip(false);
    }
  }

  useEffect(() => {
    getTrip();
  }, []);

  if (isGettingTrip) {
    return <Loading />;
  }

  return (
    <ScrollView
      className={container()}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Image
        source={require("@/assets/logo.png")}
        className={image()}
        resizeMode="contain"
      />

      <Image source={require("@/assets/bg.png")} className={imageBg()} />

      <Text className={text()}>
        Convide seus amigos e planeje sua {"\n"} próxima viagem
      </Text>

      <View className={inputContainer()}>
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onChangeText={setDestination}
            value={destination}
          />
        </Input>

        <Input>
          <CalendarIcon color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS &&
              setShowModal(PageModal.CALENDAR)
            }
            showSoftInputOnFocus={false}
            value={selectedDate.formatDatesInText}
          />
        </Input>

        {stepForm === StepForm.ADD_EMAIL && (
          <>
            <View className={buttonContainer()}>
              <Button
                variant="secondary"
                isLoading={false}
                onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
              >
                <Button.ButtonText>Altertar local / data</Button.ButtonText>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                    : ""
                }
                onPress={() => {
                  Keyboard.dismiss();
                  setShowModal(PageModal.GUESTS);
                }}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}

        <Button isLoading={isCreatingTrip} onPress={handleNextStepForm}>
          <Button.ButtonText>
            {stepForm === StepForm.TRIP_DETAILS
              ? "Continuar"
              : "Confirmar Viagem"}
          </Button.ButtonText>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Text className={policyText()}>
        Ao planejar sua viagem pela plann.er você automaticamente concorda com
        nossos{" "}
        <Text className={policyTextInner()}>
          termos de uso e políticas de privacidade
        </Text>
        .
      </Text>

      {/* modal calendário */}
      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === PageModal.CALENDAR}
        onClose={() => {
          setShowModal(PageModal.NONE);
        }}
      >
        <View className={modalCalendarContainer()}>
          <Calendar
            onDayPress={handleSelectDate}
            // como vamos repassar o que vem na função, podemos usar o atalho
            // onDayPress={(date: DateData) => handleSelectDate(date)}
            markedDates={selectedDate.dates}
            // dayjs().toISOString() retorna a data atual, para não poder selecionar uma data do passado
            minDate={dayjs().toISOString()}
          />

          <Button onPress={() => setShowModal(PageModal.NONE)}>
            <Button.ButtonText>Confirmar</Button.ButtonText>
          </Button>
        </View>
      </Modal>

      {/* modal participantes */}
      <Modal
        title="Selecionar os convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === PageModal.GUESTS}
        onClose={() => {
          setShowModal(PageModal.NONE);
        }}
      >
        <View className={modalGuestsContainer()}>
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => (
              // sempre que tem ListStart, temos que colocar o key
              <GuestEmail
                key={email}
                email={email}
                onRemove={() => handleRemoveEmail(email)}
              />
            ))
          ) : (
            <Text className={modalGuestNoEmail()}>
              Nenhum e-mail adicionado.
            </Text>
          )}
        </View>

        <View className={modalGuestsBottom()}>
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Digite o e-mail do convidado"
              keyboardType="email-address"
              onChangeText={(text) =>
                setEmailToInvite(text.toLocaleLowerCase())
              }
              value={emailToInvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>

          <Button onPress={handleAddEmail}>
            <Button.ButtonText>Convidar</Button.ButtonText>
          </Button>
        </View>
      </Modal>
    </ScrollView>
  );
}

// cd mobile
// npm start

// server/api.ts colocar o IP do servidor
// cd server
// npm run dev
// npm run db:studio
// se não abrir, ver server/prisma/db.sqlite (abrir com extensão SQLite Viewer)

// não funcionou para mim... dá erro no build development
// para funcionar deep link
// precisamos de build de desenvolvimento
// npx expo prebuild
// npx expo run:android
// se precisar: npx expo start --clear
// para abrir o app no simulador
// o "planner" tem que ser o scheme que está no app.json
// npx uri-scheme open "planner>//trip/[tripId]?participant=[participantId]" -- android
