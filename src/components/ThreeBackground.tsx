import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NeuralParticles = () => {
    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const radius = 25;
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
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.x = time * 0.02;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#0ea5e9"
                size={0.07}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.15}
            />
        </Points>
    );
};

const SubtleSphere = ({ position, color, distort, size }: { position: [number, number, number], color: string, distort: number, size: number }) => {
    const mesh = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime();
        const scroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Combine scroll position with subtle auto-floating
        mesh.current.position.y = position[1] - (scroll * 40) + Math.sin(time + position[0]) * 0.5;
        mesh.current.rotation.x = time * 0.2;
        mesh.current.rotation.y = time * 0.3;
        
        // Subtle pulsing scale
        const scale = 1 + Math.sin(time * 0.5) * 0.05;
        mesh.current.scale.set(scale, scale, scale);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={mesh} args={[size, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={distort}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.08}
                />
            </Sphere>
        </Float>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-transparent">
            {/* Overlay Gradient to blend with existing CSS linear gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-60 pointer-events-none z-10"></div>
            
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#0ea5e9" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF4A6B" />
                
                <NeuralParticles />
                
                <SubtleSphere position={[-12, 10, -5]} color="#0ea5e9" distort={0.4} size={2} />
                <SubtleSphere position={[15, -5, -8]} color="#FF4A6B" distort={0.5} size={3} />
                <SubtleSphere position={[-10, -25, -2]} color="#0ea5e9" distort={0.3} size={2.5} />
                <SubtleSphere position={[12, -45, -6]} color="#FF4A6B" distort={0.4} size={4} />

                {/* Subtle Neural Grid */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                    <planeGeometry args={[150, 150, 40, 40]} />
                    <meshStandardMaterial
                        color="#0ea5e9"
                        wireframe
                        transparent
                        opacity={0.02}
                    />
                </mesh>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
