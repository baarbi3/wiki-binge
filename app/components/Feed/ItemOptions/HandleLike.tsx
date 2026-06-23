import { supabase, useAuth } from '@/app/context/AuthContext';
import { itemType } from '@/app/types/feed/items';
import { RelatedResponse } from '@/app/types/feed/related';
import { fetchEmbedding, storeEmbedding } from '@/app/utils/feed/fetchEmbedding';
import { fetchRelated } from '@/app/utils/feed/fetchRelated';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface propsType {
 item: itemType,
}

const HandleLike = (props: propsType) => {
  const {item} = props;
  const {userDataObj} = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!item.id || !userDataObj?.id) return;

    async function fetchLikes() {
      const { data } = await supabase
        .from("articles")
        .select("likes")
        .eq("id", item.id)
        .single();

      if (data) setLikes(data.likes);
    }

    async function checkLiked() {
      const { data, error } = await supabase
        .from("article_likes")
        .select("article_id")
        .eq("user_id", userDataObj?.id)
        .eq("article_id", item.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      setLiked(!!data);
    }

    fetchLikes();
    checkLiked();
  }, [item.id, userDataObj?.id]);

  async function handleLike(articleId: number) {
    const { error } = await supabase.rpc("like_article", {
      p_article_id: articleId,
    });

    if (error) {
      console.error(error);
      return;
    }

    if (!liked) {
      setLiked(true);
      setLikes(prev => prev + 1);
      // Get related articles on like
      await fetchRelated(item.title);
      // Make sure you've the AI embedding for this article
      await fetchEmbedding(item);

      // Calculate the user profile's embedding
      if (!userDataObj) return;
      await storeEmbedding(userDataObj.id);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleLike(item.id)}
    >
      <HeartIcon
        className={liked ? "fill-red-500 stroke-red-500" : ""}      
      />
      {likes}
    </Button>
  )
}

export default HandleLike