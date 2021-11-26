
const readerBase = '/api/reader';


const accountBase = `${readerBase}/account`;

const authBase = '/api/auth'
const pwResetBase = `${authBase}/password-reset`;

const paywallBasePath = '/api/paywall';

export const endpoint = {
  login: `${authBase}/login`,
  requestPasswordReset: `${pwResetBase}/letter`,
  verifyResetToken: function (token: string): string {
    return `${pwResetBase}/tokens/${token}`;
  },
  resetPassword: `${pwResetBase}`,

  changePassword: `${accountBase}/password`,

  paywall: paywallBasePath,
  pwBanner: `${paywallBasePath}/banner`,
  pwPromo: `${paywallBasePath}/banner/promo`,

  product: `${paywallBasePath}/products`,
  productOf: function(id: string): string {
    return `${paywallBasePath}/products/${id}`;
  },

  price: `${paywallBasePath}/prices`,
  priceOf: function(id: string): string {
    return `${paywallBasePath}/prices/${id}`;
  },
  offerOfPrice: function(id: string): string {
    return `${paywallBasePath}/prices/${id}/discounts`;
  },

  discount: `${paywallBasePath}/discounts`,
  discountOf: function(id: string): string {
    return `${paywallBasePath}/discounts/${id}`;
  },
};
