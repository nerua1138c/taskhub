import { ReactNode } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/ui";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={[colors.bg, "#0D1530", colors.bg]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
}
