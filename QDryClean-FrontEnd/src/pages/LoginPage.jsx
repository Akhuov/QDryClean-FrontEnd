import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { loginUser } from '../features/auth/api/authApi';
import { authService } from '../features/auth/authService';
import Logo from '../assets/logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Real API call to backend
      const response = await loginUser(formData);
      
      // Store token and user data using authService
      authService.setAuthData(response.token, response.user);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Detailed logging for debugging
      console.error('Login error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        code: err.code
      });
      
      // Handle different error types
      let errorMessage = 'Ошибка при входе в систему';
      
      if (err.response?.status === 401) {
        errorMessage = 'Неверный логин или пароль';
      } else if (err.response?.status === 400) {
        errorMessage = 'Неверные данные для входа';
      } else if (err.response?.status === 500) {
        errorMessage = 'Ошибка сервера. Попробуйте позже.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Ошибка подключения к серверу';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #e0f7fa, #80deea, #26c6da)'
      }}
    >
      <div className="w-full max-w-sm">
        <Card className="shadow-2xl bg-white" style={{ backdropFilter: 'blur(6px)' }}>
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src={Logo} 
                alt="QDryClean Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            <CardTitle className="text-2xl font-bold mb-2 text-gray-900">
              Вход в систему
            </CardTitle>
            <p className="text-gray-600 text-sm">
              QDryClean - Управление химчисткой
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="login" className="text-sm font-medium text-gray-700">Логин</Label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="Введите логин"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(90deg, #26c6da, #00acc1)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 'bold',
                  textTransform: 'none'
                }}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}