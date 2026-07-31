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

function AppLayout() {
  const location = useLocation();
  const showFooter = location.pathname !== "/map";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapExplore />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
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
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      {showFooter ? <Footer /> : null}
      <MobileNav />
      <ChatWidget />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <AppLayout />
    </BrowserRouter>
  );
}
