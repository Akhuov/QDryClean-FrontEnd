// Сервис для работы с аутентификацией

export const authService = {
  // Проверка, авторизован ли пользователь
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Получение данных пользователя
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Получение токена
  getToken() {
    return localStorage.getItem('token');
  },

  // Выход из системы
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Сохранение данных аутентификации
  setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};
