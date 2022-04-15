import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logout } from './Logout';
import styles from  './Toolbar.module.css';

export function Toolbar() {
  const { passport } = useAuth();

  return (
    <div className={`d-flex justify-content-between ${styles.toolbar}`}>
      <div className={styles.ftcBrand}>
        <Link to="/">FTC Admin CMS</Link>
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
