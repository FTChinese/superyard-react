import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logout } from './Logout';

export function Toolbar() {
  const { passport } = useAuth();

  return (
    <div className={`container-fluid d-flex justify-content-between align-items-center ftc-toolbar`}>
      <div className="ftc-brand d-flex align-items-end">
        <Link to="/">FTC CMS</Link>
      </div>

      {passport &&
        <div className="d-flex align-items-center">
          <span className="border-end pe-3">{passport.userName}</span>
          <Logout />
        </div>
      }
    </div>
  );
}
