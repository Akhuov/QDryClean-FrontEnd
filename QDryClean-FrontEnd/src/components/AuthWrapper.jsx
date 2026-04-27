import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../features/auth/authService";

export default function AuthWrapper({ children, allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getRole();
  const location = useLocation();

  // Если нет токена → редирект на /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если указаны allowedRoles, проверяем роль
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/403" replace />;
    }
  }

  // Если авторизован и на /login → редирект на /dashboard
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}