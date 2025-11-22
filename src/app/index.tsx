import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { colors } from "@/styles/colors";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Settings2,
  UserRoundPlus,
} from "lucide-react-native";
import { useState } from "react";
import { Image, Keyboard, ScrollView, Text, View } from "react-native";
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
  // DATA
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);

  // MODAL
  const [showModal, setShowModal] = useState(PageModal.NONE);

  function handleNextStepForm() {
    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }
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
              <Input.Field placeholder="Quem estará na viagem?" />
            </Input>
          </>
        )}

        <Button isLoading={false} onPress={handleNextStepForm}>
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

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === PageModal.CALENDAR}
        onClose={() => {
          setShowModal(PageModal.NONE);
        }}
      >
        <View className={modalCalendarContainer()}>
          <Calendar />

          <Button onPress={() => setShowModal(PageModal.NONE)}>
            <Button.ButtonText>Confirmar</Button.ButtonText>
          </Button>
        </View>
      </Modal>
    </ScrollView>
  );
}

// aula 2 - refatorar os componentes usando tailwind-variants
// parei em 43min
// falta 1:45

// cd mobile
// npm start

// server/api.ts colocar o IP do servidor
// cd server
// npm run dev
