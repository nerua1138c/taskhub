import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/ui";

export function Segmented<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { key: T; label: string }[];
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
              backgroundColor: active
                ? "rgba(110,168,254,0.18)"
                : "rgba(255,255,255,0.04)",
            }}
          >
            <Text style={{ color: active ? colors.primary : colors.text, fontWeight: "900" }}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
