import { Text, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { emailStyles } from "./styles";

const { base, text } = emailStyles();

type Props = {
  email: string;
  onRemove: () => void;
};

export function GuestEmail({ email, onRemove }: Props) {
  return (
    <View className={base()}>
      <Text className={text()}>{email}</Text>
      <TouchableOpacity onPress={onRemove}>
        <X color={colors.zinc[400]} size={16} />
      </TouchableOpacity>
    </View>
  );
}
