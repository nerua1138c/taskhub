import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../src/components/Screen";
import { colors, ui } from "../../../src/theme/ui";
import { getRegisteredUser, setSession } from "../../../src/storage/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailOk = useMemo(() => emailRegex.test(email.trim().toLowerCase()), [email]);

  const onLogin = async () => {
    const e = email.trim().toLowerCase();
    const p = password.trim();

    if (!e || !p) return Alert.alert("Błąd", "Wpisz email i hasło.");
    if (!emailRegex.test(e)) return Alert.alert("Błąd", "Podaj poprawny email.");

    const user = await getRegisteredUser();
    if (!user) return Alert.alert("Brak konta", "Najpierw się zarejestruj.");

    if (user.email !== e || user.password !== p) {
      return Alert.alert("Błąd", "Nieprawidłowy email lub hasło.");
    }

    await setSession(e);
    Alert.alert("OK", "Zalogowano.");
    router.replace("/(root)/tasks");
  };

  return (
    <Screen>
      <View style={{ ...ui.screen, justifyContent: "center", gap: 12 }}>
        <Text style={ui.title}>Logowanie</Text>
        <Text style={ui.subtitle}>Zaloguj się, aby korzystać z zadań i kalendarza.</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={ui.input}
        />
        {!emailOk && email.length > 0 ? (
          <Text style={{ color: colors.danger }}>Niepoprawny email.</Text>
        ) : null}

        <TextInput
          placeholder="Hasło"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={ui.input}
        />

        <Pressable onPress={onLogin} style={ui.button}>
          <Text style={ui.buttonText}>Zaloguj</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(root)/login/register")}>
          <Text style={ui.link}>Nie mam konta — rejestracja</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
