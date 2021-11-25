const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';


const accountBase = `${readerBase}/account`;

const authBase = '/api/auth'
const pwResetBase = `${authBase}/password-reset`;

export const endpoint = {
  login: `${authBase}/login`,
  requestPasswordReset: `${pwResetBase}/letter`,
  verifyResetToken: function (token: string): string {
    return `${pwResetBase}/tokens/${token}`;
  },
  resetPassword: `${pwResetBase}`,

  changePassword: `${accountBase}/password`,
  paywall: paywallBasePath,
};
