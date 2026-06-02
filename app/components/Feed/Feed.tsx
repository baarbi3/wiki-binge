"use client";

import React, { useCallback, useState } from "react";
import StarterFeed from "./StarterFeed";

export default function Feed() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (titles: string[]) => {
    const res = await fetch("/api/wikipedia/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titles }),
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return res.json();
  }, []);

  const callFetchSummary = useCallback(async (titles: string[]) => {
    if (!titles?.length) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchSummary(titles);
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, [fetchSummary]);

  return (
    <StarterFeed
      callFetchSummary={callFetchSummary}
      results={results}
      loading={loading}
      error={error}
    />
  );
}