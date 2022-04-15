import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';

export function Logout() {

  const navigate = useNavigate();
  const { logout, passport } = useAuth();

  const handleLogout = () => {
    logout(() => {

    });
  };

  if (!passport) {
    return null;
  }

  return (
    <Button
      variant="link"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
