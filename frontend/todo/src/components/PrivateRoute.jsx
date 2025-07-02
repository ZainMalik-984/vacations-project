import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
}

export default PrivateRoute;
