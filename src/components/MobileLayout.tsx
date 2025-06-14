
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
  Users, 
  Calendar, 
  Ship, 
  CheckSquare,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  User
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainNavItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Employees", url: "/employees", icon: Users },
    { title: "Vessels", url: "/vessels", icon: Ship },
    { title: "Tasks", url: "/tasks", icon: CheckSquare },
    { title: "Reports", url: "/reports", icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { title: "Scheduling", url: "/scheduling", icon: Calendar },
    { title: "Finance", url: "/finance", icon: DollarSign },
    { title: "Documents", url: "/documents", icon: FileText },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-maritime-foam shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-maritime-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">NGA</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-maritime-navy">NGA Marine</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-maritime-ocean rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-maritime-foam shadow-lg">
        <div className="flex justify-around items-center py-2">
          {mainNavItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive(item.url)
                  ? 'text-maritime-blue bg-maritime-foam'
                  : 'text-maritime-anchor hover:text-maritime-blue'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Secondary Navigation Drawer */}
      <div className="fixed top-16 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-maritime-foam p-2 space-y-1">
          {secondaryNavItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={`flex items-center space-x-2 w-full p-2 rounded-md transition-colors ${
                isActive(item.url)
                  ? 'text-maritime-blue bg-maritime-foam'
                  : 'text-maritime-anchor hover:text-maritime-blue hover:bg-maritime-foam'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.title}</span>
            </button>
          ))}
          <div className="border-t border-maritime-foam pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
