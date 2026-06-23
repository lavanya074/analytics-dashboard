import { Navigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';

// Wrap any page that requires login.
// Redirects to /login automatically if there's no active session.
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
