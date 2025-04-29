import React from 'react';
import { Scan } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center">
      <div className={`p-1 rounded-lg ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
        <Scan size={size} className="text-white" />
      </div>
    </div>
  );
};

export default Logo;