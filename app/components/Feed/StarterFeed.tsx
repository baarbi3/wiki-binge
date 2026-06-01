import React, { useState } from 'react'


const StarterFeed = () => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any | null>(null); // Please write a WikiResult Type later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function searchWikipedia() {
    if (!term.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/wikipedia?q=${encodeURIComponent(term)}`
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>StarterFeed</div>
  )
}

export default StarterFeed