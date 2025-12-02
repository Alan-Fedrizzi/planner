import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import {
  Clock,
  Calendar as IconCalendar,
  PlusIcon,
  Tag,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Text, View } from "react-native";
import { TripData } from "./[id]";
import { activitiesStyles } from "./trip.styles";
import { activitiesServer } from "@/server/activities-server";

const {
  container,
  top,
  title,
  newActivityModalContainer,
  newActivityModalInputs,
  newActivityModalInput,
} = activitiesStyles();

enum ActivitiesModal {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

type Props = {
  tripDetails: TripData;
};

// como não exportamos como default, não é rota
// é parte da interface
export function Activities({ tripDetails }: Props) {
  // MODAL
  const [showModal, setShowModal] = useState(ActivitiesModal.NONE);

  // LOADING
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // DATA
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityHour] = useState("");

  function resetNewActivityFields() {
    setActivityDate("");
    setActivityTitle("");
    setActivityHour("");
    setShowModal(ActivitiesModal.NONE);
  }

  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour) {
        return Alert.alert("Cadastrar atividade", "Preencha todos os campos!");
      }

      setIsCreatingActivity(true);

      await activitiesServer.create({
        tripId: tripDetails.id,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), "h")
          .toString(),
        title: activityTitle,
      });

      Alert.alert("Nova Atividade", "Nova atividade cadastrada com sucesso!");

      await getTripActivities();
      resetNewActivityFields();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Cadastrar Atividade",
        "Não foi possível criar nova atividade."
      );
    } finally {
      setIsCreatingActivity(false);
    }
  }

  async function getTripActivities() {
    try {
      setIsLoadingActivities(true);

      const activities = await activitiesServer.getActivitiesByTripId(
        tripDetails.id
      );

      console.log(activities);
    } catch (error) {
      console.log(error);
      Alert.alert("Atividades", "Não foi possível carregar as atividades.");
    } finally {
      setIsLoadingActivities(false);
    }
  }

  useEffect(() => {
    getTripActivities();
  }, []);

  return (
    <View className={container()}>
      <View className={top()}>
        <Text className={title()}>Atividades</Text>

        <Button onPress={() => setShowModal(ActivitiesModal.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} />
          <Button.ButtonText>Nova atividade</Button.ButtonText>
        </Button>
      </View>

      {/* cadastrar atividade */}
      <Modal
        visible={showModal === ActivitiesModal.NEW_ACTIVITY}
        title="Cadastrar atividade"
        subtitle="Todos os convidados podem visualizar as atividades"
        onClose={() => setShowModal(ActivitiesModal.NONE)}
      >
        <View className={newActivityModalContainer()}>
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className={newActivityModalInputs()}>
            <Input variant="secondary" className={newActivityModalInput()}>
              <IconCalendar color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onPressIn={() => setShowModal(ActivitiesModal.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className={newActivityModalInput()}>
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário?"
                // para remover pontos e vírgulas
                onChangeText={(text) =>
                  setActivityHour(text.replace(".", "").replace(",", ""))
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={2}
              />
            </Input>
          </View>
        </View>

        <Button
          onPress={handleCreateTripActivity}
          isLoading={isCreatingActivity}
        >
          <Button.ButtonText>Salvar atividade</Button.ButtonText>
        </Button>
      </Modal>

      {/* selecionar data */}
      <Modal
        title="Selecionar data"
        subtitle="Selecione a data da atividade"
        visible={showModal === ActivitiesModal.CALENDAR}
        onClose={() => setShowModal(ActivitiesModal.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />

          <Button onPress={() => setShowModal(ActivitiesModal.NEW_ACTIVITY)}>
            <Button.ButtonText>Confirmar</Button.ButtonText>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
