import Button from 'react-bootstrap/Button';
import { useAuth } from '../hooks/useAuth';

export function Logout() {

  const { logout, passport } = useAuth();

  const handleLogout = () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logout(() => {});
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
