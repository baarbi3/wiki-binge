// Filter against unread

import { supabase } from "@/app/context/AuthContext";
import { titleType } from "@/app/types/feed/items";

export async function checkRead(titles: titleType[], userId: string) {
  const { data } = await supabase
    .from("read_posts")
    .select("article_id")
    .eq("user_id", userId);
  
  const readIds = new Set(
    (data ?? []).map((r: any) => String(r.article_id))
  );

  const unreadItems = titles.filter(
    (item) => !readIds.has(String(item.id))
  );

  return unreadItems;
}