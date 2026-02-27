import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from 'lucide-react';

import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import PackagesPage from '../pages/PackagesPage';
import ClientsPage from '../pages/ClientsPage';
import LoginPage from '../pages/LoginPage';

import AuthWrapper from '../components/AuthWrapper';
import { authService } from '../features/auth/authService';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем текущую страницу по URL
  const getCurrentPage = () => {
    const path = location.pathname;

    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path === '/orders') return 'orders';
    if (path === '/packages') return 'packages';
    if (path === '/clients') return 'clients';
    if (path === '/settings') return 'settings';

    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { id: 'packages', label: 'Packages', icon: Package, path: '/packages' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">QDryClean</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route
            path="settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <AuthWrapper>
              <AppContent />
            </AuthWrapper>
          }
        />
      </Routes>
    </Router>
  );
}