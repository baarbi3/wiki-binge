import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { titles } = await req.json();

  if (!Array.isArray(titles)) {
    return NextResponse.json(
      { error: "titles must be an array" },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    titles.map(async (title: string) => {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      if (!res.ok) return null;

      return res.json();
    })
  );

  return NextResponse.json(
    results.filter(Boolean).map((item: any) => ({
      title: item.title,
      description: item.description ?? "",
      extract: item.extract_html ?? "",
      url: item.content_urls?.desktop?.page ?? "",
  }))

);}