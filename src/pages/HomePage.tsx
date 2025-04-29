import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Image, FileAudio, FileVideo, FileText, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const scanTypes = [
    { 
      id: 'image', 
      name: 'Image Analysis', 
      description: 'Analyze photos for manipulation and AI generation', 
      icon: <Image className="h-10 w-10" />,
      path: '/scan/image'
    },
    { 
      id: 'video', 
      name: 'Video Detection', 
      description: 'Spot AI-generated or manipulated videos', 
      icon: <FileVideo className="h-10 w-10" />,
      path: '/scan/video'
    },
    { 
      id: 'audio', 
      name: 'Audio Verification', 
      description: 'Identify voice clones and synthetic audio', 
      icon: <FileAudio className="h-10 w-10" />,
      path: '/scan/audio'
    },
    { 
      id: 'text', 
      name: 'Text Analysis', 
      description: 'Detect AI-generated text content', 
      icon: <FileText className="h-10 w-10" />,
      path: '/scan/text'
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Detect Deepfakes
                </span>
                <br />
                With Advanced AI Technology
              </h1>
              <p className="text-lg mb-8">
                DeepScan AI helps you identify manipulated images, videos, audio, and text using state-of-the-art artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/scan/image')}
                  icon={<AlertTriangle />}
                >
                  Scan Media Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/educational')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <img 
                  src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="AI technology visualization" 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className={`px-4 py-2 rounded-full text-sm inline-block mb-4 ${
                    theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    Trusted by Security Experts
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center overflow-hidden"
                          >
                            <img 
                              src={`https://randomuser.me/api/portraits/men/${i + 30}.jpg`} 
                              alt="User avatar" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="ml-4 text-sm">Trusted by 10,000+ users</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="ml-1 text-sm">(4.9)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Detection Tools</h2>
            <p className="max-w-2xl mx-auto">
              DeepScan AI offers comprehensive solutions to detect various types of synthetic media.
              Our tools are designed to be easy to use while providing powerful analytical capabilities.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {scanTypes.map((type) => (
              <motion.div
                key={type.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`rounded-lg p-6 shadow-md cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => navigate(type.path)}
              >
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${
                  theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {type.description}
                </p>
                <div className="flex items-center text-indigo-600">
                  <span>Try it now</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto">
              Our AI-powered platform analyzes content through a multi-stage process to identify 
              potential manipulations and synthetic elements.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-800 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 relative">
              {[
                {
                  step: 1,
                  title: "Upload Content",
                  description: "Upload the image, video, audio, or text you want to analyze"
                },
                {
                  step: 2,
                  title: "AI Processing",
                  description: "Our advanced algorithms analyze the content for telltale signs of manipulation"
                },
                {
                  step: 3,
                  title: "Detailed Results",
                  description: "Get a comprehensive report with confidence scores and highlighted areas of concern"
                },
                {
                  step: 4,
                  title: "Take Action",
                  description: "Save the results, download the report, or share it with others"
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.step}
                  className="flex flex-col md:flex-row items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:order-1 md:pl-12'}`}>
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="relative flex items-center justify-center md:w-28 my-4 md:my-0">
                    <div className={`z-10 flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold ${
                      theme === 'dark' 
                        ? 'bg-indigo-700 text-white' 
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-1 md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <img
                      src={`https://images.pexels.com/photos/7${1484 + index * 100}/pexels-photo-7${1484 + index * 100}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                      alt={`Step ${item.step} illustration`}
                      className="rounded-lg shadow-md w-full h-48 object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-600'} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Spot Deepfakes?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-indigo-100">
            Don't be fooled by fake media. Start using our easy-to-use tools today to verify the authenticity of content.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/scan/image')}
          >
            Start Scanning Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;