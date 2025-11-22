import { colors } from "@/styles/colors";
import { Link2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import * as Linking from "expo-linking";
import { tripLinkStyles } from "./styles";

const { base, container, title, url } = tripLinkStyles();

export type TripLinkProps = {
  id: string;
  title: string;
  url: string;
};

type Props = {
  data: TripLinkProps;
};

export function TripLink({ data }: Props) {
  function handleLinkOpen() {
    Linking.openURL(data.url);
  }

  return (
    <View className={base()}>
      <View className={container()}>
        <Text className={title()}>{data.title}</Text>
        <Text className={url()} numberOfLines={1}>
          {data.url}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLinkOpen}>
        <Link2 color={colors.zinc[400]} size={20} />
      </TouchableOpacity>
    </View>
  );
}
