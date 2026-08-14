import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Text } from '@react-three/drei';
import { VanguardModel } from './VanguardModel';
import { useDialogueStore } from '../../stores/useDialogueStore';
import * as THREE from 'three';

type Vec3 = [number, number, number];

function SimulationGuide({
  position,
  coat,
  accent,
  active
}: {
  position: Vec3;
  coat: string;
  accent: string;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.35 + position[0]) * (active ? 0.025 : 0.01);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshPhysicalMaterial color="#e8c39e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, -0.03]} castShadow>
        <sphereGeometry args={[0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshPhysicalMaterial color="#111827" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 18, 24]} />
        <meshPhysicalMaterial color={coat} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.8, 0.22]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.035]} />
        <meshPhysicalMaterial color={accent} roughness={0.5} />
      </mesh>
      <mesh position={[0.28, 0.6, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      <mesh position={[-0.28, 0.6, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      <mesh position={[-0.09, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.065, 0.31, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
      <mesh position={[0.09, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.065, 0.31, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
    </group>
  );
}

function BranchScreen({
  position,
  rotationY,
  label,
  color,
  alert,
  active
}: {
  position: Vec3;
  rotationY: number;
  label: string;
  color: string;
  alert: boolean;
  active: boolean;
}) {
  const screenRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!screenRef.current) return;
    screenRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * (active ? 0.045 : 0.018);
  });

  return (
    <group ref={screenRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.85, 1.22, 0.07]} />
        <meshStandardMaterial color={alert ? '#2b1110' : '#111827'} roughness={0.52} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.46, 0.82, 0.02]} />
        <meshBasicMaterial color={alert ? '#fb923c' : color} transparent opacity={active ? 0.4 : 0.2} />
      </mesh>
      <mesh position={[0, -0.48, 0.08]}>
        <boxGeometry args={[1.24, 0.035, 0.02]} />
        <meshBasicMaterial color="#e5e7eb" transparent opacity={0.42} />
      </mesh>
      <Text position={[0, -0.75, 0.1]} fontSize={0.15} maxWidth={1.55} textAlign="center" color="#e5e7eb" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function SimulationConsole({ alert, completed }: { alert: boolean; completed: boolean }) {
  const consoleRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!consoleRef.current) return;
    consoleRef.current.rotation.y += delta * (completed ? 0.25 : alert ? 0.1 : 0.16);
    consoleRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.025;
  });

  return (
    <group ref={consoleRef} position={[0, 0.52, 0.45]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.65, 0.34, 48]} />
        <meshStandardMaterial color={alert ? '#3f1d12' : '#334155'} roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[1.05, 0.018, 16, 96]} />
        <meshBasicMaterial color={alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8'} transparent opacity={0.58} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <octahedronGeometry args={[0.46, 1]} />
        <meshPhysicalMaterial
          color={alert ? '#f97316' : completed ? '#facc15' : '#93c5fd'}
          emissive={alert ? '#ea580c' : completed ? '#f59e0b' : '#38bdf8'}
          emissiveIntensity={0.62}
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
    </group>
  );
}

function BranchLinks({ alert, completed }: { alert: boolean; completed: boolean }) {
  const color = alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8';
  const targets: Vec3[] = [[-2.8, 1.9, -2.7], [0, 2.35, -3.25], [2.8, 1.9, -2.7]];

  return (
    <group>
      {targets.map((target, index) => {
        const start = new THREE.Vector3(0, 1.05, 0.45);
        const end = new THREE.Vector3(...target);
        const direction = new THREE.Vector3().subVectors(end, start);
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = direction.length();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

        return (
          <mesh key={index} position={midpoint.toArray()} quaternion={quaternion}>
            <cylinderGeometry args={[0.018, 0.018, length, 12]} />
            <meshBasicMaterial color={color} transparent opacity={alert ? 0.44 : 0.34} />
          </mesh>
        );
      })}
    </group>
  );
}

function CounterfactualRoom({ alert, completed }: { alert: boolean; completed: boolean }) {
  return (
    <>
      <fog attach="fog" args={[alert ? '#210b08' : '#020617', 7, 28]} />
      <ambientLight intensity={alert ? 0.3 : 0.48} color={alert ? '#fed7aa' : '#dbeafe'} />
      <directionalLight position={[6, 8, 6]} intensity={alert ? 1.5 : 2.35} color={alert ? '#fb923c' : '#e0f2fe'} castShadow />
      <pointLight position={[0, 3.2, 0]} intensity={completed ? 46 : alert ? 28 : 38} color={alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8'} distance={10} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, -0.55]} receiveShadow>
        <circleGeometry args={[8.8, 72]} />
        <meshStandardMaterial color={alert ? '#1c0f0b' : '#0f172a'} roughness={0.86} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, -0.55]}>
        <ringGeometry args={[3.2, 3.32, 96]} />
        <meshBasicMaterial color={alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8'} transparent opacity={0.32} />
      </mesh>

      <BranchLinks alert={alert} completed={completed} />
      <SimulationConsole alert={alert} completed={completed} />
      <BranchScreen position={[-2.9, 1.7, -2.65]} rotationY={0.28} label="Nhanh o lai" color="#38bdf8" alert={alert} active={!completed} />
      <BranchScreen position={[0, 2.15, -3.2]} rotationY={0} label="Chuyen di 1911" color="#facc15" alert={alert} active={completed} />
      <BranchScreen position={[2.9, 1.7, -2.65]} rotationY={-0.28} label="Con duong khac" color="#c084fc" alert={alert} active={!alert} />

      <SimulationGuide position={[-2.1, 0.0, 0.85]} coat="#1e293b" accent="#38bdf8" active={!alert} />
      <SimulationGuide position={[2.0, 0.0, 0.72]} coat="#581c87" accent="#facc15" active={completed} />

      <group position={[0.15, 0.0, 2.9]} rotation={[0, Math.PI, 0]}>
        <VanguardModel />
      </group>

      <ContactShadows position={[0, -0.15, 0]} opacity={0.56} scale={17} resolution={512} blur={2.3} far={5} color="#020617" />
      <Environment preset="city" />
    </>
  );
}

export function MountainScene() {
  const currentNode = useDialogueStore((state) => state.currentNode);
  const nodeId = currentNode?.id || '';
  const alert = nodeId === 'ch4_resB' ||
                nodeId === 'ch4_resCcoalition' ||
                nodeId === 'ch4_final_puzzle' ||
                nodeId === 'ch4_resC' ||
                nodeId === 'ending';
  const completed = nodeId === 'ch4_resA' ||
                    nodeId === 'ch4_victory_true' ||
                    nodeId === 'ch4_final_win';

  return <CounterfactualRoom alert={alert} completed={completed} />;
}
