import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-md ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className={`p-4 rounded-md ${
            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 placeholder-gray-500'
                } ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 placeholder-gray-500'
                } ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 rounded focus:ring-indigo-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-indigo-600' : 'border-gray-300 text-indigo-600'
                }`}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2 px-4 rounded-md flex justify-center items-center space-x-2 border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.0001 2.20591C6.47638 2.20591 2.00049 6.69064 2.00049 12.2059C2.00049 16.6729 4.86638 20.445 8.94821 21.729C9.47457 21.8301 9.65293 21.5106 9.65293 21.2263C9.65293 20.9675 9.64384 20.2097 9.64384 19.3441C7.00049 19.821 6.35293 18.2059 6.16548 17.6215C6.0673 17.3195 5.61548 16.4715 5.19093 16.2126C4.83639 16.0066 4.31003 15.5291 5.18184 15.5196C6.00093 15.51 6.57357 16.2774 6.77916 16.5889C7.69553 17.9538 9.23184 17.6652 9.68366 17.381C9.78184 16.731 10.0673 16.2989 10.3787 16.0514C8.08366 15.804 5.67548 15.0203 5.67548 11.2901C5.67548 10.2203 6.0673 9.33241 6.79775 8.64155C6.68957 8.36728 6.35293 7.39519 6.90739 6.05118C6.90739 6.05118 7.75293 5.76755 9.65293 6.96837C10.4082 6.72028 11.2082 6.59623 12.0082 6.59623C12.8082 6.59623 13.6082 6.72028 14.3635 6.96837C16.2635 5.75814 17.109 6.05118 17.109 6.05118C17.6635 7.39519 17.3269 8.36728 17.2187 8.64155C17.9492 9.33241 18.341 10.2108 18.341 11.2901C18.341 15.0299 15.9246 15.804 13.6296 16.0514C14.0178 16.3541 14.3635 16.9384 14.3635 17.8548C14.3635 19.1744 14.3544 20.8629 14.3544 21.2263C14.3544 21.5106 14.5328 21.8392 15.0591 21.729C17.0966 21.0723 18.8454 19.7538 20.0781 17.9992C21.3108 16.2446 21.9592 14.1353 21.9582 11.9764C21.9582 6.69064 17.4823 2.20591 12.0001 2.20591Z" />
              </svg>
              <span>GitHub</span>
            </button>
            
            <button
              type="button"
              className={`py-2 px-4 rounded-md flex justify-center items-center space-x-2 border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.454 16H9.545C9.545 14.891 9.545 13.773 9.545 12.664C9.545 12.184 9.445 11.714 9.082 11.382C8.621 10.955 7.979 10.964 7.324 11.055V9.073C8.184 8.927 9.258 8.673 9.881 9.391C10.336 9.991 10.417 10.709 10.463 11.427C10.472 13.291 10.472 15.155 10.472 17.019H12.454V16ZM11.909 8.182C10.936 8.227 10.236 7.336 10.346 6.391C10.427 5.582 11.146 5 11.818 5C12.6 5.036 13.209 5.582 13.218 6.391C13.173 7.364 12.564 8.146 11.909 8.182Z" />
              </svg>
              <span>Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;