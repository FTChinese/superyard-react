const authBase = '/api/auth';
const pwResetBase = `${authBase}/password-reset`;
const paywallBase = '/api/paywall';

export const pathStripeBase = '/api/stripe';
export const pathStripePrice = pathStripeBase + '/prices';
export const pathStripeCoupons = pathStripeBase + '/coupons';

export const pathSandboxBase = '/api/sandbox';

export const pathReaderBase = '/api/readers';

export const pathSearchReader = `${pathReaderBase}/search`;
export const pathFtcReader = `${pathReaderBase}/ftc`;
export const pathWxReader = `${pathReaderBase}/wx`;

export const pathMemberBase = '/api/memberships';

export const endpoint = {
  login: `${authBase}/login`,
  resetPassword: `${pwResetBase}`,
  passResetLetter: `${pwResetBase}/letter`,
  passResetToken: `${pwResetBase}/tokens`,

  paywall: paywallBase,
  refreshPaywall: `${paywallBase}/build`,
  banner: `${paywallBase}/banner`,
  promo: `${paywallBase}/banner/promo`,

  product: `${paywallBase}/products`,
  productOf: function (id: string): string {
    return `${paywallBase}/products/${id}`;
  },
  introForProductOf: function (id: string): string {
    return `${paywallBase}/products/${id}/intro`;
  },

  price: `${paywallBase}/prices`,
  priceOf: function (id: string): string {
    return `${paywallBase}/prices/${id}`;
  },
  offerOfPrice: function (id: string): string {
    return `${paywallBase}/prices/${id}/discounts`;
  },

  discount: `${paywallBase}/discounts`,
  discountOf: function (id: string): string {
    return `${paywallBase}/discounts/${id}`;
  },

  stripePrice: `${pathStripeBase}/prices`,
  stripePriceOf: function (id: string): string {
    return `${pathStripeBase}/prices/${id}`;
  },

  stripeCoupons: `${pathStripeBase}/coupons`,
  stripeCouponOf: function (id: string): string {
    return `${pathStripeBase}/coupons/${id}`;
  },

  legalBase: '/api/legal',
  androidBase: '/api/android/releases',
};
