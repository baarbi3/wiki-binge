import { itemType } from '@/app/types/feed/items';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HandleLike from './ItemOptions/HandleLike';
import HandleShare from './ItemOptions/HandleShare';

interface propsType {
  items: itemType[];
  nextBatch: () => void
}

const FeedCarousel = (props: propsType) => {
  const {nextBatch, items} = props
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'up' | 'down') => {
    const container = containerRef.current;
    if (!container) return;
    const height = container.clientHeight;
    container.scrollBy({
      top: direction === 'down' ? height : -height,
      behavior: 'smooth',
    });
  };

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom) nextBatch();
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [nextBatch]);

  
  return (
    <div className="relative w-full h-screen">
      {/* Scrollable snap container */}
      <div className="flex justify-center h-full w-full">
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide max-w-2xl"
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="h-screen w-full snap-start snap-always flex items-center justify-center p-8"
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
          ))}
        </div>
      </div>
      {/* Nav buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 max-md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollTo('up')}
        >
        <ChevronUp className="w-5 h-5 text-card-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollTo('down')}
        >
          <ChevronDown className="w-5 h-5 text-card-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default FeedCarousel;