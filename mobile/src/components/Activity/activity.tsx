import { colors } from "@/styles/colors";
import { CircleCheck, CircleDashed } from "lucide-react-native";
import { Text, View } from "react-native";
import { activityStyles } from "./styles";

const { base, title, hour } = activityStyles();

export type ActivityProps = {
  id: string;
  title: string;
  hour: string;
  isBefore: boolean;
};

type Props = {
  data: ActivityProps;
};

export function Activity({ data }: Props) {
  return (
    <View className={base({ isBefore: data.isBefore })}>
      {data.isBefore ? (
        <CircleCheck color={colors.lime[300]} size={20} />
      ) : (
        <CircleDashed color={colors.zinc[400]} size={20} />
      )}

      <Text className={title()}>{data.title}</Text>

      <Text className={hour()}>{data.hour}</Text>
    </View>
  );
}
