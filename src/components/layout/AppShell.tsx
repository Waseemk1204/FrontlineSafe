import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import { MenuIcon, BellIcon, UserCircleIcon, LayoutDashboardIcon, FileTextIcon, ClipboardCheckIcon, ListTodoIcon, FolderIcon, UsersIcon, SettingsIcon } from 'lucide-react';
import { MobileNav } from './MobileNav';
const sidebarItems = [{
  path: '/app/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
}, {
  path: '/app/incidents',
  label: 'Incidents',
  icon: FileTextIcon
}, {
  path: '/app/inspections',
  label: 'Inspections',
  icon: ClipboardCheckIcon
}, {
  path: '/app/capas',
  label: 'CAPAs',
  icon: ListTodoIcon
}, {
  path: '/app/docs',
  label: 'Documents',
  icon: FolderIcon
}, {
  path: '/app/users',
  label: 'Users',
  icon: UsersIcon
}, {
  path: '/app/settings',
  label: 'Settings',
  icon: SettingsIcon
}];
export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-neutral-100">
        <div className="flex items-center h-16 px-16 border-b border-neutral-100">
          <h1 className="text-h3 font-bold text-primary">FrontlineSafe</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-16">
          {sidebarItems.map(item => {
          const Icon = item.icon;
          return <Link key={item.path} to={item.path} className="flex items-center gap-12 px-16 py-12 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>;
        })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-16 bg-white border-b border-neutral-100">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-8 rounded-button hover:bg-neutral-50 md:hidden" aria-label="Toggle menu">
            <MenuIcon className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-base font-medium text-neutral-900">
              Acme Manufacturing
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <button className="p-8 rounded-button hover:bg-neutral-50 relative" aria-label="Notifications">
              <BellIcon className="w-5 h-5 text-neutral-700" />
              <span className="absolute top-6 right-6 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            <button className="p-8 rounded-button hover:bg-neutral-50" aria-label="User menu">
              <UserCircleIcon className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 h-full bg-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center h-16 px-16 border-b border-neutral-100">
              <h1 className="text-h3 font-bold text-primary">FrontlineSafe</h1>
            </div>

            <nav className="py-16">
              {sidebarItems.map(item => {
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className="flex items-center gap-12 px-16 py-12 text-neutral-700 hover:bg-neutral-50">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>;
          })}
            </nav>
          </aside>
        </div>}
    </div>;
}