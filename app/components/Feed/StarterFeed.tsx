import { supabase, useAuth } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react'
import FeedCarousel from './FeedCarousel';
import { itemType } from '@/app/types/feed/items';

interface propsType {
  callFetchSummary: (titles: string[]) => void;
  results: any,
  loading: boolean,
  error: string | null
}

const StarterFeed = (props: propsType) => {
  const { callFetchSummary, results } = props;
  const { currentUser, userDataObj } = useAuth();
  const [titles, setTitles] = useState<string[]>([]);

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

      setTitles(articles?.map(a => a.title) ?? []);
    }

    load();
  }, [userDataObj?.id]);

  useEffect(() => {
    if (titles.length > 0) {
      callFetchSummary(titles);
    }
  }, [titles, callFetchSummary]);

  useEffect(() => {
    if (!results) return;

    console.log(results);
  }, [results]);

  return (
    <div>
    </div>
  )
4}

export default StarterFeed