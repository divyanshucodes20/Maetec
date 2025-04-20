import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);

  // If the user is authenticated, render the passed component; if not, redirect to login
  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
