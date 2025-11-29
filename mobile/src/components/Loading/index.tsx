import { ActivityIndicator } from "react-native";
import { loadingStyles } from "./styles";

export function Loading() {
  return <ActivityIndicator className={loadingStyles()} />;
}
