import React, { useState } from 'react'
import {
    DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';

export type UpdateFormState = {
  username?: string,
  profile?: File | null,
};


export enum PFPStep {
  Edit,
  Preview,
  Confirm
}

const UpdateUser = () => {
  const { currentUser, userDataObj } = useAuth();
  const [ step, setStep ] = React.useState<PFPStep>(PFPStep.Edit)
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    username: "",
    profile: null,
  })

  return (
    <div>?
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Choose a new profile image or username</DialogDescription>
      </DialogHeader>
      <Field className="my-4">
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
        <Input
          type="text"
          placeholder={userDataObj?.username}
        />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="picture">Profile Image</FieldLabel>
        <Input id="picture" type="file" />
        <FieldDescription>Select a picture to upload.</FieldDescription>
      </Field>

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