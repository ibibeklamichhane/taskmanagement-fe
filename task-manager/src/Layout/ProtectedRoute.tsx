import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/tokenUtils';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
