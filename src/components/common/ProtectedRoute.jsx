import { Navigate } from 'react-router-dom';
import { storage } from '../../utils/storage.js';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const auth = storage.getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;