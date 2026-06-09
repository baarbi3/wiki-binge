"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import StarterFeed from "./StarterFeed";
import { useAuth } from "@/app/context/AuthContext";

interface propsType {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const BATCH_SIZE = 5;

export default function Feed(props: propsType) {
  const { userDataObj } = useAuth();
  const { containerRef } = props;

  const [results, setResults] = useState<any[]>([]);
  const [titles, setTitles] = useState<{ id: string; title: string }[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // prevents duplicate fetches
  const inFlightRef = useRef(false);

  // -------------------------
  // chunking (deterministic)
  // -------------------------
  const getBatch = useCallback(
    (index: number) => {
      const start = index * BATCH_SIZE;
      return titles.slice(start, start + BATCH_SIZE);
    },
    [titles]
  );

  // -------------------------
  // API
  // -------------------------
  const fetchSummary = useCallback(async (items: { id: string; title: string }[]) => {
    const res = await fetch("/api/wikipedia/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, userId: userDataObj?.id }),
    });

    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }, [userDataObj?.id]);

  // -------------------------
  // SINGLE FETCH ENGINE
  // -------------------------
  const loadBatch = useCallback(
    async (index: number) => {
      const batch = getBatch(index);
      if (!batch.length) return;

      if (inFlightRef.current) return;
      inFlightRef.current = true;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchSummary(batch);

        setResults((prev) => {
          // optional dedupe safety (prevents API duplication artifacts)
          const existingIds = new Set(prev.map((x) => x.id));
          const filtered = data.filter((x: any) => !existingIds.has(x.id));
          return [...prev, ...filtered];
        });
      } catch {
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [getBatch, fetchSummary]
  );

  // -------------------------
  // RESET PIPELINE WHEN TITLES CHANGE
  // -------------------------
  useEffect(() => {
    if (!titles.length) return;

    setResults([]);
    setBatchIndex(0);
  }, [titles]);

  // -------------------------
  // CORE STATE MACHINE
  // -------------------------
  useEffect(() => {
    if (!titles.length) return;

    loadBatch(batchIndex);
  }, [batchIndex, titles, loadBatch]);

  // -------------------------
  // NEXT BATCH TRIGGER
  // -------------------------
  const nextBatch = useCallback(() => {
    setBatchIndex((i) => i + 1);
  }, []);

  return (
    <StarterFeed
      results={results}
      loading={loading}
      error={error}
      loadBatch={() => loadBatch(batchIndex)}
      nextBatch={nextBatch}
      titles={titles}
      setTitles={setTitles}
      containerRef={containerRef}
    />
  );
}