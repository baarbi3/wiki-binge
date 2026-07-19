import React from 'react'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/app/context/AuthContext';
import { UpdateFormState } from '@/app/types/auth/profile';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EditProps {
  onNext?: () => void
  onBack?: () => void
  updateForm: UpdateFormState,
  setUpdateForm: React.Dispatch<React.SetStateAction<UpdateFormState>>,
}


const Edit = (props: EditProps) => {
  const {updateForm, setUpdateForm, onNext, onBack} = props;
  const {username, profile } = updateForm;
  const {userDataObj} = useAuth();
  return (
    <>
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="username-1">Username</Label>
        <Input id="username-1" name="username" value={username} onChange={(e) => {setUpdateForm(f => ({ ...f, username: e.target.value }))}} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="picture">Picture</Label>
        <Input 
          id="picture" 
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setUpdateForm(f => ({ ...f, profile: file }))
            }
          }}
        />
      </div>
    </div>
    <DialogFooter>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button type="button" onClick={onNext}>Continue</Button>
    </DialogFooter>
    </>

  )
}

export default Edit