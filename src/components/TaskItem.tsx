import { Pressable, Text, View } from "react-native";
import { Task, formatDateTime } from "../storage/tasks";
import { colors, ui } from "../theme/ui";

export function TaskItem({
  index,
  task,
  onToggleDone,
  onDelete,
}: {
  index: number;
  task: Task;
  onToggleDone: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={{ ...ui.card, paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" }}>
        <Text style={{ color: colors.text, fontWeight: "900" }}>{index}</Text>
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.text, fontWeight: "800", textDecorationLine: task.done ? "line-through" : "none", opacity: task.done ? 0.65 : 1 }} numberOfLines={2}>
          {task.title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Dodano: {formatDateTime(task.createdAt)}</Text>
        {task.done && task.completedAt ? <Text style={{ color: colors.muted, fontSize: 12 }}>Wykonano: {formatDateTime(task.completedAt)}</Text> : null}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable onPress={onToggleDone} hitSlop={10} style={{ width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: task.done ? "rgba(66,211,146,0.18)" : "rgba(255,255,255,0.04)" }}>
          <Text style={{ color: task.done ? colors.success : colors.text, fontWeight: "900" }}>✓</Text>
        </Pressable>

        <Pressable onPress={onDelete} hitSlop={10} style={{ width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,92,122,0.12)" }}>
          <Text style={{ color: colors.danger, fontWeight: "900" }}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}
