const authBase = '/api/auth'
const pwResetBase = `${authBase}/password-reset`;
const paywallBase = '/api/paywall';
const stripeBase = '/api/stripe';

export const endpoint = {
  login: `${authBase}/login`,
  resetPassword: `${pwResetBase}`,
  requestPasswordReset: `${pwResetBase}/letter`,
  verifyResetToken: function (token: string): string {
    return `${pwResetBase}/tokens/${token}`;
  },

  paywall: paywallBase,
  refreshPaywall: `${paywallBase}/build`,
  banner: `${paywallBase}/banner`,
  promo: `${paywallBase}/banner/promo`,

  product: `${paywallBase}/products`,
  productOf: function(id: string): string {
    return `${paywallBase}/products/${id}`;
  },
  introForProductOf: function(id: string): string {
    return `${paywallBase}/products/${id}/intro`;
  },

  price: `${paywallBase}/prices`,
  priceOf: function(id: string): string {
    return `${paywallBase}/prices/${id}`;
  },
  offerOfPrice: function(id: string): string {
    return `${paywallBase}/prices/${id}/discounts`;
  },

  discount: `${paywallBase}/discounts`,
  discountOf: function(id: string): string {
    return `${paywallBase}/discounts/${id}`;
  },

  stripePrice: `${stripeBase}/prices`,
  stripePriceOf: function(id: string): string {
    return `${stripeBase}/prices/${id}`;
  },

  stripeCouponOf: function(id: string): string {
    return `${stripeBase}/coupons/${id}`;
  },

  legalBase: '/api/legal',
};
