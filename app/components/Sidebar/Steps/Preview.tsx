import { UpdateFormState } from '@/app/types/auth/profile';
import { getCroppedImg } from '@/app/utils/uploadthing/cropImage';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import React, { useMemo, useState } from 'react'
import Cropper from 'react-easy-crop';

interface PreviewProps {
  onNext?: () => void,
  onBack?: () => void,
  updateForm: UpdateFormState,
  setUpdateForm: React.Dispatch<React.SetStateAction<UpdateFormState>>,
}


const Preview = (props: PreviewProps) => {
  const {updateForm, setUpdateForm, onNext, onBack} = props;
  const { profile } = updateForm
  if (!profile) return null

  const imageSrc = useMemo(() => URL.createObjectURL(profile), [profile])

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
      <div className="relative w-64 h-64 rounded-full overflow-hidden border">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCropPixels(pixels)}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(+e.target.value)}
          className="w-64"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>Back</Button>

        <Button
          onClick={async () => {
            const blob = await getCroppedImg(imageSrc, cropPixels)
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })

            setUpdateForm(f => ({ ...f, profile: file }))
            onNext?.()
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </div>
  )}

export default Preview