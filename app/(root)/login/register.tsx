import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../src/components/Screen";
import { colors, ui } from "../../../src/theme/ui";
import { registerUser } from "../../../src/storage/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailOk = useMemo(() => emailRegex.test(email.trim().toLowerCase()), [email]);
  const passOk = useMemo(() => password.trim().length >= 6, [password]);

  const onRegister = async () => {
    const e = email.trim().toLowerCase();
    const p = password.trim();

    if (!emailRegex.test(e)) return Alert.alert("Błąd", "Podaj poprawny email.");
    if (p.length < 6) return Alert.alert("Błąd", "Hasło min. 6 znaków.");

    await registerUser({ email: e, password: p });
    Alert.alert("OK", "Konto utworzone. Zaloguj się.");
    router.replace("/(root)/login");
  };

  return (
    <Screen>
      <View style={{ ...ui.screen, justifyContent: "center", gap: 12 }}>
        <Text style={ui.title}>Rejestracja</Text>

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
          placeholder="Hasło (min. 6 znaków)"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={ui.input}
        />
        {!passOk && password.length > 0 ? (
          <Text style={{ color: colors.danger }}>Hasło za krótkie.</Text>
        ) : null}

        <Pressable onPress={onRegister} style={ui.button}>
          <Text style={ui.buttonText}>Utwórz konto</Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={ui.link}>Wróć</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
