import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, ClipboardCheck, CheckSquare, FileText } from 'lucide-react';
import { cn } from './Button';

export const BottomNav = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
        { path: '/inspections', icon: ClipboardCheck, label: 'Inspections' },
        { path: '/capas', icon: CheckSquare, label: 'Tasks' },
        { path: '/reports', icon: FileText, label: 'Reports' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1',
                                isActive ? 'text-primary' : 'text-neutral-400 hover:text-neutral-600'
                            )}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
