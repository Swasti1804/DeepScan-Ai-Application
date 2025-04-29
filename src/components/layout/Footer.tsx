import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold">DeepScan AI</span>
            </div>
            <p className="mt-4">Detecting deepfakes with cutting-edge AI technology to help you stay safe online.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link to="/educational" className="hover:underline">Educational</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/educational" className="hover:underline">How to Spot Deepfakes</Link>
              </li>
              <li>
                <Link to="/educational" className="hover:underline">Latest Research</Link>
              </li>
              <li>
                <Link to="/educational" className="hover:underline">Safety Tips</Link>
              </li>
              <li>
                <Link to="/educational" className="hover:underline">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Join our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className={`px-4 py-2 w-full rounded-l-md focus:outline-none ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                  aria-label="Email for newsletter"
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                  aria-label="Subscribe to newsletter"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center">&copy; {new Date().getFullYear()} DeepScan AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;