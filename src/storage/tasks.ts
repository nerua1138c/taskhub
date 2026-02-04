import AsyncStorage from "@react-native-async-storage/async-storage";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
};

const KEY = "taskhub:tasks";

export async function loadTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}

export function toDayKey(ts: number) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function countCompletedByDay(tasks: Task[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const t of tasks) {
    if (t.done && t.completedAt) {
      const key = toDayKey(t.completedAt);
      map[key] = (map[key] ?? 0) + 1;
    }
  }
  return map;
}

export function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString();
}
