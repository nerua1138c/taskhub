import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";

import { Screen } from "../../src/components/Screen";
import { colors, ui } from "../../src/theme/ui";
import { useRequireAuth } from "../../src/hooks/useRequireAuth";
import { countCompletedByDay, loadTasks } from "../../src/storage/tasks";

export default function CalendarScreen() {
  const allowed = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [completedByDay, setCompletedByDay] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        const tasks = await loadTasks();
        const map = countCompletedByDay(tasks);
        if (!mounted) return;
        setCompletedByDay(map);
        setLoading(false);
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const markedDates = useMemo(() => {
    const out: Record<string, any> = {};
    for (const day of Object.keys(completedByDay)) {
      const count = completedByDay[day] ?? 0;

      let bg = colors.danger;      // <2
      if (count >= 2 && count < 4) bg = colors.warn;   // 2-3
      if (count >= 4) bg = colors.success;             // >=4

      out[day] = {
        customStyles: {
          container: { backgroundColor: bg, borderRadius: 10 },
          text: { color: "#0B1220", fontWeight: "900" },
        },
      };
    }
    return out;
  }, [completedByDay]);

  if (!allowed) {
    return (
      <Screen>
        <View style={{ ...ui.screen, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <View style={{ ...ui.screen, justifyContent: "center", alignItems: "center", gap: 10 }}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted }}>Ładuję kalendarz…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ ...ui.screen, gap: 12 }}>
        <Text style={ui.title}>Kalendarz</Text>
        <Text style={ui.subtitle}>
          Kolor dnia zależy od liczby wykonanych zadań: &lt;2 czerwony, 2–3 żółty, ≥4 zielony.
        </Text>

        <View style={ui.card}>
          <Calendar
            markingType="custom"
            markedDates={markedDates}
            theme={{
              calendarBackground: colors.card,
              monthTextColor: colors.text,
              dayTextColor: colors.text,
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
              textDisabledColor: "rgba(234,240,255,0.25)",
              textSectionTitleColor: colors.muted,
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
