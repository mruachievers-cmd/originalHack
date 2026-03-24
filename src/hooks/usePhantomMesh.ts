import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RelayPacket {
  userId: string;
  lastGPS: { lat: number; lng: number } | null;
  timestamp: string;
  signalPath: 'Direct' | 'Mesh';
}

interface PhantomMeshState {
  isMeshActive: boolean;
  isOffline: boolean;
  nearbyDevices: number;
  meshStatus: 'Scanning' | 'Connected' | 'Idle' | 'Relaying';
  broadcastSOS: (userId?: string) => Promise<void>;
  lastRelayPacket: RelayPacket | null;
}

export const usePhantomMesh = (): PhantomMeshState => {
  const [isMeshActive, setIsMeshActive] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [nearbyDevices, setNearbyDevices] = useState(0);
  const [meshStatus, setMeshStatus] = useState<PhantomMeshState['meshStatus']>('Idle');
  const [lastRelayPacket, setLastRelayPacket] = useState<RelayPacket | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor online/offline state
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setMeshStatus('Idle');
    };
    const handleOffline = () => {
      setIsOffline(true);
      setMeshStatus('Scanning');
      setIsMeshActive(true);
      toast.warning('📡 Network offline — Phantom Mesh activated. Scanning for relay nodes...');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate BLE device discovery when mesh is active (Web Bluetooth requires user gesture, so we simulate)
  useEffect(() => {
    if (isMeshActive || isOffline) {
      setMeshStatus('Scanning');
      scanIntervalRef.current = setInterval(() => {
        // Simulate discovering 1-3 nearby GuardianNet nodes
        const discovered = Math.floor(Math.random() * 3) + 1;
        setNearbyDevices(discovered);
        if (discovered > 0) setMeshStatus('Connected');
      }, 3000);
    } else {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setMeshStatus('Idle');
      setNearbyDevices(0);
    }
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [isMeshActive, isOffline]);

  const getLastGPS = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 17.385044, lng: 78.486671 }) // Fallback: Hyderabad
      );
    });
  };

  const broadcastSOS = useCallback(async (userId = 'GN-24-X') => {
    const lastGPS = await getLastGPS();
    const packet: RelayPacket = {
      userId,
      lastGPS,
      timestamp: new Date().toISOString(),
      signalPath: isOffline ? 'Mesh' : 'Direct',
    };
    setLastRelayPacket(packet);

    if (isOffline && nearbyDevices > 0) {
      // Simulate Bluetooth broadcast via nearby devices
      setMeshStatus('Relaying');
      toast.info(`📡 Relaying SOS for ${userId} via ${nearbyDevices} Bluetooth mesh node(s)`, {
        duration: 5000,
      });
      // After simulated relay, notify the police dashboard via backend when it comes back online
      sessionStorage.setItem('pendingRelayPacket', JSON.stringify(packet));
    } else {
      // Send directly to backend
      try {
        await fetch('http://localhost:5000/api/relay-packet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packet),
        });
        toast.success('🛡️ SOS transmitted via direct connection');
      } catch {
        // Store for later if backend unreachable
        sessionStorage.setItem('pendingRelayPacket', JSON.stringify(packet));
        toast.warning('SOS stored — will relay when connection is restored');
      }
    }
  }, [isOffline, nearbyDevices]);

  // When back online, flush pending relay packets
  useEffect(() => {
    if (!isOffline) {
      const pending = sessionStorage.getItem('pendingRelayPacket');
      if (pending) {
        const packet: RelayPacket = JSON.parse(pending);
        fetch('http://localhost:5000/api/relay-packet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...packet, signalPath: 'Mesh' }),
        }).then(() => {
          sessionStorage.removeItem('pendingRelayPacket');
          toast.success('📡 Stored relay packet transmitted to command center');
        }).catch(console.error);
      }
    }
  }, [isOffline]);

  return { isMeshActive, isOffline, nearbyDevices, meshStatus, broadcastSOS, lastRelayPacket };
};
