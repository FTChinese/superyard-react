import { Navigate, useLocation } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';

/**
 * NoAuthGuard redirect a logged-in user to home page if
 * it is visiting pages like login, forgot-password.
 */
export function NoAuthGuard(
  props: {
    children: JSX.Element;
  }
) {
  const { passport } = useAuth();
  const location = useLocation();

  if (passport) {
    return <Navigate
      to={sitemap.home}
      replace={true}
      state={{ from: location }}
    />
  }

  return props.children;
}
