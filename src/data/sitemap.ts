export const prefixNext = '/next';
export const prefixNg = '/ng'

export const siteRoot = {
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
};

export const sitemap = {
  login: `/${siteRoot.login}`,
  forgotPassword: `/${siteRoot.forgotPassword}`,
  paywall: `/${siteRoot.paywall}`,
};

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader${siteRoot.passwordReset}`;
}
