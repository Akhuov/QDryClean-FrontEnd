// features/auth/authService.js

export const authService = {
  // Проверка авторизации
  isAuthenticated() {
    return !!this.getToken();
  },

  // Получение токена
  getToken() {
    return localStorage.getItem('token');
  },

  // 🔥 Получение роли
  getRole() {
    return localStorage.getItem('role');
  },

  // Сохранение данных
  setAuthData(token, role) {
    if (!token) return;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  },

  // Выход
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};