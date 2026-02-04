import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "taskhub:user";
const SESSION_KEY = "taskhub:session";

export type RegisteredUser = { email: string; password: string };

export async function registerUser(user: RegisteredUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getRegisteredUser(): Promise<RegisteredUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setSession(email: string) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

export async function getSession(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    return obj?.email ?? null;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
