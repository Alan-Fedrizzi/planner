import { Text, View } from "react-native";
import { CircleDashed, CircleCheck } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { participantStyles } from "./styles";

const { base, container, name, email } = participantStyles();

export type ParticipantProps = {
  id: string;
  name?: string;
  email: string;
  is_confirmed: boolean;
};

type Props = {
  data: ParticipantProps;
};

export function Participant({ data }: Props) {
  return (
    <View className={base()}>
      <View className={container()}>
        <Text className={name()}>{data.name ?? "Pendente"}</Text>

        <Text className={email()}>{data.email}</Text>
      </View>

      {data.is_confirmed ? (
        <CircleCheck color={colors.lime[300]} size={20} />
      ) : (
        <CircleDashed color={colors.zinc[400]} size={20} />
      )}
    </View>
  );
}
