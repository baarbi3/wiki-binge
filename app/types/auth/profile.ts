export type UpdateFormState = {
  username?: string,
  profile?: File | null,
};


export enum PFPStep {
  Edit,
  Preview,
  Confirm
}
