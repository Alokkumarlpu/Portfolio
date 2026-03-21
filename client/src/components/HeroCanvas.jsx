import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial, Points } from '@react-three/drei';

// Floating particle field
const ParticleField = () => {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#a78bfa" size={0.03} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
};

// Large purple orb (background, right side)
const PurpleOrb = () => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002;
  });
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={[4, 0, -3]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#4c1d95" transparent opacity={0.15} />
      </mesh>
    </Float>
  );
};

// Cyan thin ring (left side)
const CyanRing = () => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.003;
      ref.current.rotation.y += 0.002;
    }
  });
  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <mesh ref={ref} position={[-5, 1, -2]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
};

// Wireframe icosahedron
const WireIcosahedron = () => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.003;
      ref.current.rotation.y += 0.004;
      ref.current.rotation.z += 0.002;
    }
  });
  return (
    <Float speed={2} rotationIntensity={1}>
      <mesh ref={ref} position={[3, -2, -1]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#7c3aed" wireframe transparent opacity={0.4} />
      </mesh>
    </Float>
  );
};

// Wireframe octahedron
const WireOctahedron = () => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.008;
    }
  });
  return (
    <Float speed={3}>
      <mesh ref={ref} position={[-3, -2, -1]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.5} />
      </mesh>
    </Float>
  );
};

const HeroCanvas = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
          <ParticleField />
          <PurpleOrb />
          <CyanRing />
          <WireIcosahedron />
          <WireOctahedron />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroCanvas;
