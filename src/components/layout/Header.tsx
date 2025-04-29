import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Educational', path: '/educational' },
    { name: 'Contact', path: '/contact' },
  ];

  // If user is logged in, add Dashboard to nav items
  if (user) {
    navItems.push({ name: 'Dashboard', path: '/dashboard' });
  }

  const navVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' },
  };

  return (
    <header className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-bold">DeepScan AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-1 p-2 rounded-md ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 hidden group-hover:block`}>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden"
        animate={isOpen ? 'open' : 'closed'}
        variants={navVariants}
        initial="closed"
        transition={{ duration: 0.2 }}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                theme === 'dark' 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'text-yellow-300 hover:bg-gray-700' 
                  : 'text-indigo-600 hover:bg-gray-100'
              }`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {user ? (
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;