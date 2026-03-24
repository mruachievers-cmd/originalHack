import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NeuralParticles = () => {
    const count = 5000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const radius = 30;
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = time * 0.01;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#0ea5e9"
                size={0.12}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.4}
            />
        </Points>
    );
};

const SubtleSphere = ({ position, color, distort, size }: { position: [number, number, number], color: string, distort: number, size: number }) => {
    const mesh = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime();
        // Updated scroll calculation for higher precision
        const scroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
        
        // Vertical movement relative to scroll
        mesh.current.position.y = position[1] - (scroll * 60) + Math.sin(time + position[0]) * 0.8;
        mesh.current.rotation.x = time * 0.3;
        mesh.current.rotation.z = time * 0.2;
        
        // Breathing scale pulse
        const pulse = 1 + Math.sin(time * 0.4) * 0.08;
        mesh.current.scale.set(pulse, pulse, pulse);
    });

    return (
        <Float speed={3} rotationIntensity={0.5} floatIntensity={1.5}>
            <Sphere ref={mesh} args={[size, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={distort}
                    speed={3}
                    roughness={0}
                    metalness={1}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.25}
                />
            </Sphere>
        </Float>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#020617]">
            {/* Dark radial glow for center visibility */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_70%)] opacity-80 z-[5]"></div>
            
            <Canvas dpr={[1, 2]} camera={{ fov: 60, position: [0, 0, 20] }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#0ea5e9" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#FF4A6B" />
                <spotLight position={[0, 10, 0]} intensity={1} color="#0ea5e9" />
                
                <NeuralParticles />
                
                <SubtleSphere position={[-15, 15, -5]} color="#0ea5e9" distort={0.4} size={3} />
                <SubtleSphere position={[18, 0, -10]} color="#FF4A6B" distort={0.5} size={4} />
                <SubtleSphere position={[-12, -30, -5]} color="#0ea5e9" distort={0.3} size={3.5} />
                <SubtleSphere position={[15, -60, -12]} color="#FF4A6B" distort={0.6} size={5} />
                <SubtleSphere position={[-5, -100, -2]} color="#10b981" distort={0.2} size={2.5} />

                {/* Enhanced Neural Grid */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                    <planeGeometry args={[200, 200, 40, 40]} />
                    <meshStandardMaterial
                        color="#0ea5e9"
                        wireframe
                        transparent
                        opacity={0.06}
                        emissive="#0ea5e9"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
