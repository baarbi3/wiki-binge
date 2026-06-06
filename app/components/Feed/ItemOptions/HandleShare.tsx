import { itemType } from '@/app/types/feed/items';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import React, { useState } from 'react'

interface propsType {
  item: itemType
}

const HandleShare = (props: propsType) => {
  const {item} = props

  const [copied, setCopied] = useState(false);

  const handleClick = async (url:string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={() => handleClick(item.url)}>
      {copied ? <Check /> : <Clipboard />}
      {copied ? "Copied" : "Share"}
    </Button>
  )
}

export default HandleShare