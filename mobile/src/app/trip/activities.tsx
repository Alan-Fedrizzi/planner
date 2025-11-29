import { Text, View } from "react-native";
import { TripData } from "./[id]";

type Props = {
  tripDetails: TripData;
};

// como não exportamos como default, não é rota
// é parte da interface
export function Activities({ tripDetails }: Props) {
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-center text-white">
        {tripDetails.destination}
      </Text>
    </View>
  );
}
