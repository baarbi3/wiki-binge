"use client"
import { itemType } from '@/app/types/feed/items';
import React, { useEffect, useRef } from 'react'
import HandleLike from './ItemOptions/HandleLike';
import HandleShare from './ItemOptions/HandleShare';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { supabase, useAuth } from '@/app/context/AuthContext';
import { useLogRead } from '@/app/hooks/useLogRead';

interface propsType{
  item: itemType,
  containerRef: React.RefObject<HTMLDivElement | null>
}

const ItemCard = (props: propsType) => {
  const { item, containerRef } = props
  const {userDataObj} = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const logged = useRef(false);
  const logRead = useLogRead(userDataObj?.id);
  
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !logged.current) {
          logged.current = true;
          logRead(String(item.id));
        }
      },
      { threshold: 0.9, root: containerRef.current }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [item.id]);
  
  return (
    <div
      ref={cardRef}
      className="h-screen snap-start snap-always flex items-center justify-center px-3 py-4 sm:p-6 md:p-8 text-foreground"
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-card p-5 sm:p-8 md:p-10 shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">
          {item.title}
        </h1>
      
        <p className="text-sm font-medium text-muted-foreground">
          {item.description}
        </p>
      
        <div
          className="text-sm sm:text-base leading-7 break-words"
          dangerouslySetInnerHTML={{ __html: item.extract }}
        />
    
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4"
        >
          Read more on Wikipedia →
        </a>
      
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <HandleLike item={item} />
          <HandleShare item={item} />
          <Button size="sm">
            <MessageCircle />
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard