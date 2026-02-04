import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "taskhub:profile";

export type ProfileData = {
  fullName: string;
  phone: string;
  city: string;
  avatarIndex: number;
};

export const avatars = [
  "https://i.pravatar.cc/200?img=11",
  "https://i.pravatar.cc/200?img=22",
  "https://i.pravatar.cc/200?img=33",
  "https://i.pravatar.cc/200?img=44",
  "https://i.pravatar.cc/200?img=55",
];

export async function loadProfile(): Promise<ProfileData> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { fullName: "", phone: "", city: "", avatarIndex: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { fullName: "", phone: "", city: "", avatarIndex: 0 };
  }
}

export async function saveProfile(p: ProfileData) {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}
