import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Shield, Camera, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CriminalIdentification = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>(['Sai']); // Default labels

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        console.log("Loading models from:", MODEL_URL);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("Models loaded successfully");
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load AI models. Please ensure model files are in /public/models.");
      }
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }
  };

  const handleVideoPlay = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video dimensions are ready
    const displaySize = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
    faceapi.matchDimensions(canvas, displaySize);

    console.log("Preparing labeled images for recognition...");
    const labeledDescriptors = await loadLabeledImages();
    const faceMatcher = labeledDescriptors && labeledDescriptors.length > 0 
      ? new faceapi.FaceMatcher(labeledDescriptors, 0.6) 
      : null;

    if (!faceMatcher) {
      console.warn("No labeled images loaded. Recognition will match 'Unknown'.");
    }

    const processFrame = async () => {
      if (!isCameraActive || video.paused || video.ended) return;

      const detections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold: 0.1 })
      ).withFaceLandmarks().withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        resizedDetections.forEach(detection => {
          const { detection: det, descriptor } = detection;
          let label = "Unknown";
          
          if (faceMatcher) {
            const bestMatch = faceMatcher.findBestMatch(descriptor);
            label = bestMatch.toString();
          }

          // Use face-api.js built-in drawing for reliable results
          const drawOptions = {
            label: label,
            boxColor: '#22c55e', // Green
            lineWidth: 2,
            drawLabel: true
          };
          const drawBox = new faceapi.draw.DrawBox(det.box, drawOptions);
          drawBox.draw(canvas);
        });
      }
      
      // Use requestAnimationFrame instead of setInterval for smoother/better performance
      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);
  };

  const loadLabeledImages = async () => {
    try {
      // 1. Try to fetch from backend (MySQL path)
      const backendUrl = 'http://localhost:5000/api/suspects';
      console.log(`Searching for suspects at ${backendUrl}...`);
      
      const response = await fetch(backendUrl).catch(() => null);
      if (response && response.ok) {
        const suspects = await response.json();
        console.log(`Found ${suspects.length} suspects in database.`);
        return suspects.map((s: any) => {
          const descriptors = s.descriptors.map((d: any) => new Float32Array(Object.values(d)));
          return new faceapi.LabeledFaceDescriptors(s.name, descriptors);
        });
      }

      // 2. Fallback to public folder images if backend fails
      console.log("Backend not reachable. Falling back to public/known_faces folder.");
      return await Promise.all(
        labels.map(async label => {
          const descriptions = [];
          try {
            const img = await faceapi.fetchImage(`/known_faces/${label}.jpg`);
            const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
            if (detections) {
              descriptions.push(detections.descriptor);
            }
          } catch (e) {
            console.warn(`Could not load local image for ${label}:`, e);
          }
          return descriptions.length > 0 ? new faceapi.LabeledFaceDescriptors(label, descriptions) : null;
        })
      ).then(results => results.filter(r => r !== null) as faceapi.LabeledFaceDescriptors[]);
    } catch (err) {
      console.error("Error loading suspects:", err);
      return null;
    }
  };

  return (
    <section id="criminal-id" className="section-padding bg-slate-900/50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-white">Criminal Identification System</h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time face recognition for detecting known entities using on-device AI.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto glass rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-black">
          {error && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="text-center p-6">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-semibold">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm underline text-muted-foreground"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )}
          
          <div className="relative aspect-video bg-slate-950">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              onPlay={handleVideoPlay}
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full transform scale-x-[-1]" 
            />
            
            {!isCameraActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                <button
                  onClick={startVideo}
                  disabled={!isModelLoaded}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Camera className="w-6 h-6" />
                  {isModelLoaded ? "Start Analysis" : "Loading AI Models..."}
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className={`w-2 h-2 rounded-full bg-green-400 ${isCameraActive ? "animate-pulse" : "opacity-30"}`} />
              {isCameraActive ? "System Scanning..." : "System Ready"}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> 
                {labels.length} Suspects Loaded
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CriminalIdentification;
