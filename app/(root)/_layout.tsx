import { Tabs } from "expo-router";

export default function RootTabs() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="login" options={{ title: "Logowanie" }} />
      <Tabs.Screen name="tasks" options={{ title: "Zadania" }} />
      <Tabs.Screen name="calendar" options={{ title: "Kalendarz" }} />
    </Tabs>
  );
}
