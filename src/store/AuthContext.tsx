import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext, useState } from 'react';
import { CMSPassport, isLoginExpired } from '../data/cms-account';

const storeKeyAccount = 'sy_user';

interface AuthState {
  passport?: CMSPassport;
  setLoggedIn: (p: CMSPassport) => void;
  setLoggedOut: () => void;
  setDisplayName: (n: string) => void
}

const AuthContext = createContext<AuthState>({
  passport: undefined,
  setLoggedIn: (p: CMSPassport) => {},
  setLoggedOut: () => {},
  setDisplayName: (n: string) => {},
});

export function AuthProvider(props: {children: JSX.Element}) {

  const [passport, setPassport] = useState<CMSPassport>();

  function load() {
    if (passport) {
      if (isLoginExpired(passport)) {
        localStorage.removeItem(storeKeyAccount);
        setPassport(undefined);
      }
      return;
    }

    const ppStr = localStorage.getItem(storeKeyAccount);

    if (!ppStr) {
      return;
    }

    try {
      const pp: CMSPassport = JSON.parse(ppStr);
      if (isLoginExpired(pp)) {
        localStorage.removeItem(storeKeyAccount);
      }

      setPassport(JSON.parse(ppStr));
    } catch (e) {
      localStorage.removeItem(storeKeyAccount);
    }
  }

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    load();

    // return function cleanup() {};
  }, [passport?.expiresAt, passport?.token]);

  const ctxValue: AuthState = {
    passport,
    setLoggedIn: (p: CMSPassport) => {
      localStorage.setItem(storeKeyAccount, JSON.stringify(p));
      setPassport(p);
    },
    setLoggedOut: () => {
      localStorage.removeItem(storeKeyAccount);
      setPassport(undefined);
    },
    setDisplayName: (n: string) => {
      if (passport) {
        const newPassport: CMSPassport = {
          ...passport,
          userName: n,
        };
        localStorage.setItem(storeKeyAccount, JSON.stringify(newPassport));
        setPassport(newPassport);
      }
    }
  };

  return <AuthContext.Provider value={ctxValue}>
    {props.children}
  </AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
