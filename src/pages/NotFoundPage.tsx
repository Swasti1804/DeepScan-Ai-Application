import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';

interface NotFoundPageProps {
  customMessage?: string;
  showBackButton?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ 
  customMessage, 
  showBackButton = true 
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Animation variants for better control
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-b from-transparent to-gray-100/50 dark:to-gray-900/20">
      <motion.div 
        className="text-center max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Icon */}
        <motion.div 
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'} transition-colors`}>
            <AlertTriangle 
              size={48} 
              className={theme === 'dark' ? 'text-amber-300' : 'text-amber-500'} 
              strokeWidth={1.5}
            />
          </div>
        </motion.div>
        
        {/* Error Code */}
        <motion.h1 
          className="text-6xl font-bold mb-4 text-gray-800 dark:text-gray-100"
          variants={itemVariants}
        >
          404
        </motion.h1>
        
        {/* Error Title */}
        <motion.h2 
          className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>
        
        {/* Error Message */}
        <motion.p 
          className="text-lg mb-8 text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          {customMessage || "The page you're looking for doesn't exist or has been moved."}
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          {showBackButton && (
            <Button 
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="h-5 w-5" />}
              size="lg"
              variant={theme === 'dark' ? 'secondary' : 'primary'}
              className="mx-auto"
            >
              Go Back
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            variant="ghost"
            className="mx-auto"
          >
            Return Home
          </Button>
          
          {/* Support Text */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Need help? <a href="/contact" className="underline hover:text-amber-500 dark:hover:text-amber-300">Contact support</a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;