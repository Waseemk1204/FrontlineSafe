import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboardIcon, FileTextIcon, ClipboardCheckIcon, ListTodoIcon } from 'lucide-react';
const navItems = [{
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
}];
export function MobileNav() {
  const location = useLocation();
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 md:hidden z-40">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={clsx('flex flex-col items-center justify-center py-8 px-12 flex-1', 'transition-colors min-h-[60px]', {
          'text-primary': isActive,
          'text-neutral-500 hover:text-neutral-700': !isActive
        })}>
              <Icon className="w-5 h-5 mb-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>;
      })}
      </div>
    </nav>;
}