import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../store/AuthContext';
import { siteRoot } from '../../data/sitemap';

/**
 * @description Force redirect if user logged-in.
 */
export function AuthRoute(props: RouteProps) {
  const { passport } = useAuthContext();

  // If users visit these when already logged-in,
  // they will be redirect to home page.
  if (!passport) {
    // TODO: redirect as is.
    return <Navigate
      to={{
        pathname: `/${siteRoot.login}`
      }}
    />;
  }

  return <Route {...props} />;
}
