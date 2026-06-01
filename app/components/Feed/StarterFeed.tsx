import { supabase, useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react'


const StarterFeed = () => {
  const { currentUser, userDataObj } = useAuth();
  const [titles, setTitles] = useState<string[]>([]);
  const [results, setResults] = useState<any | null>(null); // Please write a WikiResult Type later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) {
    return null
  }
  
  async function fetchSummary(title: string) {
    const res = await fetch(
      `/api/wikipedia/summary?title=${encodeURIComponent(title)}`
    );

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return res.json();
  }

  async function callFetchSummary() {
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

  useEffect(() => {
    async function load() {
      const userId = userDataObj?.id;
      if (!userId) return;
    
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_id')
        .eq('user_id', userId);
    
      if (error) return;
    
      const interestIds = data?.map(row => row.interest_id) ?? [];
    
      const allTitles: string[] = [];
    
      for (const id of interestIds) {
        const { data: articles, error } = await supabase
          .from('articles')
          .select('title')
          .eq('category_hint_interest_id', id);
      
        if (!error && articles) {
          allTitles.push(...articles.map(a => a.title));
        }
      }
    
      setTitles(allTitles);
    }
  
    load();
  }, [userDataObj?.id]);

  return (
    <div>StarterFeed</div>
  )
4}

export default StarterFeed