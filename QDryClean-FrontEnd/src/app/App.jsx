import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import UsersPage from "@/pages/UsersPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;