// // shared/router/ProtectedRoute.jsx

// import { Navigate, useLocation } from "react-router-dom";
// import { authService } from "../../features/auth/authService";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const location = useLocation();
//   const isAuth = authService.isAuthenticated();
//   const role = authService.getRole();

//   // ❌ не авторизован
//   if (!isAuth) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // ❌ нет доступа по роли
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/403" replace />;
//   }

//   // ✅ всё ок
//   return children;
// }