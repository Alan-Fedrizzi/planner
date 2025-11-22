import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import {
  ModalProps,
  Modal as RNModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/styles/colors";
import { modalStyles } from "./styles";

const { blur, container, wrapper, inner, titleStyle, subtitleStyle } =
  modalStyles();

type Props = ModalProps & {
  title: string;
  subtitle?: string;
  onClose?: () => void;
};

export function Modal({
  title,
  subtitle = "",
  onClose,
  children,
  ...rest
}: Props) {
  return (
    <RNModal transparent animationType="slide" {...rest}>
      <BlurView
        className={blur()}
        intensity={7}
        tint="dark"
        // no android é experimental
        experimentalBlurMethod="dimezisBlurView"
      >
        <View className={container()}>
          <View className={wrapper()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className={inner()}>
                <Text className={titleStyle()}>{title}</Text>

                {onClose && (
                  <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
                    <X color={colors.zinc[400]} size={20} />
                  </TouchableOpacity>
                )}
              </View>

              {subtitle.trim().length > 0 && (
                <Text className={subtitleStyle()}>{subtitle}</Text>
              )}

              {children}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </RNModal>
  );
}
