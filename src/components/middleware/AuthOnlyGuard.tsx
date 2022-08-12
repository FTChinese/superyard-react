import { Location, useLocation, Path, Navigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';

/**
 * AuthOnlyGuard redirect user to login page in case
 * a non-logged-in user is visiting access-restricted sections
 */
export function AuthOnlyGuard(
  props: {
    children: JSX.Element;
  }
) {
  let { passport } = useAuth();
  let location = useLocation();

  // By this point, passport should have already been load
  // from local storage. If it is still not present, then
  // user is not authenticated.
  if (!passport) {
    return <Navigate
      to={sitemap.login}
      replace={true}
      state={{ from: location }}
    />
  }

  return props.children;
}

type RedirectFrom = {
  from?: Partial<Path>;
};

export function getAuthRedirect(location: Location): string {
  if (!location.state) {
    return sitemap.home;
  }

  const state = location.state as RedirectFrom;

  return state.from?.pathname || sitemap.home;
}
