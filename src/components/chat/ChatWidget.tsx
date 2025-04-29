import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: 'Thank you for your message. I\'m here to help you understand and detect deepfakes. What would you like to know?',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-4 w-[360px] rounded-lg shadow-xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-600'} text-white flex justify-between items-center`}>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">DeepScan AI Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-white/20 rounded"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? (theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-gray-900')
                        : (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`rounded-lg p-3 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={`flex-1 resize-none rounded-lg p-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`p-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`mb-4 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <button
              onClick={() => setIsMinimized(false)}
              className={`w-full p-4 flex items-center justify-between ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="font-medium">DeepScan AI Assistant</span>
              </div>
              <Maximize2 className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => {
          setIsOpen(prev => !prev);
          setIsMinimized(false);
        }}
        className={`p-4 rounded-full shadow-lg ${
          theme === 'dark'
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white`}
        aria-label="Toggle chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatWidget;