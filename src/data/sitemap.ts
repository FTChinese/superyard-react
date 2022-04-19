export const prefixNext = '/next';
export const prefixNg = '/ng'

export const sitePath = {
  login: 'login',
  forgotPassword: 'forgot-password',
  passwordReset: 'password-reset',

  admin: 'admin',
  apn: 'apn',
  oauth: 'oauth',
  wiki: 'wiki',
  readers: 'readers',
  subs: 'subs',
  b2b: 'b2b',
  android: 'android',
  settings: 'settings',

  paywall: 'paywall',
  products: 'products',
  stripePrices: 'stripe/prices',
};

export const sitemap = {
  home: '/',
  login: `/${sitePath.login}`,
  forgotPassword: `/${sitePath.forgotPassword}`,
  paywall: `/${sitePath.paywall}`,
  products: `/${sitePath.paywall}/products`,
  stripePriceOf: function(id: string): string {
    return `/${sitePath.paywall}/${sitePath.stripePrices}/${id}`
  },
};

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader${sitePath.passwordReset}`;
}
