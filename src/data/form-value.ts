import * as Yup from 'yup';

export const invalidMessages = {
  required: 'Required',
  invalidEmail: 'Invalid email',
  invalidPassword: 'Must not less than 8 numerals and characters',
  passwordMismatch: 'Confirmation password must match',
};

export const regex = {
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

export const verifyPasswordSchema = {
  password: Yup.string()
    .matches(regex.password, invalidMessages.invalidPassword)
    .required(invalidMessages.required),
  confirmPassword: Yup.string()
    .test('password-match', invalidMessages.passwordMismatch, function (value, ctx) {
      return ctx.parent.password === value;
    })
    .required(invalidMessages.required)
};

export const toastMessages = {
  saveSuccess: 'Saved!',
  updateSuccess: 'Updated successfully',
  unknownErr: 'Failed：Unknow error occurred',
};

export type EmailVal = {
  email: string;
};





