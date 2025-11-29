import { Text, View } from "react-native";
import { TripData } from "./[id]";

type Props = {
  tripId: string;
};

// como não exportamos como default, não é rota
// é parte da interface
export function Details({ tripId }: Props) {
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-center text-white">
        {tripId}
      </Text>
    </View>
  );
}
