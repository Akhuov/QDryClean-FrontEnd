import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../features/auth/authService";

export default function AuthWrapper({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  // Если НЕ авторизован → редирект на login
  if (!isAuthenticated) {
    console.log("AuthWrapper - not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован и попал на /login → редирект на dashboard
  if (isAuthenticated && location.pathname === "/login") {
    console.log("AuthWrapper - already authenticated");
    return <Navigate to="/dashboard" replace />;
  }

  // Если всё ок — показываем защищённый контент
  return children;
}