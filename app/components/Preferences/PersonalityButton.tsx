"use client"

import { Button } from '@/components/ui/button';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'
import { supabase, useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { delay } from '../../utils/helpers/delay';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

interface propsType {
  selectedItems: number[]
}
const PersonalityButton = (props: propsType) => {
  const {selectedItems} = props
  const [loading, setLoading] = useState(false)
  const { userDataObj } = useAuth();


  async function handleSubmit() {
    if (!userDataObj?.id) {
      toast.error("You must be logged in.")
      return
    }
  
    setLoading(true)
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("user_interests")
        .select("interest_id")
        .eq("user_id", userDataObj.id)
    
      if (fetchError) {
        console.error(fetchError)
        toast.error("Failed to load existing interests.")
        return
      }
    
      const existingSet = new Set(existing?.map(i => i.interest_id) ?? [])
      const selectedSet = new Set(selectedItems)
    
      const toInsert = selectedItems.filter(id => !existingSet.has(id))
      const toDelete = [...existingSet].filter(id => !selectedSet.has(id))
    
      // Skip Supabase entirely if nothing changed
      if (toInsert.length === 0 && toDelete.length === 0) {
        toast.info("No changes to save.")
        return
      }
    
      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("user_interests")
          .insert(toInsert.map(id => ({ user_id: userDataObj.id, interest_id: id })))
      
        if (insertError) {
          console.error(insertError)
          toast.error("Failed to save interests.")
          return
        }
      }
    
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("user_interests")
          .delete()
          .eq("user_id", userDataObj.id)
          .in("interest_id", toDelete)
      
        if (deleteError) {
          console.error(deleteError)
          toast.error("Failed to remove interests.")
          return
        }
      }
    
      toast.success("Success → Redirecting to Feed Page")
      await delay(1000)
      redirect("/app")
    } catch (err) {
      if (isRedirectError(err)) throw err  // let Next.js handle it
      console.error(err)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
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