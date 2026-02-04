import { Task } from "../src/storage/tasks";

function splitTasks(tasks: Task[]) {
  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  return { active, done };
}

describe("tasks splitting", () => {
  test("active contains only not-done tasks and done contains only done tasks", () => {
    const tasks: Task[] = [
      { id: "1", title: "A", done: false, createdAt: 1 },
      { id: "2", title: "B", done: true, createdAt: 2, completedAt: 3 },
    ];

    const { active, done } = splitTasks(tasks);
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe("1");
    expect(done).toHaveLength(1);
    expect(done[0].id).toBe("2");
  });
});
