"use client"

import { Button } from '@/components/ui/button';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'
import { supabase, useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { delay } from '../utils/helpers/delay';

interface propsType {
  selectedItems: number[]
}
const PersonalityButton = (props: propsType) => {
  const {selectedItems} = props
  const [loading, setLoading] = useState(false)
  const { userDataObj } = useAuth();

async function handleSubmit() {
  setLoading(true)

  try {
    if (!userDataObj?.id) return

    const { data: existing, error } = await supabase
      .from("user_interests")
      .select("interest_id")
      .eq("user_id", userDataObj.id)

    if (error) {
      console.error(error)
      return
    }

    const existingSet = new Set(existing?.map(i => i.interest_id) ?? [])
    const selectedSet = new Set(selectedItems)

    // what to add
    const toInsert = selectedItems.filter(id => !existingSet.has(id))

    // what to remove
    const toDelete = [...existingSet].filter(id => !selectedSet.has(id))

    // INSERT new ones
    if (toInsert.length > 0) {
      await supabase.from("user_interests").insert(
        toInsert.map(id => ({
          user_id: userDataObj.id,
          interest_id: id
        }))
      )
    }

    // DELETE removed ones
    if (toDelete.length > 0) {
      await supabase
        .from("user_interests")
        .delete()
        .eq("user_id", userDataObj.id)
        .in("interest_id", toDelete)
    }

  } finally {
    setLoading(false)
    toast("Success -> Redirecting to Feed Page")
    await delay(1000)
    redirect("/app")
  }
}

  return (
    <div className="mb-6">
      <Button size={"lg"} onClick={() => handleSubmit()}>
        {loading ? <> <LoaderCircle className="animate-spin" /></> : <> <ArrowRight/></>}
        Submit
      </Button>
    </div>
  )
}

export default PersonalityButton