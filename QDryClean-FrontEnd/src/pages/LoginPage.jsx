import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/features/auth/ui/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  // Устанавливаем заголовок вкладки
  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleLoginSuccess = () => {
    navigate("/users"); // после логина отправляем на список пользователей
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}