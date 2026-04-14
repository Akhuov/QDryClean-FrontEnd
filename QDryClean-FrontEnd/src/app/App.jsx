import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import PackingPage from '../pages/PackingPage';
import CustomersPage from '../pages/CustomersPage';
import LoginPage from '../pages/LoginPage';

import AuthWrapper from '../components/AuthWrapper';
import { authService } from '../features/auth/authService';
import { setNavigateFunction } from '../shared/api/axiosInstance';

import Logo from '../assets/logo-sample.png';
import { Toaster } from '../components/ui/sonner';
import { TooltipProvider } from '../components/ui/tooltip';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  const getCurrentPage = () => {
    const path = location.pathname;

    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path === '/orders') return 'orders';
    if (path === '/packages') return 'packages';
    if (path === '/customers') return 'customers';
    if (path === '/settings') return 'settings';

    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { id: 'packages', label: 'Packing', icon: Package, path: '/packages' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
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
      <aside
        className={`relative bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <img
            src={Logo}
            alt="QDryClean Logo"
            className="w-10 h-10 object-contain"
          />
          {isSidebarOpen && (
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              QDryClean
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
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
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Выйти</span>}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="absolute -right-3 top-5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-accent"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="packages" element={<PackingPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route
              path="settings"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <TooltipProvider delayDuration={0}>
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
        <Toaster />
      </TooltipProvider>
    </Router>
  );
}