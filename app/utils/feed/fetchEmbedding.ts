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

  const { data: embeddings, error: embeddingsError } =
    await supabase
      .from("articles")
      .select("embedding")
      .in("id", articleIds);

  if (embeddingsError || !embeddings || embeddings.length === 0) {
    console.error(embeddingsError);
    return;
  }

  // ---- SAFE NORMALIZER ----
  const normalizeEmbedding = (e: any): number[] => {
    if (!e) throw new Error("Missing embedding");

    // Case 1: already array
    if (Array.isArray(e)) {
      return e.map(Number).filter(Number.isFinite);
    }

    // Case 2: pgvector string: "[0.1,0.2,...]"
    if (typeof e === "string") {
      try {
        const parsed = JSON.parse(e);
        if (Array.isArray(parsed)) {
          return parsed.map(Number).filter(Number.isFinite);
        }
      } catch {
        throw new Error("Invalid embedding string format");
      }
    }

    throw new Error("Unsupported embedding format");
  };

  const vectors = embeddings
    .map((row) => normalizeEmbedding(row.embedding))
    .filter((v) => v.length > 0);

  if (vectors.length === 0) {
    console.error("No valid embeddings found");
    return;
  }

  const dim = vectors[0].length;

  // ensure consistent dimensionality
  for (const v of vectors) {
    if (v.length !== dim) {
      throw new Error("Embedding dimension mismatch");
    }
  }

  // ---- SUM VECTORS ----
  const totalEmbedding = vectors.reduce((acc, vec) => {
    return acc.map((v, i) => v + vec[i]);
  }, new Array(dim).fill(0));

  // ---- FINAL SAFETY CHECK ----
  if (!totalEmbedding.every(Number.isFinite)) {
    throw new Error("Invalid numeric result in embedding_sum");
  }

  const { error: updateTotalError } = await supabase
    .from("users")
    .update({
      like_count: likedArticles.length,
      embedding_sum: totalEmbedding,
    })
    .eq("id", userId);

  if (updateTotalError) {
    console.error(updateTotalError);
    return;
  }
};