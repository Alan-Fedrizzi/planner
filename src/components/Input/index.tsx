import { TextInput, TextInputProps, View } from "react-native";
import { inputStyles, fieldStyles } from "./styles";
import { ReactNode } from "react";

type Variants = "primary" | "secondary" | "tertiary";

type InputProps = {
  children: ReactNode;
  variant?: Variants;
};

function Input({ children, variant = "primary" }: InputProps) {
  return <View className={inputStyles({ variant })}>{children}</View>;
}

function Field({ ...props }: TextInputProps) {
  return <TextInput className={fieldStyles()} {...props} />;
}

Input.Field = Field;

export { Input };
