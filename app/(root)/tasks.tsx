import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { Screen } from "../../src/components/Screen";
import { colors, ui } from "../../src/theme/ui";
import { Segmented } from "../../src/components/Segmented";
import { TaskRow } from "../../src/components/TaskRow";
import { useRequireAuth } from "../../src/hooks/useRequireAuth";
import {
  Task,
  loadTasks,
  saveTasks,
  formatDateTime,
} from "../../src/storage/tasks";
import { fetchLatestNews } from "../../src/api/news";
import { clearSession, getSession } from "../../src/storage/auth";
import {
  loadProfile,
  saveProfile,
  ProfileData,
  avatars,
} from "../../src/storage/profile";

type TabKey = "list" | "add" | "done" | "map" | "news" | "profile";

export default function TasksScreen() {
  const allowed = useRequireAuth(); // jeśli brak sesji -> przerzuca do login
  const [tab, setTab] = useState<TabKey>("list");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [newTitle, setNewTitle] = useState("");

  const [news, setNews] = useState<
    { id: string; title: string; url: string | null; createdAt: string }[]
  >([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    phone: "",
    city: "",
    avatarIndex: 0,
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const reload = async () => {
    setLoadingTasks(true);
    const t = await loadTasks();
    setTasks(t);
    setLoadingTasks(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (!allowed) return;
      reload();
    }, [allowed])
  );

  const persist = async (next: Task[]) => {
    setTasks(next);
    await saveTasks(next);
  };

  const addTask = async () => {
    const title = newTitle.trim();
    if (!title) return Alert.alert("Błąd", "Wpisz treść zadania.");
    const next: Task[] = [
      { id: String(Date.now()), title, done: false, createdAt: Date.now() },
      ...tasks,
    ];
    await persist(next);
    setNewTitle("");
    setTab("list");
  };

  const toggleDone = async (id: string) => {
    const next = tasks.map((t) => {
      if (t.id !== id) return t;
      const willBeDone = !t.done;
      return { ...t, done: willBeDone, completedAt: willBeDone ? Date.now() : undefined };
    });
    await persist(next);
  };

  const removeTask = async (id: string) => {
    const next = tasks.filter((t) => t.id !== id);
    await persist(next);
  };

  const { active, done } = useMemo(() => {
    const a = tasks.filter((t) => !t.done).sort((x, y) => y.createdAt - x.createdAt);
    const d = tasks
      .filter((t) => t.done)
      .sort((x, y) => (y.completedAt ?? 0) - (x.completedAt ?? 0));
    return { active: a, done: d };
  }, [tasks]);

  const loadNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const items = await fetchLatestNews();
      setNews(items);
    } catch {
      setNewsError("Nie udało się pobrać newsów.");
    } finally {
      setLoadingNews(false);
    }
  };

  const loadLocation = async () => {
    setLoadingMap(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Brak uprawnień", "Aplikacja potrzebuje dostępu do lokalizacji.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    } catch {
      Alert.alert("Błąd", "Nie udało się pobrać lokalizacji.");
    } finally {
      setLoadingMap(false);
    }
  };

  const loadProfileAndEmail = async () => {
    const e = (await getSession()) ?? "";
    setEmail(e);
    const p = await loadProfile();
    setProfile(p);
  };

  const onSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await saveProfile(profile);
      Alert.alert("OK", "Zapisano profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onLogout = async () => {
    await clearSession();
    Alert.alert("OK", "Wylogowano.");
  };

  useEffect(() => {
    if (!allowed) return;
    if (tab === "news") loadNews();
    if (tab === "map") loadLocation();
    if (tab === "profile") loadProfileAndEmail();
  }, [tab, allowed]);

  if (!allowed) {
    return (
      <Screen>
        <View style={{ ...ui.screen, justifyContent: "center", alignItems: "center", gap: 10 }}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted }}>Sprawdzam konto…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ ...ui.screen, gap: 12 }}>
        <Text style={ui.title}>Zadania</Text>

        <Segmented
          value={tab}
          onChange={setTab}
          items={[
            { key: "list", label: "Lista" },
            { key: "add", label: "Dodaj" },
            { key: "done", label: "Wykonane" },
            { key: "map", label: "Mapa" },
            { key: "news", label: "Newsy" },
            { key: "profile", label: "Profil" },
          ]}
        />

        {tab === "list" && (
          <View style={{ flex: 1, gap: 10 }}>
            {loadingTasks ? (
              <View style={{ ...ui.card, alignItems: "center", gap: 8 }}>
                <ActivityIndicator />
                <Text style={{ color: colors.muted }}>Ładuję…</Text>
              </View>
            ) : null}

            <FlatList
              data={[...active, ...done]}
              keyExtractor={(t) => t.id}
              contentContainerStyle={{ gap: 10, paddingBottom: 18 }}
              renderItem={({ item, index }) => (
                <TaskRow
                  index={index + 1}
                  task={item}
                  onToggleDone={() => toggleDone(item.id)}
                  onDelete={() => removeTask(item.id)}
                />
              )}
              ListEmptyComponent={
                <Text style={{ color: colors.muted }}>
                  Brak zadań. Dodaj w zakładce „Dodaj”.
                </Text>
              }
            />
          </View>
        )}

        {tab === "add" && (
          <View style={{ gap: 12 }}>
            <View style={ui.card}>
              <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>
                Dodaj zadanie
              </Text>
              <TextInput
                placeholder="Treść zadania…"
                placeholderTextColor={colors.muted}
                value={newTitle}
                onChangeText={setNewTitle}
                style={ui.input}
              />
              <Pressable onPress={addTask} style={ui.button}>
                <Text style={ui.buttonText}>Dodaj</Text>
              </Pressable>
            </View>
          </View>
        )}

        {tab === "done" && (
          <View style={{ flex: 1, gap: 10 }}>
            <View style={ui.card}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Wykonane zadania</Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>Łącznie: {done.length}</Text>
            </View>

            <FlatList
              data={done}
              keyExtractor={(t) => t.id}
              contentContainerStyle={{ gap: 10, paddingBottom: 18 }}
              renderItem={({ item, index }) => (
                <View style={ui.card}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>
                    {index + 1}. {item.title}
                  </Text>
                  <Text style={{ color: colors.muted, marginTop: 6 }}>
                    Dodano: {formatDateTime(item.createdAt)}
                  </Text>
                  {item.completedAt ? (
                    <Text style={{ color: colors.muted, marginTop: 4 }}>
                      Wykonano: {formatDateTime(item.completedAt)}
                    </Text>
                  ) : null}

                  <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <Pressable
                      onPress={() => toggleDone(item.id)}
                      style={[ui.smallBtn, { backgroundColor: "rgba(255,255,255,0.06)" }]}
                    >
                      <Text style={{ color: colors.text, fontWeight: "900" }}>Cofnij ✓</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removeTask(item.id)}
                      style={[ui.smallBtn, { backgroundColor: "rgba(255,92,122,0.14)" }]}
                    >
                      <Text style={{ color: colors.danger, fontWeight: "900" }}>Usuń</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={{ color: colors.muted }}>Brak wykonanych zadań.</Text>}
            />
          </View>
        )}

        {tab === "map" && (
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ ...ui.card, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Mapa lokalizacji</Text>
              <Pressable onPress={loadLocation}>
                <Text style={{ color: colors.primary, fontWeight: "900" }}>Odśwież</Text>
              </Pressable>
            </View>

            {loadingMap ? (
              <View style={{ ...ui.card, alignItems: "center", gap: 8 }}>
                <ActivityIndicator />
                <Text style={{ color: colors.muted }}>Ładuję lokalizację…</Text>
              </View>
            ) : null}

            {coords ? (
              <View style={{ height: 360, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={coords} title="Twoja lokalizacja" />
                </MapView>
              </View>
            ) : (
              <Text style={{ color: colors.muted }}>Brak współrzędnych — sprawdź uprawnienia.</Text>
            )}
          </View>
        )}

        {tab === "news" && (
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ ...ui.card, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Newsy</Text>
              <Pressable onPress={loadNews}>
                <Text style={{ color: colors.primary, fontWeight: "900" }}>Odśwież</Text>
              </Pressable>
            </View>

            {loadingNews ? (
              <View style={{ ...ui.card, alignItems: "center", gap: 8 }}>
                <ActivityIndicator />
                <Text style={{ color: colors.muted }}>Pobieram…</Text>
              </View>
            ) : null}

            {newsError ? <Text style={{ color: colors.danger }}>{newsError}</Text> : null}

            <FlatList
              data={news}
              keyExtractor={(x) => x.id}
              contentContainerStyle={{ gap: 10, paddingBottom: 18 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => item.url && Linking.openURL(item.url)}
                  style={{ ...ui.card, gap: 6 }}
                >
                  <Text style={{ color: colors.text, fontWeight: "900" }} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{item.createdAt}</Text>
                  <Text style={{ color: colors.primary, fontWeight: "800" }}>
                    {item.url ? "Otwórz" : "Brak linku"}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {tab === "profile" && (
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ ...ui.card, alignItems: "center", gap: 10 }}>
              <Image
                source={{ uri: avatars[profile.avatarIndex] }}
                style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: colors.border }}
              />
              <Text style={{ color: colors.muted }}>Email: {email || "-"}</Text>

              <Text style={{ color: colors.text, fontWeight: "900" }}>Avatar (5 opcji)</Text>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                {avatars.map((u, idx) => (
                  <Pressable
                    key={u}
                    onPress={() => setProfile((p) => ({ ...p, avatarIndex: idx }))}
                    style={{
                      borderWidth: profile.avatarIndex === idx ? 2 : 1,
                      borderColor: profile.avatarIndex === idx ? colors.primary : colors.border,
                      borderRadius: 18,
                      padding: 2,
                    }}
                  >
                    <Image source={{ uri: u }} style={{ width: 52, height: 52, borderRadius: 16 }} />
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ ...ui.card, gap: 10 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Dane osobowe</Text>

              <TextInput
                placeholder="Imię i nazwisko"
                placeholderTextColor={colors.muted}
                value={profile.fullName}
                onChangeText={(t) => setProfile((p) => ({ ...p, fullName: t }))}
                style={ui.input}
              />
              <TextInput
                placeholder="Telefon"
                placeholderTextColor={colors.muted}
                value={profile.phone}
                onChangeText={(t) => setProfile((p) => ({ ...p, phone: t }))}
                style={ui.input}
                keyboardType="phone-pad"
              />
              <TextInput
                placeholder="Miasto"
                placeholderTextColor={colors.muted}
                value={profile.city}
                onChangeText={(t) => setProfile((p) => ({ ...p, city: t }))}
                style={ui.input}
              />

              <Pressable onPress={onSaveProfile} style={{ ...ui.button, opacity: savingProfile ? 0.75 : 1 }}>
                <Text style={ui.buttonText}>{savingProfile ? "Zapisuję…" : "Zapisz profil"}</Text>
              </Pressable>

              <Pressable onPress={onLogout} style={[ui.smallBtn, { backgroundColor: "rgba(255,92,122,0.14)" }]}>
                <Text style={{ color: colors.danger, fontWeight: "900" }}>Wyloguj</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
