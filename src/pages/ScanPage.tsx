import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Image, FileVideo, FileAudio, FileText, Upload, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { scanContent, ScanResult } from '../services/deepfakeService';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';

const ScanPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview for image files
      if (type === 'image' && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (type === 'video' && selectedFile.type.startsWith('video/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else if (type === 'audio' && selectedFile.type.startsWith('audio/')) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  }, [type]);
  
  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
        return {
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        };
      case 'video':
        return {
          'video/*': ['.mp4', '.webm', '.mov', '.avi']
        };
      case 'audio':
        return {
          'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
        };
      default:
        return undefined;
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    maxFiles: 1,
    disabled: loading
  });
  
  const getTypeIcon = () => {
    switch (type) {
      case 'image':
        return <Image className="h-12 w-12" />;
      case 'video':
        return <FileVideo className="h-12 w-12" />;
      case 'audio':
        return <FileAudio className="h-12 w-12" />;
      case 'text':
        return <FileText className="h-12 w-12" />;
      default:
        return <Upload className="h-12 w-12" />;
    }
  };
  
  const getTypeTitle = () => {
    switch (type) {
      case 'image':
        return 'Image Analysis';
      case 'video':
        return 'Video Detection';
      case 'audio':
        return 'Audio Verification';
      case 'text':
        return 'Text Analysis';
      default:
        return 'Content Analysis';
    }
  };
  
  const handleScan = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      let content = '';
      
      if (type === 'text') {
        if (!text.trim()) {
          throw new Error('Please enter some text to analyze');
        }
        content = text;
      } else {
        if (!file) {
          throw new Error(`Please upload a ${type} file to scan`);
        }
        // In a real app, we would upload the file to a server here
        content = file.name; // Using filename as a placeholder
      }
      
      const scanType = type as 'image' | 'video' | 'audio' | 'text';
      const scanResult = await scanContent(user.id, scanType, content);
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scanning');
    } finally {
      setLoading(false);
    }
  };
  
  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setText('');
    setResult(null);
    setError(null);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            {getTypeIcon()}
          </div>
          <h1 className="text-3xl font-bold mb-4">{getTypeTitle()}</h1>
          <p className="text-lg max-w-2xl mx-auto">
            {type === 'image' && 'Upload an image to analyze it for potential manipulation or AI generation.'}
            {type === 'video' && 'Upload a video file to detect potential deepfake manipulation.'}
            {type === 'audio' && 'Upload an audio file to verify its authenticity and detect voice cloning.'}
            {type === 'text' && 'Input text to analyze for potential AI generation patterns.'}
          </p>
        </div>
        
        {!result ? (
          <div className={`mb-8 p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            {type !== 'text' ? (
              <div className="space-y-6">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? `${theme === 'dark' ? 'border-indigo-400 bg-indigo-900/20' : 'border-indigo-500 bg-indigo-50'}`
                      : `${theme === 'dark' ? 'border-gray-600 hover:border-indigo-400' : 'border-gray-300 hover:border-indigo-500'}`
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {preview ? (
                    <div className="space-y-4">
                      {type === 'image' && (
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-h-80 mx-auto rounded-lg"
                        />
                      )}
                      {type === 'video' && (
                        <video 
                          src={preview} 
                          controls 
                          className="max-h-80 w-full mx-auto rounded-lg"
                        />
                      )}
                      {type === 'audio' && (
                        <audio 
                          src={preview} 
                          controls 
                          className="w-full mx-auto"
                        />
                      )}
                      <p>{file?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">
                        Drag & drop your {type} file here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        or click to select a file
                      </p>
                    </div>
                  )}
                </div>
                
                {file && (
                  <div className="text-center">
                    <p className="text-sm">
                      Selected file: <span className="font-medium">{file.name}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type the text you want to analyze..."
                  rows={10}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  {text.length} characters
                </div>
              </div>
            )}
            
            {error && (
              <div className={`mt-4 p-4 rounded-md ${
                theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleScan}
                disabled={loading || (!file && type !== 'text') || (type === 'text' && !text.trim())}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Start Analysis'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div 
            className={`mb-8 rounded-lg overflow-hidden shadow-md ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`p-4 ${
              result.isDeepfake 
                ? (theme === 'dark' ? 'bg-red-900' : 'bg-red-500') 
                : (theme === 'dark' ? 'bg-green-900' : 'bg-green-500')
            } text-white`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  {result.isDeepfake ? (
                    <>
                      <AlertTriangle className="h-6 w-6 mr-2" />
                      Potential Deepfake Detected
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Content Appears Authentic
                    </>
                  )}
                </h2>
                <div className="text-sm rounded-full px-3 py-1 bg-black/20">
                  {result.confidenceScore.toFixed(1)}% confidence
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {type === 'image' && preview && (
                    <img 
                      src={preview} 
                      alt="Analyzed content" 
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  {type === 'video' && preview && (
                    <video 
                      src={preview} 
                      controls 
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  {type === 'audio' && preview && (
                    <audio 
                      src={preview} 
                      controls 
                      className="w-full mb-4"
                    />
                  )}
                  {type === 'text' && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <p className="whitespace-pre-wrap">{text}</p>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-semibold mb-2">Scan Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Scan Date:</span>
                        <span>{result.scanDate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span>{(result.processingTime / 1000).toFixed(2)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Content Type:</span>
                        <span className="capitalize">{result.contentType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
                    <div className="relative pt-1">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold inline-block">
                              Authenticity Score
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-semibold inline-block ${
                              result.isDeepfake 
                                ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') 
                                : (theme === 'dark' ? 'text-green-400' : 'text-green-600')
                            }`}>
                              {(100 - result.confidenceScore).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className={`overflow-hidden h-2 text-xs flex rounded ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - result.confidenceScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              result.isDeepfake 
                                ? (theme === 'dark' ? 'bg-red-500' : 'bg-red-600') 
                                : (theme === 'dark' ? 'bg-green-500' : 'bg-green-600')
                            }`}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Detected Markers</h3>
                    {result.detectedMarkers.length > 0 ? (
                      <div className="space-y-3">
                        {result.detectedMarkers.map((marker, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                            className={`p-3 rounded-lg ${
                              marker.severity === 'high'
                                ? (theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100')
                                : marker.severity === 'medium'
                                ? (theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100')
                                : (theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100')
                            }`}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold">
                                {marker.type.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                marker.severity === 'high'
                                  ? (theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-200 text-red-800')
                                  : marker.severity === 'medium'
                                  ? (theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-200 text-yellow-800')
                                  : (theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800')
                              }`}>
                                {marker.severity}
                              </span>
                            </div>
                            <p className="text-sm">{marker.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p>No specific markers detected.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center space-x-4">
                <Button variant="outline" onClick={resetScan}>
                  Scan Another
                </Button>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ScanPage;