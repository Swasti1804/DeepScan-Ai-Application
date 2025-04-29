// Mock deepfake detection service

export interface ScanResult {
    id: string;
    userId: string;
    contentType: 'image' | 'video' | 'audio' | 'text';
    originalContent: string; // URL or text content
    scanDate: Date;
    isDeepfake: boolean;
    confidenceScore: number; // 0-100
    detectedMarkers: {
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      location?: { x: number; y: number; width: number; height: number }; // For visual media
    }[];
    processingTime: number; // in milliseconds
  }
  
  // Simulated database of scan results
  let SCANS_DB: Record<string, ScanResult> = {};
  
  // Simulated API delay
  const simulateDelay = () => new Promise<void>(resolve => setTimeout(resolve, 2000));
  
  // Generate a random confidence score
  const generateRandomScore = (contentType: string): number => {
    // Different types have different likelihood of being deepfakes
    const baseScore = Math.random() * 100;
    switch (contentType) {
      case 'image':
        return baseScore * 0.8; // 0-80 range
      case 'video':
        return baseScore * 0.9; // 0-90 range
      case 'audio':
        return baseScore * 0.7; // 0-70 range
      case 'text':
        return baseScore * 0.6; // 0-60 range
      default:
        return baseScore;
    }
  };
  
  // Generate random markers based on content type and confidence score
  const generateRandomMarkers = (contentType: string, confidenceScore: number) => {
    const markers = [];
    const count = Math.max(1, Math.floor(confidenceScore / 20)); // More markers for higher confidence
    
    const imageMarkers = [
      { type: 'inconsistent_lighting', description: 'Inconsistent lighting or shadows' },
      { type: 'unnatural_skin', description: 'Unnatural skin texture or coloring' },
      { type: 'irregular_background', description: 'Irregular background patterns' },
      { type: 'blurry_areas', description: 'Unusual blurry areas' },
      { type: 'face_artifacts', description: 'Artifacts around facial features' }
    ];
    
    const videoMarkers = [
      { type: 'inconsistent_motion', description: 'Inconsistent motion between frames' },
      { type: 'unnatural_blinking', description: 'Unnatural eye blinking patterns' },
      { type: 'audio_mismatch', description: 'Audio-visual synchronization issues' },
      { type: 'irregular_background', description: 'Background inconsistencies' },
      { type: 'face_artifacts', description: 'Facial boundary artifacts' }
    ];
    
    const audioMarkers = [
      { type: 'unnatural_pauses', description: 'Unnatural pauses or transitions' },
      { type: 'voice_artifacts', description: 'Digital artifacts in voice' },
      { type: 'background_noise', description: 'Inconsistent background noise' },
      { type: 'breathing_patterns', description: 'Abnormal breathing patterns' },
      { type: 'accent_inconsistencies', description: 'Accent or speech pattern inconsistencies' }
    ];
    
    const textMarkers = [
      { type: 'repetitive_patterns', description: 'Repetitive phrases or structures' },
      { type: 'inconsistent_style', description: 'Inconsistent writing style' },
      { type: 'factual_errors', description: 'Factual inconsistencies or errors' },
      { type: 'unusual_phrasing', description: 'Unusual or awkward phrasing' },
      { type: 'context_issues', description: 'Contextual inconsistencies' }
    ];
    
    let markersList;
    switch (contentType) {
      case 'image':
        markersList = imageMarkers;
        break;
      case 'video':
        markersList = videoMarkers;
        break;
      case 'audio':
        markersList = audioMarkers;
        break;
      case 'text':
        markersList = textMarkers;
        break;
      default:
        markersList = imageMarkers;
    }
    
    // Randomly select markers
    const shuffled = [...markersList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    // Add severity and location for visual media
    return selected.map(marker => {
      const severity: ('low' | 'medium' | 'high') = 
        confidenceScore > 70 ? 'high' : 
        confidenceScore > 40 ? 'medium' : 'low';
      
      // Add location data for visual media
      let location;
      if (contentType === 'image' || contentType === 'video') {
        location = {
          x: Math.floor(Math.random() * 80),
          y: Math.floor(Math.random() * 80),
          width: Math.floor(Math.random() * 20) + 10,
          height: Math.floor(Math.random() * 20) + 10
        };
      }
      
      return {
        ...marker,
        severity,
        location
      };
    });
  };
  
  // Scan content for deepfakes
  export const scanContent = async (
    userId: string,
    contentType: 'image' | 'video' | 'audio' | 'text',
    content: string // URL or text content
  ): Promise<ScanResult> => {
    await simulateDelay();
    
    const confidenceScore = generateRandomScore(contentType);
    const isDeepfake = confidenceScore > 50;
    const processingTime = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
    
    const scanResult: ScanResult = {
      id: `scan_${Date.now()}`,
      userId,
      contentType,
      originalContent: content,
      scanDate: new Date(),
      isDeepfake,
      confidenceScore,
      detectedMarkers: generateRandomMarkers(contentType, confidenceScore),
      processingTime
    };
    
    // Store the result
    SCANS_DB[scanResult.id] = scanResult;
    
    return scanResult;
  };
  
  // Get scan history for a user
  export const getScanHistory = async (userId: string): Promise<ScanResult[]> => {
    await simulateDelay();
    
    // If the database is empty, generate some sample data
    if (Object.keys(SCANS_DB).length === 0) {
      for (let i = 0; i < 10; i++) {
        const contentTypes: ('image' | 'video' | 'audio' | 'text')[] = ['image', 'video', 'audio', 'text'];
        const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        
        let content = '';
        if (contentType === 'image') {
          content = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/500/300`;
        } else if (contentType === 'video') {
          content = 'https://example.com/sample-video.mp4';
        } else if (contentType === 'audio') {
          content = 'https://example.com/sample-audio.mp3';
        } else {
          content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor felis et lorem.';
        }
        
        const confidenceScore = generateRandomScore(contentType);
        const isDeepfake = confidenceScore > 50;
        const processingTime = Math.floor(Math.random() * 2000) + 1000;
        
        const scanDate = new Date();
        scanDate.setDate(scanDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
        
        const scanResult: ScanResult = {
          id: `scan_${Date.now() - i * 10000}`,
          userId,
          contentType,
          originalContent: content,
          scanDate,
          isDeepfake,
          confidenceScore,
          detectedMarkers: generateRandomMarkers(contentType, confidenceScore),
          processingTime
        };
        
        SCANS_DB[scanResult.id] = scanResult;
      }
    }
    
    // Return user's scans sorted by date (newest first)
    return Object.values(SCANS_DB)
      .filter(scan => scan.userId === userId)
      .sort((a, b) => b.scanDate.getTime() - a.scanDate.getTime());
  };
  
  // Get a specific scan result
  export const getScanResult = async (scanId: string): Promise<ScanResult | null> => {
    await simulateDelay();
    return SCANS_DB[scanId] || null;
  };