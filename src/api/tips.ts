export async function fetchSampleTodos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!res.ok) throw new Error("Network error");
  return res.json() as Promise<Array<{ id: number; title: string }>>;
}
