import { supabase } from "@/app/context/AuthContext";
import { itemType } from "@/app/types/feed/items";

export const fetchEmbedding = async(item: itemType) => {
  try {
    const res = await fetch("/api/wikipedia/embedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: item.id,
        articleDescription: item.description,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Related API failed:", res.status, text);
      return;
    }

    const data = await res.json();
    return data
  } catch (err) {
    console.error("fetchRelated crashed:", err);
  }
}

// --- Calculate total_likes and embedding_sum of each user ---
export const storeEmbedding = async (userId: string) => {
  const { data: likedArticles, error: likedArticlesError } =
    await supabase
      .from("article_likes")
      .select("article_id")
      .eq("user_id", userId);

  if (likedArticlesError || !likedArticles) {
    console.error(likedArticlesError);
    return;
  }

  const articleIds = likedArticles.map((a) => a.article_id);
 
  // Fetch embedding of the likedArticles
  const { data: embeddings, error: embeddingsError } =
    await supabase
      .from("articles")
      .select("embedding")
      .in("id", articleIds);

  if (embeddingsError || !embeddings || !embeddings.length) {
    console.error(embeddingsError);
    return;
  }

  const dim = embeddings[0].embedding.length;

  const totalEmbedding = embeddings.reduce((acc, row) => {
    return acc.map((v, i) => v + row.embedding[i]);
  }, new Array(dim).fill(0));

  const { error: updateTotalError } =
    await supabase
      .from("users")
      .update({
        total_likes: likedArticles.length,
        embedding_sum: totalEmbedding,
      })
      .eq("id", userId);

  if (updateTotalError) {
    console.error(updateTotalError);
    return;
  }
};