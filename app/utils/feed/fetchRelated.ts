import { RelatedResponse } from "@/app/types/feed/related";

// Add three related articles to the database when someone interacts with one
export const fetchRelated = async (title: string) => {
  try {
    const res = await fetch("/api/wikipedia/related", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Related API failed:", res.status, text);
      return;
    }

    const data:RelatedResponse = await res.json();
    return data
  } catch (err) {
    console.error("fetchRelated crashed:", err);
  }
}