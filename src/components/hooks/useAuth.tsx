import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { CMSPassport } from '../../data/cms-account';
import { authSession } from '../../store/autSession';

const passportState = atom<CMSPassport | undefined>({
  key: 'authState',
  default: undefined,
});

export function useAuth() {

  const [passport, setPassport] = useRecoilState(passportState);
  // Indicating whether data is being fetched
  // from localStorage.
  const [ loadingAuth, setLoadingAuth ] = useState(true);

    // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    if (passport) {
      setLoadingAuth(false);
      return;
    }

    setLoadingAuth(true);
    const cached = authSession.load();

    if (!cached) {
      setLoadingAuth(false);
      return;
    }

    setLogin(cached, () =>{
      setLoadingAuth(false);
      console.log('Passport loaded');
    });
  }, []);

  function setLogin(pp: CMSPassport, callback: VoidFunction) {
    setPassport(pp);
    authSession.save(pp);
    callback();
  }

  function refreshLogin(pp: CMSPassport) {
    setPassport(pp);
    authSession.save(pp);
  }

  function logout(callback: VoidFunction) {
    authSession.clear();
    setPassport(undefined);
    callback();
  }

  function setDisplayName(n: string) {
    if (passport) {
      refreshLogin({
        ...passport,
        userName: n,
      })
    }
  }


  return {
    passport,
    loadingAuth,
    setLogin,
    logout,
    setDisplayName,
  };
}
