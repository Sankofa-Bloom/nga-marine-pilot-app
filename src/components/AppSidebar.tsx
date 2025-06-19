
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Calendar, 
  FileText, 
  DollarSign, 
  Ship, 
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Clock
} from 'lucide-react';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        {
          title: "Employees",
          url: "/employees",
          icon: User,
        },
        {
          title: "Scheduling",
          url: "/scheduling",
          icon: Calendar,
        },
        {
          title: "Vessels",
          url: "/vessels",
          icon: Ship,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Time Tracking",
          url: "/time-tracking",
          icon: Clock,
        },
        {
          title: "Finance",
          url: "/finance",
          icon: DollarSign,
        },
        {
          title: "Reports",
          url: "/reports",
          icon: BarChart3,
        },
        {
          title: "Documents",
          url: "/documents",
          icon: FileText,
        },
      ];
    } else if (user?.role === 'manager') {
      return [
        ...baseItems,
        {
          title: "Employees",
          url: "/employees",
          icon: User,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Time Tracking",
          url: "/time-tracking",
          icon: Clock,
        },
        {
          title: "Documents",
          url: "/documents",
          icon: FileText,
        },
      ];
    } else {
      // Employee role
      return [
        ...baseItems,
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Clock In/Out",
          url: "/clock-in-out",
          icon: Clock,
        },
        {
          title: "Documents",
          url: "/documents",
          icon: FileText,
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-maritime-foam">
      <SidebarHeader className="border-b border-maritime-foam p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-maritime-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">NGA</span>
          </div>
          <div>
            <h3 className="font-semibold text-maritime-navy">NGA Marine</h3>
            <p className="text-xs text-maritime-anchor">Employee Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-maritime-anchor">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-maritime-foam"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center space-x-2 w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-maritime-anchor">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/admin/settings'}
                    className="hover:bg-maritime-foam"
                  >
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="flex items-center space-x-2 w-full"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-maritime-foam p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-maritime-ocean rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-maritime-navy truncate">{user?.name}</p>
              <p className="text-xs text-maritime-anchor capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-maritime-anchor hover:bg-maritime-foam"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
