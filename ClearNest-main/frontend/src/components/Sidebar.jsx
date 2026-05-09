import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  MessageSquare, 
  Vote, 
  Users, 
  Building2, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ closeSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Financial Ledger', icon: Wallet, path: '/ledger' },
    { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { name: 'Digital Voting', icon: Vote, path: '/voting' },
    { name: 'Committee', icon: ShieldCheck, path: '/committee' },
    { name: 'Vendors', icon: Building2, path: '/vendors' },
  ];

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6">
        <img 
          src={logo} 
          alt="ClearNest Logo" 
          className="h-12 w-auto block" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <span className="text-xl font-bold tracking-tight hidden">ClearNest</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-accent text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Active Unit</p>
          <p className="text-sm font-medium text-foreground">Unit 402 • Block B</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
