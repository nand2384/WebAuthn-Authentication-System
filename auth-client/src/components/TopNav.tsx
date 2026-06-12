import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fingerprint, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-white border-b border-surface-200 z-50 flex items-center px-4 md:px-8 lg:px-16 justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-primary-600 rounded-full flex items-center justify-center">
            <Fingerprint className="text-white h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-primary-900 leading-none tracking-tight">SARJAN</span>
            <span className="text-[8px] md:text-[10px] uppercase font-semibold text-primary-600 tracking-widest leading-tight">HEALTHCARE</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-surface-700">
          <Link to="#" className="hover:text-primary-600 transition-colors">Home</Link>
          <Link to="#" className="hover:text-primary-600 transition-colors">About Us</Link>
          <Link to="#" className="hover:text-primary-600 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:block">
          <Link 
            to={isLogin ? "/register" : "/login"} 
            className="font-bold text-surface-900 hover:text-primary-600 transition-colors"
          >
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-surface-600 hover:text-primary-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-surface-200 shadow-lg z-40 md:hidden flex flex-col p-4 space-y-4"
          >
            <Link to="#" className="font-semibold text-surface-700 hover:text-primary-600 p-2 rounded-lg hover:bg-surface-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="#" className="font-semibold text-surface-700 hover:text-primary-600 p-2 rounded-lg hover:bg-surface-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="#" className="font-semibold text-surface-700 hover:text-primary-600 p-2 rounded-lg hover:bg-surface-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <div className="h-px bg-surface-200 w-full my-2"></div>
            <Link 
              to={isLogin ? "/register" : "/login"} 
              className="font-bold text-primary-700 p-2 text-center bg-primary-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isLogin ? "Sign Up Now" : "Login"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
