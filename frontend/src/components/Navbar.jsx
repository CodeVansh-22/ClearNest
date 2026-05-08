import React from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transactions, complaints..."
            className="w-full bg-muted/50 border border-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition-colors relative group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.div>
        </button>

        <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Alex Johnson</p>
            <p className="text-xs text-muted-foreground">Resident</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-blue-400 border-2 border-card shadow-sm flex items-center justify-center text-xs font-bold text-white">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
