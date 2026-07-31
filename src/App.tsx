import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";

import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import AuthGuard from "@/components/auth/AuthGuard";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import MapExplore from "@/pages/MapExplore";
import PropertyDetail from "@/pages/PropertyDetail";
import Favorites from "@/pages/Favorites";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/authStore";

function AppLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoginPage = location.pathname === "/login";
  const showShell = isAuthenticated || !isLoginPage;
  const showFooter = showShell && location.pathname !== "/map";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {showShell ? <Header /> : null}
      <main className="flex-1 pb-24 lg:pb-0">
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path="/search"
            element={
              <AuthGuard>
                <Search />
              </AuthGuard>
            }
          />
          <Route
            path="/map"
            element={
              <AuthGuard>
                <MapExplore />
              </AuthGuard>
            }
          />
          <Route
            path="/property/:id"
            element={
              <AuthGuard>
                <PropertyDetail />
              </AuthGuard>
            }
          />
          <Route
            path="/favorites"
            element={
              <AuthGuard>
                <Favorites />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard requireAdmin>
                <Admin />
              </AuthGuard>
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/404" : "/login"} replace />
            }
          />
        </Routes>
      </main>
      {showFooter ? <Footer /> : null}
      {showShell ? <MobileNav /> : null}
      {showShell ? <ChatWidget /> : null}
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
