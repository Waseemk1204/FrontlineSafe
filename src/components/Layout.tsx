import React from 'react';
import { BottomNav } from './ui/BottomNav';
import { Header } from './ui/Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    showBack?: boolean;
    showNav?: boolean;
    rightElement?: React.ReactNode;
}

export const Layout = ({
    children,
    title,
    showBack = false,
    showNav = true,
    rightElement
}: LayoutProps) => {
    return (
        <div className="min-h-screen bg-neutral-50">
            {title && <Header title={title} showBack={showBack} rightElement={rightElement} />}

            <main className={`
        ${title ? 'pt-14' : ''} 
        ${showNav ? 'pb-20' : 'pb-4'} 
        px-4 py-4
      `}>
                {children}
            </main>

            {showNav && <BottomNav />}
        </div>
    );
};
