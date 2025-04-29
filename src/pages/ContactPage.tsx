import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, MapPin, Phone, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormData>();
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Have questions about deepfake detection or want to learn more about our services? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                <Mail className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="mb-2">For general inquiries:</p>
            <a 
              href="mailto:info@deepscanai.com" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              info@deepscanai.com
            </a>
            <p className="mt-2 mb-2">For support:</p>
            <a 
              href="mailto:support@deepscanai.com" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              support@deepscanai.com
            </a>
          </motion.div>
          
          <motion.div 
            className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <MapPin className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="mb-2">Main Office:</p>
            <p>123 AI Boulevard</p>
            <p>San Francisco, CA 94105</p>
            <p className="mt-2 mb-2">Research Lab:</p>
            <p>456 Tech Park Avenue</p>
            <p>Boston, MA 02110</p>
          </motion.div>
          
          <motion.div 
            className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                <Phone className={`h-6 w-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="mb-2">Customer Service:</p>
            <a 
              href="tel:+18005551000" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              +1 (800) 555-1000
            </a>
            <p className="mt-2 mb-2">Technical Support:</p>
            <a 
              href="tel:+18005552000" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              +1 (800) 555-2000
            </a>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className={`p-8 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            {submitSuccess ? (
              <motion.div 
                className={`p-4 rounded-md mb-6 ${
                  theme === 'dark' ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className={`p-4 rounded-md ${
                    theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <p>{submitError}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
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
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject", { 
                      required: "Subject is required",
                      minLength: {
                        value: 2,
                        message: "Subject must be at least 2 characters"
                      }
                    })}
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register("message", { 
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters"
                      }
                    })}
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                  )}
                </div>
                
                <div>
                  <Button
                    type="submit"
                    icon={<Send className="h-4 w-4" />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div>
            <div className={`p-8 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {[
                  {
                    question: "How do I report a suspected deepfake?",
                    answer: "You can use our detection tools to scan the content, and then use the 'Report' button on the results page. You can also contact us directly through this form with details about the content."
                  },
                  {
                    question: "Can I request a personalized demonstration?",
                    answer: "Yes! Business and educational institutions can request a personalized demonstration of our technology. Please contact our sales team through this form or directly at sales@deepscanai.com."
                  },
                  {
                    question: "Do you offer API access for developers?",
                    answer: "We provide API access to our deepfake detection services for integration with your applications. Please contact our development team for documentation and pricing details."
                  },
                ].map((faq, index) => (
                  <details 
                    key={index}
                    className={`group rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4`}
                  >
                    <summary className="font-medium cursor-pointer list-none">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-sm">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            
            <div className={`p-8 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="font-medium">Technical Support Hours:</p>
                <p className="mt-2">
                  24/7 emergency support for premium accounts.
                  Standard accounts: Monday-Friday, 9:00 AM - 8:00 PM EST.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md mb-8 ${
          theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50'
        }`}>
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="mb-4">
            We're always looking for talented individuals to join our team in the fight against deepfakes and digital misinformation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-semibold mb-2">AI Research Scientists</h3>
              <p className="text-sm">Help develop cutting-edge deepfake detection algorithms</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-semibold mb-2">Frontend Developers</h3>
              <p className="text-sm">Create intuitive, accessible user interfaces for our tools</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-semibold mb-2">Digital Forensics Specialists</h3>
              <p className="text-sm">Investigate and analyze sophisticated deepfakes</p>
            </div>
          </div>
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => window.open('#', '_blank')}
            >
              View All Openings
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;