import { supabase } from '@/app/context/AuthContext';
import { itemType } from '@/app/types/feed/items';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import React, { useState } from 'react'

interface propsType {
 item: itemType,
}

const HandleLike = (props: propsType) => {
  const {item} = props;
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  async function handleLike(articleId: number) {
    const { error } = await supabase.rpc("like_article", {
      p_article_id: articleId,
    });

    if (error) {
      console.error(error);
      return;
    }

    setLikedMap(prev => ({
      ...prev,
      [articleId]: true,
    }));
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleLike(item.id)}
    >
      <HeartIcon
        className={likedMap[item.id] ? "fill-red-500 stroke-red-500" : ""}
      />
      Like
    </Button>
  )
}

export default HandleLike