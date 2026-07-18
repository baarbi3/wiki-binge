import React from 'react'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/app/context/AuthContext';
import { UpdateFormState } from '@/app/types/auth/profile';

interface EditProps {
  onNext?: () => void
  onBack?: () => void
  updateForm: UpdateFormState,
  setUpdateForm: React.Dispatch<React.SetStateAction<UpdateFormState>>,
}


const Edit = (props: EditProps) => {
  const {userDataObj} = useAuth();
  return (
    <div>
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
        <Input id="picture" type="file" />
        <FieldLabel htmlFor="picture">Profile Image</FieldLabel>
        <FieldDescription>Select a picture to upload.</FieldDescription>
      </Field>
    </div>
  )
}

export default Edit