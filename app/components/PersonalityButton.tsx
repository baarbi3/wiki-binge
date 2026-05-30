import { Button } from '@/components/ui/button';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'

const PersonalityButton = () => {
  const [loading, setLoading] = useState(false)  
  return (
    <div>
      <Button variant="outline">
        {loading ? <> <ArrowRight/></> : <> <LoaderCircle className="animate-spin" /></>}
      </Button>
    </div>
  )
}

export default PersonalityButton