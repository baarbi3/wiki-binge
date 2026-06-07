import { useCallback } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { supabase } from "../context/AuthContext";

export function useLogRead(userId: string | undefined) {
  return useCallback(async (articleId: string) => {
    if (!userId) return;

    const { error } = await supabase.from("read_posts").upsert(
      { user_id: userId, article_id: articleId, read_at: new Date().toISOString() },
      { onConflict: "user_id,article_id" }
    );

    if (error) console.error("useLogRead error:", error.message, error.code);
  }, [userId]);
}