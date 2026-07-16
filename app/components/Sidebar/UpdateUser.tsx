import React from 'react'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const UpdateUser = () => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Choose a new profile image or </DialogDescription>
      </DialogHeader>
      <Field>
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
        <Input
          type="text"
          placeholder="Enter your new username"
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
    </div>
  )
}

export default UpdateUser