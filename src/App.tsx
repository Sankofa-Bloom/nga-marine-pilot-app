
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Scheduling from "./pages/Scheduling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return <DashboardLayout>{children}</DashboardLayout>;
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
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">Vessel Management</h2>
              <p>Coming soon - Fleet overview and maintenance tracking</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">Task Management</h2>
              <p>Coming soon - Work orders and task assignments</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/finance" element={
          <ProtectedRoute>
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">Finance Management</h2>
              <p>Coming soon - Expense tracking and budget monitoring</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
              <p>Coming soon - Comprehensive reporting dashboard</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">Document Management</h2>
              <p>Coming soon - Digital document storage and retrieval</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <div className="text-center text-maritime-navy">
              <h2 className="text-2xl font-bold mb-4">System Settings</h2>
              <p>Coming soon - Administrative configuration panel</p>
            </div>
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
