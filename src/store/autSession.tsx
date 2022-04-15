import { CMSPassport, isLoginExpired } from '../data/cms-account';

const key = 'sy_user';

export const authSession = {
  save(pp: CMSPassport) {
    localStorage.setItem(key, JSON.stringify(pp));
  },

  load(): CMSPassport | null {
    const ppStr = localStorage.getItem(key);

    if (!ppStr) {
      return null;
    }

    try {
      const pp = JSON.parse(ppStr) as CMSPassport;
      if (isLoginExpired(pp)) {
        localStorage.removeItem(key);
        return null;
      }

      return pp;
    } catch (e) {
      console.error(e);
      localStorage.removeItem(key);

      return null;
    }
  },

  clear() {
    localStorage.removeItem(key);
  },
}
