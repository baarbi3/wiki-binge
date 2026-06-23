import { supabase, useAuth } from '@/app/context/AuthContext';
import React, { useEffect } from 'react'

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


const MainFeed = (props: propsType) => {
  const { setTitles, titles, results, loading, loadBatch, nextBatch, containerRef } = props;
  const { currentUser, userDataObj } = useAuth();

  if (!currentUser) return null
  if (!userDataObj) return null

  useEffect(() => {
    async function load() {
      if (!userDataObj) return;
        
      const userEmbedding = userDataObj.embedding_sum.map(
        (x: number) => x / userDataObj.like_count
      );
    
      const { data: articles, error: articlesError } = await supabase.rpc(
        'match_articles',
        {
          query_embedding: userEmbedding,
          match_count: 20
        }
      );
    
      if (articlesError) {
        console.error(articlesError);
        return;
      }
    
      console.log(articles);
    }

    load();
  }, [userDataObj.id])

  return (
    <div>MainFeed</div>
  )
}

export default MainFeed