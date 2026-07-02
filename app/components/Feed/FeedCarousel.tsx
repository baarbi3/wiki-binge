import { itemType } from '@/app/types/feed/items';
import React, { useEffect, useRef, useState } from 'react';
import ItemCard from './ItemCard';

interface propsType {
  items: itemType[];
  nextBatch: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>
}

const FeedCarousel = (props: propsType) => {
  const {nextBatch, items, containerRef} = props

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
    <div
      ref={containerRef}
      className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide w-full max-w-2xl mx-auto"
    >
        {items.map((item) => (
        <ItemCard item={item} containerRef={containerRef} key={item.id}/>
      ))}
    </div>
  );
};

export default FeedCarousel;