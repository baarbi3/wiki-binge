import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { items } = await req.json();


const results = await Promise.all(
  items.map(async (item: { id: string; title: string }) => {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.title)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { data, id: item.id };
  })
);

return NextResponse.json(
  results
    .filter(Boolean)
    .map(({ data, id }: any) => ({
      title: data.title,
      description: data.description ?? "",
      extract: data.extract_html ?? "",
      url: data.content_urls?.desktop?.page ?? "",
      id, 
    }))
);
}