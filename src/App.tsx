
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useIsMobile } from "./hooks/use-mobile";
import LoginForm from "./components/LoginForm";
import MobileLayout from "./components/MobileLayout";
import DashboardLayout from "./components/DashboardLayout";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Scheduling from "./pages/Scheduling";
import Vessels from "./pages/Vessels";
import Tasks from "./pages/Tasks";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import TimeTracking from "./pages/TimeTracking";
import ClockInOutPage from "./pages/ClockInOutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-maritime-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">NGA</span>
          </div>
          <p className="text-maritime-navy">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      {isMobile && <PWAInstallPrompt />}
      {isMobile ? (
        <MobileLayout>{children}</MobileLayout>
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  );
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        } />
        <Route path="/scheduling" element={
          <ProtectedRoute>
            <Scheduling />
          </ProtectedRoute>
        } />
        <Route path="/vessels" element={
          <ProtectedRoute>
            <Vessels />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />
        <Route path="/finance" element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        <Route path="/time-tracking" element={
          <ProtectedRoute>
            <TimeTracking />
          </ProtectedRoute>
        } />
        <Route path="/clock-in-out" element={
          <ProtectedRoute>
            <ClockInOutPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
