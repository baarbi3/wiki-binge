import { UpdateFormState } from '@/app/types/auth/profile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import React from 'react'
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmProps {
  onNext?: () => void,
  onBack?: () => void,
  updateForm: UpdateFormState,
  setUpdateForm: React.Dispatch<React.SetStateAction<UpdateFormState>>,
}

const Confirm = (props: ConfirmProps) => {
  const {updateForm, setUpdateForm, onNext, onBack} = props;
  const {profile, username} = updateForm;
  if (!profile || !username) return;

  return (
    <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={URL.createObjectURL(profile)} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{username}</span>
            </div>
          </div> 
          <DialogFooter>
              <Button variant="outline" onClick={onBack}>Back</Button>
              <Button onClick={onNext}>Save</Button>
          </DialogFooter>
    </div>
  )
}

export default Confirm