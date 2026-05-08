import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, MessageSquare, Vote, Building2 } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Home' },
    { icon: Wallet, path: '/ledger', label: 'Ledger' },
    { icon: MessageSquare, path: '/complaints', label: 'Help' },
    { icon: Vote, path: '/voting', label: 'Vote' },
    { icon: Building2, path: '/committee', label: 'More' },
  ];

  return (
    <div className="bg-card/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 py-2 shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
            ${isActive ? 'text-primary' : 'text-muted-foreground'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-accent shadow-sm' : ''}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
