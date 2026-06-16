import { supabase, useAuth } from '@/app/context/AuthContext';
import { itemType } from '@/app/types/feed/items';
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

  // Add three related articles to the database when someone likes one
  const fetchRelated = async (title: string) => {
    try {
      const res = await fetch("/api/wikipedia/related", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          userId: userDataObj?.id,
        }),
      });
    
      if (!res.ok) {
        const text = await res.text();
        console.error("Related API failed:", res.status, text);
        return;
      }
    
      const data = await res.json();
      console.log("related:", data);
    } catch (err) {
      console.error("fetchRelated crashed:", err);
    }
  };

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
      fetchRelated(item.title)
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