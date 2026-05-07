"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 30;
const ORANGE = "#E8420A";
const ORANGE_GLOW = "#FF6B2C";
const CONNECTION_DISTANCE = 1.8;

interface ParticleData {
  initialPosition: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAxis: THREE.Vector3;
  phase: number;
}

function generateParticles(): ParticleData[] {
  const particles: ParticleData[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = 1.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const initialPosition = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    const orbitAxis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    particles.push({
      initialPosition,
      orbitRadius: radius,
      orbitSpeed: 0.05 + Math.random() * 0.15,
      orbitAxis,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

function CoreShape() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color={ORANGE}
        emissive={ORANGE}
        emissiveIntensity={0.45}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
}

function ParticleField({ particles }: { particles: ParticleData[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const tempVec = new THREE.Vector3();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angle = p.phase + t * p.orbitSpeed;
      tempVec.copy(p.initialPosition);
      tempVec.applyAxisAngle(p.orbitAxis, angle);
      positions[i * 3] = tempVec.x;
      positions[i * 3 + 1] = tempVec.y;
      positions[i * 3 + 2] = tempVec.z;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    let lineIdx = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          linePositions[lineIdx++] = positions[i * 3];
          linePositions[lineIdx++] = positions[i * 3 + 1];
          linePositions[lineIdx++] = positions[i * 3 + 2];
          linePositions[lineIdx++] = positions[j * 3];
          linePositions[lineIdx++] = positions[j * 3 + 1];
          linePositions[lineIdx++] = positions[j * 3 + 2];
        }
      }
    }

    for (let i = lineIdx; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }

    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, lineIdx / 3);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={PARTICLE_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={ORANGE_GLOW}
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={(PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2 * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial color={ORANGE} transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

export default function Logo3D() {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color={ORANGE_GLOW} />
        <pointLight position={[-5, -3, -2]} intensity={0.3} color="#FFAA77" />
        <CoreShape />
        <ParticleField particles={particles} />
      </Canvas>
    </div>
  );
}
