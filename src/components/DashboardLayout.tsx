
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-40 bg-white border-b border-maritime-foam shadow-sm">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="text-maritime-navy hover:bg-maritime-foam" />
              <Separator orientation="vertical" className="mx-4 h-6" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-maritime-navy">
                  NGA Marine Services - Employee Management System
                </h1>
              </div>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
