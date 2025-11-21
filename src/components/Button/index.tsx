import { createContext, useContext } from "react";
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { buttonStyles } from "./styles";

const { base, spinner, text } = buttonStyles();

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
  variant = "primary",
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={base({ variant, isLoading })}
      activeOpacity={0.7}
      disabled={isLoading}
      {...props}
    >
      <ThemeContext.Provider value={{ variant }}>
        {isLoading ? (
          <ActivityIndicator className={spinner({ variant })} />
        ) : (
          children
        )}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}

function ButtonText({ children }: TextProps) {
  const { variant } = useContext(ThemeContext);

  return <Text className={text({ variant })}>{children}</Text>;
}

Button.ButtonText = ButtonText;

export { Button };
