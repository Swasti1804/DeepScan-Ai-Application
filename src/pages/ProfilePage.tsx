import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { AlertTriangle, CheckCircle, User, Bell, Shield, LogOut, Settings } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
}

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    productUpdates: true,
  });
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });
  
  const newPassword = watch('newPassword', '');
  
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Profile updated:', data);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('There was an error updating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5 mr-2" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5 mr-2" />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-5 w-5 mr-2" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5 mr-2" />
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
          <p className="text-lg">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className={`rounded-lg shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff&size=128`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? (theme === 'dark' 
                                ? 'bg-indigo-900 text-indigo-200' 
                                : 'bg-indigo-100 text-indigo-800')
                            : (theme === 'dark' 
                                ? 'text-gray-300 hover:bg-gray-700' 
                                : 'text-gray-700 hover:bg-gray-100')
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    </li>
                  ))}
                  <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => logout()}
                      className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        theme === 'dark' 
                          ? 'text-red-400 hover:bg-red-900/30' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 md:col-span-3">
            <div className={`rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                  
                  {submitSuccess && (
                    <motion.div 
                      className={`p-4 rounded-md mb-6 ${
                        theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p>Your profile has been updated successfully.</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {submitError && (
                    <div className={`p-4 rounded-md mb-6 ${
                      theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name", { 
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })}
                        className={`w-full px-4 py-2 rounded-md border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className={`w-full px-4 py-2 rounded-md border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            {...register("currentPassword")}
                            className={`w-full px-4 py-2 rounded-md border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            {...register("newPassword", {
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                              }
                            })}
                            className={`w-full px-4 py-2 rounded-md border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                          />
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", {
                              validate: value => 
                                !newPassword || value === newPassword || "Passwords do not match"
                            })}
                            className={`w-full px-4 py-2 rounded-md border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Email Notifications</h3>
                      
                      {[
                        { 
                          id: 'emailAlerts', 
                          label: 'Scan Results', 
                          description: 'Receive email notifications when your scans are complete' 
                        },
                        { 
                          id: 'securityAlerts', 
                          label: 'Security Alerts', 
                          description: 'Get notified about suspicious account activity or security threats' 
                        },
                        { 
                          id: 'marketingEmails', 
                          label: 'Marketing Emails', 
                          description: 'Receive promotional offers and marketing communications' 
                        },
                        { 
                          id: 'productUpdates', 
                          label: 'Product Updates', 
                          description: 'Stay informed about new features and improvements' 
                        },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-4">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={item.id}
                                type="checkbox"
                                checked={notificationSettings[item.id as keyof NotificationSettings]}
                                onChange={() => handleNotificationChange(item.id as keyof NotificationSettings)}
                                className={`h-4 w-4 rounded focus:ring-indigo-500 ${
                                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-indigo-600' : 'border-gray-300 text-indigo-600'
                                }`}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label htmlFor={item.id} className="text-sm font-medium">
                              {item.label}
                            </label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Notification Frequency</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email Digest</label>
                          <select
                            className={`w-full px-4 py-2 rounded-md border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          >
                            <option value="immediate">Immediate</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Account Security</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Enhance your account security</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                          </div>
                          <div className="ml-4">
                            <Button variant="outline" size="sm">
                              Enable 2FA
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Login Sessions</h3>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className="font-medium">Current Session</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Device:</span> {navigator.userAgent}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">IP Address:</span> Masked for privacy
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Last Login:</span> Just now
                            </p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            }`}>
                              Current
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Sign Out All Other Sessions
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Account Activity</h3>
                      
                      <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Password Changed</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">2 weeks ago</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">New Login</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">3 weeks ago</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Account Created</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">1 month ago</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                      
                      <div className="flex items-center space-x-4">
                        <span>Theme:</span>
                        <button
                          className={`px-3 py-1 rounded-md text-sm ${
                            theme === 'light' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-gray-700 text-gray-300'
                          }`}
                          onClick={() => document.documentElement.classList.replace('dark', 'light')}
                        >
                          Light
                        </button>
                        <button
                          className={`px-3 py-1 rounded-md text-sm ${
                            theme === 'dark' 
                              ? 'bg-indigo-900 text-indigo-200' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => document.documentElement.classList.replace('light', 'dark')}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Language</h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Language</label>
                        <select
                          className={`w-full px-4 py-2 rounded-md border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="cookieConsent"
                              type="checkbox"
                              defaultChecked
                              className={`h-4 w-4 rounded focus:ring-indigo-500 ${
                                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-indigo-600' : 'border-gray-300 text-indigo-600'
                              }`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="cookieConsent" className="text-sm font-medium">
                              Cookie Consent
                            </label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Allow us to use cookies to improve your experience
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="analyticsConsent"
                              type="checkbox"
                              defaultChecked
                              className={`h-4 w-4 rounded focus:ring-indigo-500 ${
                                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-indigo-600' : 'border-gray-300 text-indigo-600'
                              }`}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="analyticsConsent" className="text-sm font-medium">
                              Analytics
                            </label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Allow anonymous usage data collection to improve our services
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`}>
                        <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          Once you delete your account, there is no going back. All of your data will be permanently removed.
                        </p>
                        <div className="mt-4">
                          <Button
                            variant="danger"
                            size="sm"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;