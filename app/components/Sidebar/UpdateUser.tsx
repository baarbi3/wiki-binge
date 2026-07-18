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
  const { currentUser, userDataObj } = useAuth();
  const [ step, setStep ] = React.useState<PFPStep>(PFPStep.Edit)
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    username: "",
    profile: null,
  })

  async function handleSubmit() {
    
  }
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Choose a new profile image or username</DialogDescription>
      </DialogHeader>

      <PFPRouter step={step} setStep={setStep} updateForm={updateForm} setUpdateForm={setUpdateForm} onSubmit={() => handleSubmit()} ></PFPRouter>

      <DialogFooter className="my-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </div>
  )
}

export default UpdateUser