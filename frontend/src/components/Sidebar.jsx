import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  MessageSquare, 
  Vote, 
  Building2, 
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import logo from '../assets/logo.png';

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useAuthStore();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Financial Ledger', icon: Wallet, path: '/ledger' },
    { name: 'Complaints', icon: MessageSquare, path: '/complaints' },
    { name: 'Digital Voting', icon: Vote, path: '/voting' },
    { name: 'Committee', icon: ShieldCheck, path: '/committee' },
    { name: 'Vendors', icon: Building2, path: '/vendors' },
  ];

  return (
    <div className="h-full flex flex-col bg-card transition-colors duration-300">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="ClearNest" 
            className="h-10 w-auto" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="text-xl font-black tracking-tighter text-foreground hidden">ClearNest</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
              <span>{item.name}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-opacity duration-300 ${item.path === window.location.pathname ? 'opacity-100' : 'opacity-0'}`} />
          </NavLink>
        ))}
      </nav>

      {/* Footer / Context Section */}
      <div className="p-4 border-t border-border/50 space-y-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Active Unit</p>
          <p className="text-sm font-bold text-foreground truncate">{user?.flatNumber ? `Unit ${user.flatNumber}` : 'Global Access'}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/20 text-accent uppercase">{user?.role}</span>
            <button 
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
