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
      className="h-screen w-full snap-start snap-always flex items-center justify-center p-8"
      ref={cardRef}
    >
      <div className="max-w-2xl w-full rounded-2xl border bg-card p-10 shadow-lg flex flex-col gap-4 text-foreground">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          {item.title}
        </h1>

        <span className="text-sm font-semibold text-muted-foreground">
          {item.description}
        </span>

        <span className="leading-7 text-base" dangerouslySetInnerHTML={{__html: item.extract}}></span>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4 self-start"
        >
          Read more on Wikipedia →
        </a>
        <div className="grid grid-cols-3 gap-2">
          <HandleLike item={item}/>
          <HandleShare item={item}/>
          <Button size="sm"><MessageCircle/> Comment</Button>
        </div>
      </div>
    </div>

  )
}

export default ItemCard