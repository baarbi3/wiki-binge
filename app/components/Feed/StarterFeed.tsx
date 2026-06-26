import { supabase, useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react'
import FeedCarousel from './FeedCarousel';
import { itemType } from '@/app/types/feed/items';
import { checkRead } from '@/app/utils/feed/checkRead';

interface propsType {
  results: any,
  loading: boolean,
  error: string | null,
  loadBatch: () => Promise<void>,
  nextBatch: () => void,
  titles: { id: string; title: string }[]
  setTitles: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>
  containerRef: React.RefObject<HTMLDivElement | null>
}

const StarterFeed = (props: propsType) => {
  const { setTitles, titles, results, loading, loadBatch, nextBatch, containerRef } = props;
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
        .select('id, title')
        .in('category_hint_interest_id', interestIds);

      if (articleError) return;

      const titlesWithIds = (articles ?? [])
        .map((a: any) => a?.title && a?.id ? { id: a.id as string, title: a.title as string } : null)
        .filter((a): a is { id: string; title: string } => a !== null);

      // Fisher-Yates 
      for (let i = titlesWithIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [titlesWithIds[i], titlesWithIds[j]] = [titlesWithIds[j], titlesWithIds[i]];
      }

      const filteredTitles = await checkRead(titlesWithIds, userDataObj.id);


      setTitles(filteredTitles);
    }

    load();
  }, [userDataObj?.id]);


  return (
    <FeedCarousel nextBatch={nextBatch} items={results} containerRef={containerRef}/>
  )
}

export default StarterFeed