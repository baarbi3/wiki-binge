import { createClient } from "@/app/utils/supabase/client";
import { NextResponse } from "next/server";

type Item = {
  id: string;
  title: string;
};

function normalizeTitle(title: string) {
  return title.trim().toLowerCase();
}

export async function POST(req: Request) {
  const { items = [], userId } = await req.json();

  if (!Array.isArray(items)) {
    return NextResponse.json([]);
  }

  /* -----------------------------
     1. Deduplicate incoming items
  ------------------------------ */
  const uniqueById = new Map<string, Item>();

  for (const item of items) {
    if (!item?.id || !item?.title) continue;
    if (!uniqueById.has(item.id)) {
      uniqueById.set(item.id, item);
    }
  }

  const dedupedItems = [...uniqueById.values()];

  /* -----------------------------
     2. Fetch read IDs (Supabase)
  ------------------------------ */
  let readIds = new Set<string>();

  if (userId) {
    const supabase = createClient();

    const { data } = await supabase
      .from("read_posts")
      .select("article_id")
      .eq("user_id", userId);

    readIds = new Set(
      (data ?? []).map((r: any) => String(r.article_id))
    );
  }

  /* -----------------------------
     3. Filter unread items
  ------------------------------ */
  const unreadItems = dedupedItems.filter(
    (item) => !readIds.has(String(item.id))
  );

  /* -----------------------------
     4. Deduplicate by normalized title
        (prevents duplicate fetches)
  ------------------------------ */
  const uniqueByTitle = new Map<string, Item>();

  for (const item of unreadItems) {
    const key = normalizeTitle(item.title);
    if (!uniqueByTitle.has(key)) {
      uniqueByTitle.set(key, item);
    }
  }

  const finalItems = [...uniqueByTitle.values()];

  /* -----------------------------
     5. Fetch Wikipedia summaries
  ------------------------------ */
  const results = await Promise.all(
    finalItems.map(async (item) => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            item.title
          )}`
        );

        if (!res.ok) return null;

        const data = await res.json();

        return {
          data,
          id: item.id,
        };
      } catch {
        return null;
      }
    })
  );

  /* -----------------------------
     6. Shape response
  ------------------------------ */
  return NextResponse.json(
    results
      .filter((r): r is { data: any; id: string } => Boolean(r))
      .map(({ data, id }) => ({
        id,
        title: data.title,
        description: data.description ?? "",
        extract: data.extract_html ?? "",
        url: data.content_urls?.desktop?.page ?? "",
      }))
  );
}