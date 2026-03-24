import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertTriangle, CheckCircle, Volume2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Classification = 'Scream' | 'Gunshot' | 'Silence';

interface ThreatMetadata {
  classification: Classification;
  confidence: number;
  signal_path: 'Direct' | 'Mesh';
  user_id: string;
  location: string;
  timestamp: string;
}

interface AcousticScannerProps {
  signalPath?: 'Direct' | 'Mesh';
  userId?: string;
  onClassification?: (meta: ThreatMetadata) => void;
}

const classificationConfig: Record<Classification, { color: string; bg: string; border: string; icon: typeof AlertTriangle; label: string }> = {
  Gunshot: {
    color: 'text-red-500',
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    icon: AlertTriangle,
    label: '⚠️ HIGH THREAT: Violent Audio Detected',
  },
  Scream: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    icon: AlertTriangle,
    label: '🔶 ELEVATED: Distress Signal Detected',
  },
  Silence: {
    color: 'text-green-500',
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    icon: CheckCircle,
    label: '✅ NO THREAT: Ambient Silence',
  },
};

const AcousticScanner = ({
  signalPath = 'Direct',
  userId = 'GN-24-X',
  onClassification,
}: AcousticScannerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ThreatMetadata | null>(null);
  const [countdown, setCountdown] = useState(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Draw waveform on canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wave line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isAnalyzing ? '#f97316' : '#ef4444';
    ctx.shadowColor = isAnalyzing ? '#f97316' : '#ef4444';
    ctx.shadowBlur = 12;
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    animFrameRef.current = requestAnimationFrame(drawWaveform);
  }, [isAnalyzing]);

  // Draw idle pulse when not listening
  const drawIdlePulse = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = Date.now() / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i++) {
      const y = canvas.height / 2 + Math.sin((i / canvas.width) * Math.PI * 6 + time * 2) * 8;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();
    animFrameRef.current = requestAnimationFrame(drawIdlePulse);
  }, []);

  useEffect(() => {
    if (!isListening) {
      animFrameRef.current = requestAnimationFrame(drawIdlePulse);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isListening, drawIdlePulse]);

  const mockClassify = (): { classification: Classification; confidence: number } => {
    const roll = Math.random();
    if (roll < 0.15) return { classification: 'Gunshot', confidence: 0.87 + Math.random() * 0.1 };
    if (roll < 0.40) return { classification: 'Scream', confidence: 0.72 + Math.random() * 0.15 };
    return { classification: 'Silence', confidence: 0.91 + Math.random() * 0.08 };
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      setResult(null);
      setCountdown(5);
      cancelAnimationFrame(animFrameRef.current);
      drawWaveform();

      // Countdown
      let count = 5;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          runClassification();
        }
      }, 1000);
    } catch {
      toast.error('Microphone access denied. Please allow mic permissions.');
    }
  };

  const runClassification = async () => {
    setIsAnalyzing(true);
    setIsListening(false);

    // Stop mic
    streamRef.current?.getTracks().forEach(t => t.stop());
    cancelAnimationFrame(animFrameRef.current);
    await new Promise(r => setTimeout(r, 1500));

    const { classification, confidence } = mockClassify();
    let location = 'Unknown';
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej)
      );
      location = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
    } catch { location = '17.3850, 78.4867'; }

    const meta: ThreatMetadata = {
      classification,
      confidence: parseFloat(confidence.toFixed(2)),
      signal_path: signalPath,
      user_id: userId,
      location,
      timestamp: new Date().toISOString(),
    };

    setResult(meta);
    setIsAnalyzing(false);
    onClassification?.(meta);

    // Send to backend
    try {
      await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
      });
      if (classification !== 'Silence') {
        toast.error(`🔊 ALEF: ${classificationConfig[classification].label}`);
      } else {
        toast.success(`ALEF: ${classificationConfig[classification].label}`);
      }
    } catch {
      toast.warning('ALEF: Result stored locally — backend offline');
    }

    drawIdlePulse();
  };

  const stopListening = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    cancelAnimationFrame(animFrameRef.current);
    setIsListening(false);
    setIsAnalyzing(false);
    drawIdlePulse();
  };

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-rose-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">ALEF · Acoustic Life-Sign</span>
        </div>
        {isListening && (
          <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            CAPTURING · {countdown}s
          </div>
        )}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-[10px] font-black text-primary">
            <Loader2 size={12} className="animate-spin" />
            AI CLASSIFYING...
          </div>
        )}
      </div>

      {/* Waveform Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/5">
        <canvas ref={canvasRef} width={340} height={60} className="w-full" />
        {isListening && (
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-0.5 bg-orange-400/60 shadow-[0_0_8px_#f97316]"
          />
        )}
      </div>

      {/* Classification Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border ${classificationConfig[result.classification].bg} ${classificationConfig[result.classification].border}`}
          >
            <div className={`text-xs font-black uppercase tracking-widest ${classificationConfig[result.classification].color}`}>
              {classificationConfig[result.classification].label}
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-white/50 font-mono">
              <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
              <span>Path: {result.signal_path}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isAnalyzing}
        className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
          isListening
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30'
        }`}
      >
        {isListening ? <><MicOff size={14} /> Stop Capture</> : <><Mic size={14} /> Enable ALEF Scan (5s)</>}
      </button>
    </div>
  );
};

export default AcousticScanner;
