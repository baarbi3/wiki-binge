import { supabase, useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react'
import FeedCarousel from './FeedCarousel';
import { itemType } from '@/app/types/feed/items';

interface propsType {
  results: any,
  loading: boolean,
  error: string | null,
  loadBatch: () => Promise<void>,
  nextBatch: () => void,
  setTitles: React.Dispatch<React.SetStateAction<string[]>>
  titles: string[]
}

const StarterFeed = (props: propsType) => {
  const { setTitles, titles, results, loading, loadBatch, nextBatch } = props;
  const { currentUser, userDataObj } = useAuth();

  if (!currentUser) {
    return null
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

      const { data: articles, error: articleError } = await supabase
        .from('articles')
        .select('title')
        .in('category_hint_interest_id', interestIds);

      if (articleError) return;

      const titles = (articles ?? [])
        .map((a: any) => a?.title)
        .filter(Boolean);

      // Fisher-Yates shuffle
      for (let i = titles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [titles[i], titles[j]] = [titles[j], titles[i]];
      }

      setTitles(titles);
    }

    load();
  }, [userDataObj?.id]);


  useEffect(() => {
    if (!results) return;

    console.log(results);
  }, [results]);

  return (
    <div className="w-full">
      <FeedCarousel items={results}/>
    </div>
  )
4}

export default StarterFeed