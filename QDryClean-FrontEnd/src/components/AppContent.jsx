import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { authService } from "../features/auth/authService";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Logo from "../assets/logo-sample.png";

const navigationItems = [
  { path: "/dashboard", label: "Панель", roles: ["Admin"] },
  { path: "/orders", label: "Заказы", roles: ["Admin", "Manager"] },
  { path: "/packages", label: "Упаковка", roles: ["Admin"] },
  { path: "/customers", label: "Клиенты", roles: ["Admin", "Manager"] },
  { path: "/settings", label: "Настройки", roles: ["Admin"] },
];

const icons = {
  "/dashboard": LayoutDashboard,
  "/orders": ShoppingCart,
  "/packages": Package,
  "/customers": Users,
  "/settings": Settings,
};

export default function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const role = authService.getRole();

  const filteredNav = useMemo(() => {
    return navigationItems.filter((item) =>
      item.roles.includes(role)
    );
  }, [role]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col bg-white border-r border-slate-100 transition-all duration-300
        ${isSidebarOpen ? "w-64" : "w-20"}`}
      >

        {/* SIDEBAR EDGE TOGGLE */}
        <div className="absolute top-6 -right-3 z-50">
          <button
            onClick={() => setIsSidebarOpen((p) => !p)}
            className="w-6 h-10 bg-white border border-slate-200
                      rounded-md shadow-sm
                      flex items-center justify-center
                      hover:bg-slate-50 hover:border-slate-300
                      transition"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        <div className="flex items-center px-5 py-4">

          {/* LOGO BOX (ЖЁСТКО ЗАФИКСИРОВАН) */}
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img
              src={Logo}
              alt="logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          {/* TITLE (НЕ ЛОМАЕТ LAYOUT) */}
          <div
            className={`ml-2 overflow-hidden transition-all duration-200
              ${isSidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}
            `}
          >
            <span className="font-semibold whitespace-nowrap">
              QDryClean
            </span>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-2 space-y-1">

          {filteredNav.map((item) => {
            const Icon = icons[item.path];
            const isActive = location.pathname === item.path;

            if (!Icon) return null;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-all
                  ${isSidebarOpen ? "justify-start gap-3" : "justify-center"}
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:bg-blue-50/30 hover:text-blue-600"
                  }
                `}
              >

                {/* ICON (СТАБИЛЬНЫЙ, НЕ ПЛАВАЕТ) */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                {/* LABEL */}
                {isSidebarOpen && (
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                )}

              </button>
            );
          })}

        </nav>

        {/* FOOTER */}
        <div className="border-t border-slate-100 p-2">

          {isSidebarOpen && (
            <div className="mb-3 text-sm text-slate-500">
              Роль:{" "}
              <span className="text-slate-900 font-medium">
                {role}
              </span>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-all
                  ${isSidebarOpen ? "justify-start" : "justify-center"}
                `}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>

                {isSidebarOpen && (
                  <span className="whitespace-nowrap">
                    Выход
                  </span>
                )}
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Выход из системы?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите выйти из аккаунта?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="hover:bg-red-200"
                >
                  Выйти
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>

    </div>
  );
}