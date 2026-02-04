import { countCompletedByDay, toDayKey, Task } from "../src/storage/tasks";

describe("storage/tasks", () => {
  test("toDayKey returns yyyy-mm-dd", () => {
    const ts = new Date("2026-02-04T10:20:30Z").getTime();
    const day = toDayKey(ts);
    expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("countCompletedByDay counts only completed tasks", () => {
    const base = new Date("2026-02-04T10:00:00Z").getTime();
    const dayKey = toDayKey(base);

    const tasks: Task[] = [
      { id: "1", title: "a", done: true, createdAt: base - 1000, completedAt: base },
      { id: "2", title: "b", done: true, createdAt: base - 2000, completedAt: base + 1234 },
      { id: "3", title: "c", done: false, createdAt: base - 3000 },
      { id: "4", title: "d", done: true, createdAt: base - 4000 }, // brak completedAt => nie liczymy
    ];

    const map = countCompletedByDay(tasks);
    expect(map[dayKey]).toBe(2);
  });
});
