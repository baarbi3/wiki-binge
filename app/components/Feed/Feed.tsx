"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import StarterFeed from "./StarterFeed";

export default function Feed() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [titles, setTitles] = useState<{ id: string; title: string }[]>([]);
  // -------------------------
  // utils
  // -------------------------
  const chunk = useCallback(<T,>(arr: T[], size: number) => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  }, []);

  const batches = useMemo(() => {
    return chunk(titles, 5);
  }, [titles, chunk]);

  const currentBatch = batches[batchIndex] ?? [];

  // -------------------------
  // API
  // -------------------------
  const fetchSummary = useCallback(async (items: { id: string; title: string }[]) => {
    const res = await fetch("/api/wikipedia/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }, []);

  // -------------------------
  // LOAD SINGLE BATCH
  // -------------------------
  const loadBatch = useCallback(async () => {
    if (!currentBatch.length) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchSummary(currentBatch);

      setResults((prev) => [...prev, ...data]);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, [currentBatch, fetchSummary]);

  // -------------------------
  // NEXT BATCH TRIGGER
  // -------------------------
  const nextBatch = useCallback(() => {
    setBatchIndex((i) => i + 1);
  }, []);


  // -------------------------
  // Use Effect hooks to preload titles
  // -------------------------

useEffect(() => {
  if (!titles.length) return;

  setResults([]);
  setBatchIndex(0);

  const firstBatch = chunk(titles, 5)[0] ?? [];
  if (!firstBatch.length) return;

  setLoading(true);
  setError(null);

  fetchSummary(firstBatch)
    .then((data) => setResults(data))  // set directly, not append
    .catch(() => setError("Failed to fetch results"))
    .finally(() => setLoading(false));

}, [titles]);

// Only runs for subsequent batches (index > 0)
useEffect(() => {
  if (batchIndex === 0) return;
  loadBatch();
}, [batchIndex]);


  return (
    <StarterFeed
      results={results}
      loading={loading}
      error={error}
      loadBatch={loadBatch}
      nextBatch={nextBatch}
      titles={titles}
      setTitles={setTitles}
    />
  );
}