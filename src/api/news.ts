export async function fetchLatestNews(): Promise<
  { id: string; title: string; url: string | null; createdAt: string }[]
> {
  const res = await fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=20");
  const json = await res.json();
  const hits = json?.hits ?? [];
  return hits.map((h: any) => ({
    id: String(h.objectID),
    title: h.title || "(bez tytułu)",
    url: h.url ?? null,
    createdAt: new Date(h.created_at).toLocaleString(),
  }));
}
