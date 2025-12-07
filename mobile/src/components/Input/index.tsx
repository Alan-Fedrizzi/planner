import { colors } from "@/styles/colors";
import { ReactNode } from "react";
import {
  Platform,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import { inputStyles } from "./styles";

const { base, field } = inputStyles();

type Variants = "primary" | "secondary" | "tertiary";

type InputProps = ViewProps & {
  children: ReactNode;
  variant?: Variants;
};

function Input({
  children,
  variant = "primary",
  className,
  ...props
}: InputProps) {
  return (
    <View className={base({ variant, class: className })} {...props}>
      {children}
    </View>
  );
}

function Field({ ...props }: TextInputProps) {
  return (
    <TextInput
      className={field()}
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[100]}
      selectionColor={Platform.OS === "ios" ? colors.zinc[100] : undefined}
      {...props}
    />
  );
}

Input.Field = Field;

export { Input };
