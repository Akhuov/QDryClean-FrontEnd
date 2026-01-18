import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import UsersPage from "@/pages/UsersPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/users" replace /> : <LoginPage />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;