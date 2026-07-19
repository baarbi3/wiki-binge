import { ai } from "@/app/utils/ai/ai";
import { createClient } from "@supabase/supabase-js";

// Post Function to fetch embeddings for an article
export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SECRET_KEY!
  );

  const {article, articleDescription} = await req.json();

  if (!article) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const {data, error} = await supabase.from('articles').select("id, title, embedding").eq("id", article).single();

  if (error) {
    return Response.json(
      { error: "Supabase request failed", status: getHttpStatus(error.code), body: error },
      { status: getHttpStatus(error.code) }
    );
  }

  if (!data) {
    return Response.json(
      { error: "Article not found" },
      { status: 404 }
    );
  }
  
  if (data.embedding) {
    return Response.json(data);
  }
  
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: articleDescription,
  });

  const { data: articleData, error: articleError } = await supabase
  .from("articles")
  .update({
    embedding: result.embeddings?.[0]?.values
  })
  .eq("id", article)
  .select("id, title, embedding")
  .single();
  
  if (articleError) {
    return Response.json(
      { error: "Supabase request failed", status: getHttpStatus(articleError.code), body: articleError },
      { status: getHttpStatus(articleError.code) }
    );
  }
  return Response.json(articleData);
}