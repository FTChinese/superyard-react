const authBase = '/api/auth'
const pwResetBase = `${authBase}/password-reset`;


export const endpoint = {
  login: `${authBase}/login`,
  resetPassword: `${pwResetBase}`,
  requestPasswordReset: `${pwResetBase}/letter`,
  verifyResetToken: function (token: string): string {
    return `${pwResetBase}/tokens/${token}`;
  },

  paywall: '/api/paywall',
  banner: '/api/paywall/banner',
  promo: '/api/paywall/banner/promo',

  product: '/api/products',
  productOf: function(id: string): string {
    return `/api/products/${id}`;
  },

  price: '/api/prices',
  priceOf: function(id: string): string {
    return `/api/prices/${id}`;
  },
  offerOfPrice: function(id: string): string {
    return `/api/prices/${id}/discounts`;
  },

  discount: '/api/discounts',
  discountOf: function(id: string): string {
    return `/api/discounts/${id}`;
  },
};
