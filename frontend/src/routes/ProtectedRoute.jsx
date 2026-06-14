import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingBlock from "../components/LoadingBlock";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingBlock label="Verifying admin session..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

