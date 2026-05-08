import React from 'react';
import { Menu, Bell, Search, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center max-w-md w-full relative group">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions, complaints..."
            className="w-full bg-muted/50 border border-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-card transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-xl transition-all text-foreground/80 hover:text-foreground relative overflow-hidden group"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <motion.div
            initial={false}
            animate={{ y: theme === 'dark' ? 0 : 40 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-5 h-5" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ y: theme === 'dark' ? -40 : 0 }}
            className="flex items-center justify-center"
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-muted rounded-xl transition-colors text-foreground/80 hover:text-foreground relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card ring-2 ring-destructive/20 animate-pulse"></span>
        </button>

        <div className="h-8 w-px bg-border/60 mx-1 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 p-1.5 rounded-2xl hover:bg-muted transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-tight text-foreground">{user?.fullName || 'Guest User'}</p>
              <p className="text-[10px] text-muted-foreground capitalize font-bold tracking-wider">{user?.role?.toLowerCase() || 'Member'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary/60 border border-border shadow-sm flex items-center justify-center text-xs font-bold text-primary-foreground ring-2 ring-primary/5">
              {getInitials(user?.fullName)}
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border bg-muted/30">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Account</p>
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile Settings
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
