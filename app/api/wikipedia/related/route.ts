import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


type pageType = {
  ns: number,
  title: string,
  snippet: string,
  pageid: number,
  size: number,
  timestamp: string,
  wordcount: number,
}

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SECRET_KEY!
  );
  const { title, userId } = await req.json();

  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: `morelike:${title}`,
    srlimit: "3",
    format: "json",
    origin: "*",
  });

  const url = `https://en.wikipedia.org/w/api.php?${params}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "wiki-binge-dev/1.0 (contact: ayan.whiz@gmail.com)",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json(
      { error: "Wikipedia request failed", status: res.status, body: text },
      { status: res.status }
    );
  }

  const data = await res.json();
  const pages = data.query?.search ?? [];

  const { data: existingArticles, error: existingError } = await supabase
    .from("articles")
    .select("title")
    .in(
      "title",
      pages.map((page: pageType) => page.title)
    );

  if (existingError) {
    throw existingError;
  }

  const existingTitles = new Set(
    existingArticles.map((article) => article.title)
  );

  const newPages = pages.filter(
    (page: pageType) => !existingTitles.has(page.title)
  );

  const embeddings = (
    await Promise.all(
      newPages.map(async (page: pageType) => {
        const result = await ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: page.snippet,
        });

        const embedding = result.embeddings?.[0]?.values;

        if (!embedding) {
          return null;
        }

        return {
          title: page.title,
          embedding,
        };
      })
    )
  ).filter(Boolean);

  if (embeddings.length > 0) {
    const { error } = await supabase
      .from("articles")
      .upsert(embeddings, {
        onConflict: "title",
        ignoreDuplicates: true,
      })
    if (error) {
      console.error(error);
    }
  }

  return Response.json({ pages });
}