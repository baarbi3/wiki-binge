"use client"
import React, { useState } from 'react'

const Feed = () => {
  const [results, setResults] = useState<any | null>(null); // Please write a WikiResult Type later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSummary(title: string) {
    const res = await fetch(
      `/api/wikipedia/summary?title=${encodeURIComponent(title)}`
    );

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return res.json();
  }

  async function callFetchSummary(titles: string[]) {
    if (!titles || titles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const data = await Promise.all(
        titles.map((t) => fetchSummary(t))
      );

      setResults(data);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>Feed</div>
  )
}

export default Feed