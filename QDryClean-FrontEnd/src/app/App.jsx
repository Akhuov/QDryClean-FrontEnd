import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import OrdersPage from "../pages/OrdersPage";
import PackingPage from "../pages/PackingPage";
import CustomersPage from "../pages/CustomersPage";
import ForbiddenPage from "../pages/ForbiddenPage";

// Layout
import AppContent from "../components/AppContent";

// Guards
import AuthWrapper from "../components/AuthWrapper";

// UI
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";

export default function App() {
  return (
    <Router>
      <TooltipProvider delayDuration={0}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* ================= PROTECTED LAYOUT ================= */}
          <Route
            path="/"
            element={
              <AuthWrapper>
                <AppContent />
              </AuthWrapper>
            }
          >

            {/* Dashboard - all authenticated users */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Orders - Admin, Manager */}
            <Route
              path="orders"
              element={
                <AuthWrapper allowedRoles={["Admin", "Manager"]}>
                  <OrdersPage />
                </AuthWrapper>
              }
            />

            {/* Packages - Admin only */}
            <Route
              path="packages"
              element={
                <AuthWrapper allowedRoles={["Admin"]}>
                  <PackingPage />
                </AuthWrapper>
              }
            />

            {/* Customers - Admin, Manager */}
            <Route
              path="customers"
              element={
                <AuthWrapper allowedRoles={["Admin", "Manager"]}>
                  <CustomersPage />
                </AuthWrapper>
              }
            />

            {/* Settings - Admin only */}
            <Route
              path="settings"
              element={
                <AuthWrapper allowedRoles={["Admin"]}>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Настройки</h1>
                  </div>
                </AuthWrapper>
              }
            />

          </Route>
        </Routes>

        <Toaster />
      </TooltipProvider>
    </Router>
  );
}