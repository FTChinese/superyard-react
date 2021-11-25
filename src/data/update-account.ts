export type UpdatePasswordReq = {
  currentPassword: string;
  newPassword: string;
};

export type UpdatePasswordFormVal = {
  currentPassword: string;
  password: string
  confirmPassword: string;
};
