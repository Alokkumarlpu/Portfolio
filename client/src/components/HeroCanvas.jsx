import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial, Icosahedron, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef();
  
  // Create 300 points
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    const colors = new Float32Array(300 * 3);
    const colorPurple = new THREE.Color('#7c3aed');
    const colorCyan = new THREE.Color('#06b6d4');

    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const mixedColor = Math.random() > 0.5 ? colorPurple : colorCyan;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y += 0.0002;
    
    // Organic drifting
    const positionArray = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < 300; i++) {
        positionArray[i * 3 + 1] += Math.sin(time + i) * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const Scene = () => {
  const { mouse, camera } = useThree();
  
  useFrame(() => {
    // Mouse Parallax
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#06b6d4" />
      
      <ParticleField />

      {/* Large Distorted Sphere */}
      <Float speed={1} floatIntensity={0.5}>
        <mesh position={[5, 0, -4]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <MeshDistortMaterial
            color="#4c1d95"
            opacity={0.12}
            transparent
            distort={0.3}
            speed={1.5}
          />
        </mesh>
      </Float>

      {/* Thin Torus Ring */}
      <Float speed={1.5}>
        <Torus args={[2, 0.015, 16, 120]} position={[-5, 1, -3]}>
          <meshBasicMaterial color="#06b6d4" opacity={0.25} transparent />
        </Torus>
      </Float>

      {/* Wireframe Icosahedron */}
      <Float speed={3} rotationIntensity={2}>
        <Icosahedron args={[0.7, 1]} position={[3, 3, -2]}>
          <meshBasicMaterial color="#7c3aed" opacity={0.5} transparent wireframe />
        </Icosahedron>
      </Float>

      {/* Wireframe Octahedron */}
      <Float speed={2}>
        <Octahedron args={[0.5]} position={[-4, -3, -1]}>
          <meshBasicMaterial color="#06b6d4" opacity={0.4} transparent wireframe />
        </Octahedron>
      </Float>
    </>
  );
};

const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
