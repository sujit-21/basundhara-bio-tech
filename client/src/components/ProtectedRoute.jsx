import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient-light dark-mode-deep">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading security clearance...</span>
        </div>
      </div>
    );
  }

  // Not logged in or logged in but not admin when admin clearance is required
  if (adminOnly && (!user || !isAdmin)) {
    return <Navigate to="/404" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
