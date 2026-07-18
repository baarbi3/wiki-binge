import { PFPStep, UpdateFormState } from '@/app/types/auth/profile';
import React from 'react'
import Preview from './Steps/Preview';
import Confirm from './Steps/Confirm';
import Edit from './Steps/Edit';

interface propsType {
  step: PFPStep,
  setStep: React.Dispatch<React.SetStateAction<PFPStep>>,
  updateForm: UpdateFormState,
  setUpdateForm: React.Dispatch<React.SetStateAction<UpdateFormState>>,
  onSubmit: () => void
}

const PFPRouter = (props: propsType) => {
  const {step, setStep, updateForm, setUpdateForm, onSubmit} = props;

  switch (step) {
    case PFPStep.Edit:
      return <Edit updateForm={updateForm} setUpdateForm={setUpdateForm} onNext={() => setStep(PFPStep.Preview)} />

    case PFPStep.Preview:
      return (
        <Preview
          onBack={() => setStep(PFPStep.Edit)}
          onNext={() => setStep(PFPStep.Confirm)}
          updateForm={updateForm} 
          setUpdateForm={setUpdateForm}
        />
      )

    case PFPStep.Confirm:
      return <Confirm updateForm={updateForm} setUpdateForm={setUpdateForm} onBack={() => setStep(PFPStep.Preview)} onNext={onSubmit}/>
  }
}

export default PFPRouter