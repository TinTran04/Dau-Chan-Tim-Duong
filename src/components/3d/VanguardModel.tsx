import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';
import * as THREE from 'three';

type TravelerModelProps = GroupProps;

export function VanguardModel(props: TravelerModelProps) {
  const group = useRef<THREE.Group>(null);
  const baseY = Array.isArray(props.position) ? Number(props.position[1] || 0) : 0;

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.025 + baseY;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <Float speed={1.2} rotationIntensity={0.035} floatIntensity={0.045}>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.34, 48, 48]} />
          <meshPhysicalMaterial color="#e8c39e" roughness={0.45} clearcoat={0.12} />
        </mesh>

        <group position={[0, 1.34, -0.02]}>
          <mesh position={[0, 0.1, -0.02]} castShadow>
            <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
            <meshPhysicalMaterial color="#171717" roughness={0.82} />
          </mesh>
          <mesh position={[-0.16, 0.05, 0.26]} rotation={[0, 0, 0.55]} castShadow>
            <capsuleGeometry args={[0.055, 0.18, 12, 16]} />
            <meshPhysicalMaterial color="#171717" roughness={0.82} />
          </mesh>
          <mesh position={[0.14, 0.02, 0.27]} rotation={[0, 0, -0.35]} castShadow>
            <capsuleGeometry args={[0.05, 0.16, 12, 16]} />
            <meshPhysicalMaterial color="#171717" roughness={0.82} />
          </mesh>
        </group>

        <mesh position={[-0.11, 1.28, 0.31]} castShadow>
          <sphereGeometry args={[0.035, 24, 24]} />
          <meshPhysicalMaterial color="#111111" clearcoat={1} roughness={0.12} />
        </mesh>
        <mesh position={[0.11, 1.28, 0.31]} castShadow>
          <sphereGeometry args={[0.035, 24, 24]} />
          <meshPhysicalMaterial color="#111111" clearcoat={1} roughness={0.12} />
        </mesh>

        <mesh position={[0, 0.68, 0]} castShadow>
          <capsuleGeometry args={[0.24, 0.48, 24, 32]} />
          <meshPhysicalMaterial color="#1f2937" roughness={0.68} clearcoat={0.08} />
        </mesh>
        <mesh position={[0, 0.87, 0.22]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.38, 0.08, 0.08]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        <mesh position={[0.12, 0.62, 0.24]} rotation={[0.18, 0, -0.22]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.05]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.7} />
        </mesh>

        <group position={[0.34, 0.6, 0.02]} rotation={[0, 0, -0.18]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.34, 12, 16]} />
            <meshPhysicalMaterial color="#1f2937" roughness={0.72} />
          </mesh>
          <mesh position={[0.05, -0.32, 0.16]} rotation={[1.25, 0, -0.08]} castShadow>
            <boxGeometry args={[0.34, 0.03, 0.46]} />
            <meshPhysicalMaterial color="#f5ead7" roughness={0.62} />
          </mesh>
        </group>

        <group position={[-0.34, 0.62, 0]} rotation={[0, 0, 0.16]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.34, 12, 16]} />
            <meshPhysicalMaterial color="#1f2937" roughness={0.72} />
          </mesh>
          <mesh position={[-0.03, -0.32, 0.02]} castShadow>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshPhysicalMaterial color="#e8c39e" roughness={0.52} />
          </mesh>
        </group>

        <mesh position={[-0.28, 0.58, -0.08]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.12]} />
          <meshPhysicalMaterial color="#7c2d12" roughness={0.82} />
        </mesh>
        <mesh position={[-0.08, 0.75, 0.23]} rotation={[0, 0, -0.8]} castShadow>
          <boxGeometry args={[0.04, 0.85, 0.035]} />
          <meshPhysicalMaterial color="#92400e" roughness={0.7} />
        </mesh>

        <mesh position={[-0.12, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.38, 24]} />
          <meshPhysicalMaterial color="#111827" roughness={0.9} />
        </mesh>
        <mesh position={[0.12, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.38, 24]} />
          <meshPhysicalMaterial color="#111827" roughness={0.9} />
        </mesh>
        <mesh position={[-0.12, -0.07, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.24]} />
          <meshPhysicalMaterial color="#0a0a0a" roughness={0.35} clearcoat={0.35} />
        </mesh>
        <mesh position={[0.12, -0.07, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.24]} />
          <meshPhysicalMaterial color="#0a0a0a" roughness={0.35} clearcoat={0.35} />
        </mesh>
      </Float>
    </group>
  );
}
