import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import { Image, FileVideo, FileAudio, FileText, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getScanHistory, ScanResult } from '../services/deepfakeService';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  
  useEffect(() => {
    const fetchScanHistory = async () => {
      if (user) {
        try {
          const history = await getScanHistory(user.id);
          setScanHistory(history);
        } catch (error) {
          console.error('Error fetching scan history:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchScanHistory();
  }, [user]);
  
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: ['Image', 'Video', 'Audio', 'Text'],
    datasets: [
      {
        label: 'Authentic',
        data: [
          scanHistory.filter(s => s.contentType === 'image' && !s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'video' && !s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'audio' && !s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'text' && !s.isDeepfake).length,
        ],
        backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Deepfake',
        data: [
          scanHistory.filter(s => s.contentType === 'image' && s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'video' && s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'audio' && s.isDeepfake).length,
          scanHistory.filter(s => s.contentType === 'text' && s.isDeepfake).length,
        ],
        backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: 'Scan Results by Content Type',
        color: theme === 'dark' ? 'white' : 'black',
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };
  
  // Stats
  const totalScans = scanHistory.length;
  const deepfakesDetected = scanHistory.filter(scan => scan.isDeepfake).length;
  const deepfakePercentage = totalScans > 0 ? (deepfakesDetected / totalScans) * 100 : 0;
  
  const handleViewDetails = (scan: ScanResult) => {
    setSelectedScan(scan);
  };
  
  const closeDetails = () => {
    setSelectedScan(null);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
          <p className="text-lg">
            Track and analyze your deepfake detection scans all in one place.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-2">Total Scans</h3>
                <p className="text-3xl font-bold">{totalScans}</p>
              </motion.div>
              
              <motion.div
                className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-2">Deepfakes Detected</h3>
                <p className="text-3xl font-bold text-red-500">{deepfakesDetected}</p>
              </motion.div>
              
              <motion.div
                className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-2">Detection Rate</h3>
                <p className="text-3xl font-bold">{deepfakePercentage.toFixed(1)}%</p>
              </motion.div>
              
              <motion.div
                className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-2">Last Scan</h3>
                <p className="text-lg font-medium">
                  {scanHistory.length > 0 
                    ? format(new Date(scanHistory[0].scanDate), 'MMM d, yyyy')
                    : 'No scans yet'}
                </p>
              </motion.div>
            </div>
            
            {/* Chart */}
            <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Analysis Overview</h2>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Recent Scans */}
            <div className={`rounded-lg shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Scans</h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/scan/image')}
                    >
                      New Scan
                    </Button>
                  </div>
                </div>
              </div>
              
              {scanHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Content
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {scanHistory.map((scan) => (
                        <tr key={scan.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {scan.contentType === 'image' ? (
                                  <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <img 
                                      src={scan.originalContent.startsWith('http') ? scan.originalContent : 'https://via.placeholder.com/150'} 
                                      alt="" 
                                      className="h-10 w-10 object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className={`h-10 w-10 rounded flex items-center justify-center ${
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                  }`}>
                                    {getContentTypeIcon(scan.contentType)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium truncate max-w-xs">
                                  {scan.contentType === 'text' 
                                    ? scan.originalContent.substring(0, 30) + '...'
                                    : scan.originalContent.split('/').pop()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getContentTypeIcon(scan.contentType)}
                              <span className="ml-1 capitalize">{scan.contentType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {format(new Date(scan.scanDate), 'MMM d, yyyy h:mm a')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {scan.isDeepfake ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                Deepfake
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Authentic
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`relative w-24 h-2 rounded-full overflow-hidden ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                <div 
                                  className={`absolute top-0 left-0 h-full ${
                                    scan.isDeepfake 
                                      ? 'bg-red-500' 
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${scan.confidenceScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm">{scan.confidenceScore.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(scan)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="mb-4">You haven't performed any scans yet.</p>
                  <Button onClick={() => navigate('/scan/image')}>
                    Perform Your First Scan
                  </Button>
                </div>
              )}
            </div>
            
            {/* Scan Details Modal */}
            {selectedScan && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" onClick={closeDetails}>
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                  </div>
                  
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                  
                  <motion.div 
                    className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className={`p-4 ${
                      selectedScan.isDeepfake 
                        ? (theme === 'dark' ? 'bg-red-900' : 'bg-red-500') 
                        : (theme === 'dark' ? 'bg-green-900' : 'bg-green-500')
                    } text-white`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center">
                          {selectedScan.isDeepfake ? (
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
                        </h3>
                        <div className="text-sm rounded-full px-3 py-1 bg-black/20">
                          {selectedScan.confidenceScore.toFixed(1)}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          {selectedScan.contentType === 'image' && selectedScan.originalContent.startsWith('http') && (
                            <img 
                              src={selectedScan.originalContent} 
                              alt="Analyzed content" 
                              className="w-full rounded-lg mb-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+not+available';
                              }}
                            />
                          )}
                          {selectedScan.contentType === 'text' && (
                            <div className={`p-4 rounded-lg mb-4 ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <p className="whitespace-pre-wrap">{selectedScan.originalContent}</p>
                            </div>
                          )}
                          {(selectedScan.contentType === 'video' || selectedScan.contentType === 'audio') && (
                            <div className={`p-4 rounded-lg mb-4 flex items-center justify-center ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <div className="text-center">
                                {getContentTypeIcon(selectedScan.contentType)}
                                <p className="mt-2">{selectedScan.originalContent}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <h3 className="font-semibold mb-2">Scan Details</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Scan ID:</span>
                                <span className="font-mono">{selectedScan.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Scan Date:</span>
                                <span>{format(new Date(selectedScan.scanDate), 'MMM d, yyyy h:mm a')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Processing Time:</span>
                                <span>{(selectedScan.processingTime / 1000).toFixed(2)}s</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Content Type:</span>
                                <span className="capitalize">{selectedScan.contentType}</span>
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
                                      selectedScan.isDeepfake 
                                        ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') 
                                        : (theme === 'dark' ? 'text-green-400' : 'text-green-600')
                                    }`}>
                                      {(100 - selectedScan.confidenceScore).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className={`overflow-hidden h-2 text-xs flex rounded ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                  <div
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                      selectedScan.isDeepfake 
                                        ? (theme === 'dark' ? 'bg-red-500' : 'bg-red-600') 
                                        : (theme === 'dark' ? 'bg-green-500' : 'bg-green-600')
                                    }`}
                                    style={{ width: `${100 - selectedScan.confidenceScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Detected Markers</h3>
                            {selectedScan.detectedMarkers.length > 0 ? (
                              <div className="space-y-3">
                                {selectedScan.detectedMarkers.map((marker, index) => (
                                  <div 
                                    key={index}
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
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No specific markers detected.</p>
                            )}
                          </div>
                          
                          <div className="mt-6">
                            <a 
                              href="/educational" 
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <span>Learn more about these markers</span>
                              <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button variant="outline" onClick={closeDetails}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;