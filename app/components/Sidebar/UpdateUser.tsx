import React, { useState } from 'react'
import {
    DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import { PFPStep, UpdateFormState } from '@/app/types/auth/profile';
import PFPRouter from './PFPRouter';

const UpdateUser = () => {
  const { currentUser, userDataObj, update } = useAuth();
  const [ step, setStep ] = React.useState<PFPStep>(PFPStep.Edit)
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    username: "",
    profile: null,
  })
  const {profile, username} = updateForm;

  async function handleSubmit() {
    const form = new FormData()
    let profile_img = "https://example.com/image.png";

    if (profile) {
      form.append('image', profile)
      
      const res = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: form,
      })

      const { url } = await res.json();
      profile_img = url
    }

    if (username) {
      await update(username, profile_img); 
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Choose a new profile image or username</DialogDescription>
      </DialogHeader>

      <PFPRouter step={step} setStep={setStep} updateForm={updateForm} setUpdateForm={setUpdateForm} onSubmit={() => handleSubmit()} ></PFPRouter>
{/*
      <DialogFooter className="my-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
*/}
    </div>
  )
}

export default UpdateUser