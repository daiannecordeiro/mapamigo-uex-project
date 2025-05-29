import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/services';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!getCurrentUser();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;