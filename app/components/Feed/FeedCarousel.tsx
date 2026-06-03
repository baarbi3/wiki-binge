import { itemType } from '@/app/types/feed/items';
import React, { useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface propsType {
  items: itemType[];
}

const FeedCarousel = ({ items }: propsType) => {
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
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Nav buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollTo('up')}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollTo('down')}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default FeedCarousel;