import { Link } from 'react-router-dom';
import { useAuthContext } from '../../store/AuthContext';
import styles from  './Toolbar.module.css';

export function Toolbar() {
  const { passport, setLoggedOut: logout } = useAuthContext();

  return (
    <div className={`d-flex justify-content-between ${styles.toolbar}`}>
      <div className={styles.ftcBrand}>
        <Link to="/">FTC Admin CMS</Link>
      </div>

      {passport &&
        <div className="d-flex align-items-center">
          <span className="border-end pe-3">{passport.userName}</span>

          <button className="btn btn-link" onClick={() => logout() }>Logout</button>

        </div>
      }
    </div>
  );
}
