import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react'

interface propsType {
  containerRef: React.RefObject<HTMLDivElement | null>
}

const NavButtons = (props: propsType) => {
  const {containerRef} = props

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
  )
}

export default NavButtons