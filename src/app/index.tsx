import { Image, Text, View } from "react-native";
import { indexStyles } from "./index.styles";
import { Input } from "@/components/Input";

const { container, image, text } = indexStyles();

// tem que exportar default para o expo router reconhecer
export default function Index() {
  return (
    <View className={container()}>
      <Image
        source={require("@/assets/logo.png")}
        className={image()}
        resizeMode="contain"
      />

      <Text className={text()}>
        Convide seus amigos e planeje sua {"\n"} próxima viagem
      </Text>

      <View>
        <Input>
          <Input.Field placeholder="Para onde?" />
        </Input>
      </View>
    </View>
  );
}

// parei em 1:08
// falta 41min
