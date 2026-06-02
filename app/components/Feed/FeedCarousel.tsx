import { itemType } from '@/app/types/feed/items';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import React from 'react'

interface propsType {
  items: itemType[]
}

const FeedCarousel = (props: propsType) => {
  const { items } = props

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      <CarouselContent className="-mt-1">
        {items.map((item) => ( 
          <CarouselItem key={item.id} className="basis-1/2 pt-1">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="font-display">item</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )

}

export default FeedCarousel