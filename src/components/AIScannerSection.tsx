import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, AlertTriangle, User, FileWarning, Camera, UserPlus, UserCheck, Shield, Cpu, Zap, Search, Fingerprint, MapPin } from "lucide-react";
import * as faceapi from 'face-api.js';
import { toast } from "sonner";
import { TiltCard } from "./TiltCard";

const AIScannerSection = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [badgeId, setBadgeId] = useState("");
  const [stationId, setStationId] = useState("");
  const [userType] = useState<string | null>(localStorage.getItem("user_type"));
  
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [suspects, setSuspects] = useState<faceapi.LabeledFaceDescriptors[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check for existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem("gn_auth");
    if (savedAuth === "true") setIsAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (badgeId === "GN-1234-5678" && stationId === "CENTRAL PRECINCT 01") {
      setIsAuthorized(true);
      localStorage.setItem("gn_auth", "true");
      toast.success("Security Clearance Granted. Welcome, Officer.");
    } else {
      toast.error("Invalid Credentials. Access Denied.");
    }
  };

  // Load models on mount
  useEffect(() => {
    if (!isAuthorized) return;
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        loadSuspects();
      } catch (err) {
        console.error("Error loading models:", err);
        toast.error("Failed to load AI models.");
      }
    };
    loadModels();
  }, [isAuthorized]);

  const loadSuspects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/suspects').catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        const loaded = data.map((s: any) => {
          const descriptors = s.descriptors.map((d: any) => new Float32Array(Object.values(d)));
          return new faceapi.LabeledFaceDescriptors(s.name, descriptors);
        });
        setSuspects(loaded);
      } else {
        const localLabels = ['Sai'];
        const localSuspects = await Promise.all(
          localLabels.map(async label => {
            try {
              const img = await faceapi.fetchImage(`/known_faces/${label}.jpg`);
              const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
              return detections ? new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]) : null;
            } catch { return null; }
          })
        ).then(r => r.filter((i): i is faceapi.LabeledFaceDescriptors => i !== null));
        setSuspects(localSuspects);
      }
    } catch (e) {
      console.error("Error loading suspects:", e);
    }
  };

  const startCamera = async () => {
    try {
      const constraints = { 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user"
        } 
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(localStream);
      setIsCameraActive(true);
      
      // Explicitly attach to ref if available immediately
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }
      
      toast.success("Neural Optical Grid Online");
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Camera access failed. Check hardware or browser permissions.");
    }
  };

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const displaySize = { 
      width: video.videoWidth > 0 ? video.videoWidth : 640, 
      height: video.videoHeight > 0 ? video.videoHeight : 480 
    };
    faceapi.matchDimensions(canvas, displaySize);

    const processFrame = async () => {
      // Use component-level ref for stream status check instead of captured closure
      if (!videoRef.current || video.paused || video.ended) return;

      try {
        if (video.readyState >= 2) {
          const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold: 0.2 })
          ).withFaceLandmarks().withFaceDescriptors();

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const context = canvas.getContext('2d');
          
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            resizedDetections.forEach(detection => {
              const { detection: det, descriptor } = detection;
              let name = "Unknown";
              let color = '#22c55e';
              
              if (suspects.length > 0) {
                const faceMatcher = new faceapi.FaceMatcher(suspects, 0.6);
                const bestMatch = faceMatcher.findBestMatch(descriptor);
                name = bestMatch.label;
                if (name !== 'unknown') {
                  color = '#ef4444';
                } else {
                  name = "Unknown";
                }
              }

              new faceapi.draw.DrawBox(det.box, {
                label: name,
                boxColor: color,
                lineWidth: 2
              }).draw(canvas);
            });
          }
        }
      } catch (err) {
        console.error("Frame processing error:", err);
      }
      
      requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  const handleScan = async () => {
    if (!videoRef.current || !isModelLoaded) return;
    
    setScanning(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1000));

    const video = videoRef.current;
    const detection = await faceapi.detectSingleFace(
      video, 
      new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold: 0.1 })
    ).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
      toast.warning("No face detected. Please face the camera.");
      setScanning(false);
      return;
    }

    let bestMatch: any = { label: 'unknown', distance: 0 };
    if (suspects.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(suspects, 0.6);
      bestMatch = faceMatcher.findBestMatch(detection.descriptor);
    }
    
    setResult({
      name: bestMatch.label === 'unknown' ? 'Unknown Individual' : bestMatch.label,
      confidence: (bestMatch.distance * 100).toFixed(1) + "%",
      isWanted: bestMatch.label !== 'unknown',
      timestamp: new Date().toLocaleString()
    });
    
    setScanning(false);
  };

  const handleRegister = async () => {
    if (!videoRef.current) return;
    
    const name = prompt("Enter the name of the individual to register:");
    if (!name) return;

    const video = videoRef.current;
    const detection = await faceapi.detectSingleFace(
      video, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
      toast.error("No face detected for registration.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/suspects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, descriptor: Array.from(detection.descriptor) })
      });

      if (response.ok) {
        toast.success(`Successfully registered ${name} to Database!`);
        loadSuspects();
      } else {
        toast.error("Cloud Database unreachable. Registration failed.");
      }
    } catch (e) {
      toast.error("Backend server is not running.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isModelLoaded) return;

    const name = prompt("Enter the name for this person:");
    if (!name) return;

    try {
      const img = await faceapi.bufferToImage(file);
      const detection = await faceapi.detectSingleFace(
        img, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();

      if (!detection) {
        toast.error("No face detected in the uploaded image.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/suspects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, descriptor: Array.from(detection.descriptor) })
      });

      if (response.ok) {
        toast.success(`Registered ${name} from image!`);
        loadSuspects();
      } else {
        toast.error("Cloud Database unreachable.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error processing image.");
    }
  };

  if (userType !== "police" && userType !== "officer") {
    return null;
  }

  if (!isAuthorized) {
    return (
      <section id="scanner" className="section-padding relative min-h-[600px] flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <TiltCard className="p-8 card-premium border-white/10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Secure Access Red</h2>
              <p className="text-muted-foreground text-sm">Neural Scanner Terminal Restricted</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Officer Badge ID</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="GN-XXXX-XXXX"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary/50 outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Station</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter station name"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary/50 outline-none transition-all uppercase font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Fingerprint size={18} />
                Authorize Terminal
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
               <AlertTriangle size={16} className="text-orange-500 shrink-0" />
               <span className="text-[9px] text-muted-foreground leading-tight uppercase font-bold">
                 Unauthorized access attempt will be logged and reported to Central Command.
               </span>
            </div>
          </TiltCard>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="scanner" className="section-padding relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-widest mb-4">
            <Cpu size={12} className="animate-spin-slow" />
            NEURAL SCANNER ACTIVE
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            AI Criminal <span className="text-gradient">Identification</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Real-time biometric analysis and facial matching against local and international law enforcement databases.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Camera Frame */}
          <TiltCard className="group">
            <div className="card-premium p-4 relative overflow-hidden">
              <div className={`aspect-video rounded-3xl relative overflow-hidden flex items-center justify-center ${!isCameraActive ? 'bg-black/40' : 'bg-black'}`}>
                {/* Camera Grid Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
                
                {/* Corner brackets */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl z-20" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl z-20" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl z-20" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl z-20" />

                {!isCameraActive ? (
                  <div className="text-center p-4 z-20">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-primary/30" />
                    </div>
                    <button onClick={startCamera} className="text-sm font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto">
                      <Camera className="w-4 h-4" /> Start Neural Feed
                    </button>
                  </div>
                ) : (
                  <>
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
                      className="absolute inset-0 w-full h-full transform scale-x-[-1] z-10" 
                    />
                    {scanning && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(0,168,232,1)] z-20" 
                      />
                    )}
                  </>
                )}

                {/* Status bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-4 min-w-[200px] justify-center z-30">
                  <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-primary' : (isCameraActive ? 'bg-green-500' : 'bg-white/20')} animate-pulse`}></div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white">
                    {scanning ? "SYSTEM ANALYZING DATA..." : (isCameraActive ? "SECURE FEED ACTIVE" : "STATIONARY")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleScan}
                  disabled={scanning || !isCameraActive}
                  className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <ScanFace size={20} className={scanning ? 'animate-spin' : ''} />
                  {scanning ? "IDENTIFYING..." : "SCAN INDIVIDUAL"}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleRegister}
                    disabled={scanning || !isCameraActive}
                    className="flex-1 py-3 rounded-xl bg-slate-100 border border-primary/10 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={14} className="text-primary" /> Live Register
                  </button>
                  <label className="flex-1 py-3 rounded-xl bg-slate-100 border border-primary/10 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <UserPlus size={14} className="text-primary" /> Upload Face
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Results Reveal */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!scanning && !result && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10 h-full relative overflow-hidden"
                >
                  <img src="https://images.unsplash.com/photo-1695902173528-0b15104c4554?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Scanning UI" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary/40 mb-6 mx-auto border border-primary/20">
                      <ScanFace size={40} className="animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest mb-4">Awaiting Input</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                      Position the subject within the camera frame and initiate the scan for biometric identification.
                    </p>
                  </div>
                </motion.div>
              )}

              {scanning && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-premium p-12 text-center flex flex-col items-center justify-center h-full"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                     <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-primary rounded-full shadow-[0_0_20px_rgba(0,168,232,0.3)]"
                     />
                     <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-2 border-b-2 border-cyan-500/50 rounded-full"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="text-primary animate-pulse" size={32} />
                     </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Biometric Analysis</h3>
                  <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.2em]">Neural matching in progress...</p>
                  
                  <div className="mt-8 grid grid-cols-4 gap-2 px-8 w-full">
                    {[0,1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="h-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {result && !scanning && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`card-premium p-8 ${result.isWanted ? 'border-rose-500/30 bg-rose-500/5 shadow-rose-500/10' : 'border-green-500/30 bg-green-500/5'} shadow-2xl h-full`}
                >
                  <div className={`flex items-center gap-4 p-4 rounded-2xl border mb-8 ${result.isWanted ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-green-500/20 border-green-500/30 text-green-500'}`}>
                    {result.isWanted ? <AlertTriangle size={24} /> : <UserCheck size={24} />}
                    <div className="text-sm font-black uppercase tracking-widest">{result.isWanted ? 'WANTED INDIVIDUAL DETECTED' : 'NO KNOWN CRIMINAL RECORDS'}</div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-primary/10 flex items-center justify-center text-primary">
                           <User size={32} />
                         </div>
                         <div>
                           <div className="text-[10px] font-black text-slate-500 uppercase">IDENTIFIED SUBJECT</div>
                           <div className="text-2xl font-black italic tracking-tight text-slate-900">{result.name}</div>
                         </div>
                       </div>
                       <div className="p-4 rounded-full bg-slate-50 flex flex-col items-center border border-primary/10">
                         <div className="text-[8px] font-black text-slate-500 uppercase">MATCH</div>
                         <div className="text-lg font-black text-primary">{result.confidence}</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-primary/10">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">STATUS</div>
                          <div className={`text-xs font-bold uppercase ${result.isWanted ? 'text-rose-500' : 'text-emerald-500'}`}>{result.isWanted ? 'HIGH RISK' : 'CLEAN'}</div>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl border border-primary/10">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">RECORD SEARCH</div>
                          <div className="text-xs font-bold text-slate-900 uppercase">{result.isWanted ? 'PNDG WARRANTS' : 'VERIFIED ID'}</div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-primary/10">
                       <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <FileWarning size={10} className="text-amber-500" /> SYSTEM REMINDER
                       </div>
                       <div className="text-[10px] font-semibold text-slate-700 leading-relaxed">
                         Verify with official identification documents before processing. Record timestamp: {result.timestamp}
                       </div>
                    </div>

                    {result.isWanted && (
                      <button className="w-full py-4 rounded-xl bg-rose-500 text-white font-black uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-rose-100">
                        <Zap size={16} fill="currentColor" /> ALERT NEAREST STATION
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setResult(null)}
                      className="w-full py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors mt-2"
                    >
                      CLEAR SCAN DATA
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 24/7 Monitoring Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-2xl p-8 border border-primary/10 bg-black/40"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                24/7 Surveillance Monitoring
              </h3>
              <p className="text-muted-foreground text-sm mt-1">Real-time identification log from active nodes</p>
            </div>
            <div className="bg-primary/10 text-primary text-xs font-mono px-3 py-1.5 rounded-full border border-primary/20">
              ACTIVE NODES: 01
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Scans Today", value: result ? "142" : "141", color: "text-white" },
              { label: "Suspects Flagged", value: result?.isWanted ? "13" : "12", color: "text-red-500" },
              { label: "System Uptime", value: "99.9%", color: "text-green-500" },
              { label: "AI Confidence", value: "High", color: "text-primary" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-secondary/20 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target ID</th>
                  <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classification</th>
                  <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result && (
                  <motion.tr initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <td className="py-4 text-sm font-mono">{result.timestamp.split(', ')[1]}</td>
                    <td className="py-4 font-semibold">{result.name}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${result.isWanted ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {result.isWanted ? 'SUSPECT' : 'CIVILIAN'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${result.isWanted ? 'bg-red-500' : 'bg-green-500'}`} />
                        {result.isWanted ? 'High Alert' : 'Verified'}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-xs text-primary hover:underline">View Report</button>
                    </td>
                  </motion.tr>
                )}
                {[
                  { time: "14:28:12", id: "Unknown Individual", class: "CIVILIAN", status: "Verified" },
                  { time: "14:15:04", id: "Unknown Individual", class: "CIVILIAN", status: "Verified" },
                  { time: "13:45:55", id: "Vickram Rajiv", class: "SUSPECT", status: "High Alert" },
                ].map((row, i) => (
                  <tr key={i} className="opacity-50">
                    <td className="py-4 text-sm font-mono">{row.time}</td>
                    <td className="py-4 font-semibold">{row.id}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.class === 'SUSPECT' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {row.class}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${row.class === 'SUSPECT' ? 'bg-red-500' : 'bg-green-500'}`} />
                        {row.status}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                       <span className="text-xs text-muted-foreground italic">Archived</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIScannerSection;
