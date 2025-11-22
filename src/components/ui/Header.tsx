import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export const Header = ({ title, showBack, rightElement }: HeaderProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
            <div className="flex items-center">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-2 -ml-2 p-2 text-neutral-600 hover:text-neutral-900"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
            </div>
            <div className="flex items-center space-x-2">
                {rightElement}
                {!rightElement && (
                    <Button variant="ghost" size="sm" onClick={logout} className="!p-2">
                        <LogOut size={20} />
                    </Button>
                )}
            </div>
        </header>
    );
};
