import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
}) => {
  const baseStyle = 'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 focus:ring-gray-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyle = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const buttonStyle = `
    ${baseStyle}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyle}
    ${widthStyle}
    ${className}
  `;
  
  return (
    <motion.button
      type={type}
      className={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      aria-label={ariaLabel}
    >
      <span className="flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;