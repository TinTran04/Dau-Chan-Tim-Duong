import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Text } from '@react-three/drei';
import { VanguardModel } from './VanguardModel';
import { useDialogueStore } from '../../stores/useDialogueStore';
import * as THREE from 'three';

type Vec3 = [number, number, number];

type Cluster = {
  label: string;
  position: Vec3;
  color: string;
  orbit: Vec3[];
};

const CLUSTERS: Cluster[] = [
  {
    label: 'Bến Nhà Rồng',
    position: [-3.4, 1.4, -1.5],
    color: '#facc15',
    orbit: [[-3.9, 1.9, -1.3], [-2.9, 1.95, -1.8], [-3.3, 0.9, -1.05]]
  },
  {
    label: 'Pháp - Mỹ - Anh',
    position: [-1.45, 2.45, -2.7],
    color: '#34d399',
    orbit: [[-2.0, 2.9, -2.45], [-0.95, 2.85, -2.95], [-1.45, 1.95, -2.25]]
  },
  {
    label: 'Bạn và thù',
    position: [1.45, 2.45, -2.7],
    color: '#38bdf8',
    orbit: [[0.95, 2.85, -2.95], [2.0, 2.9, -2.45], [1.45, 1.95, -2.25]]
  },
  {
    label: 'Luận cương',
    position: [3.4, 1.4, -1.5],
    color: '#fb7185',
    orbit: [[2.9, 1.95, -1.8], [3.9, 1.9, -1.3], [3.3, 0.9, -1.05]]
  }
];

const CORE_POSITION: Vec3 = [0, 1.45, 0.35];

function KnowledgeLink({ from, to, color, alert }: { from: Vec3; to: Vec3; color: string; alert: boolean }) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = new THREE.Vector3().subVectors(end, start);
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return (
    <mesh position={midpoint.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[alert ? 0.026 : 0.018, alert ? 0.026 : 0.018, length, 16]} />
      <meshBasicMaterial color={alert ? '#fb923c' : color} transparent opacity={alert ? 0.72 : 0.48} />
    </mesh>
  );
}

function KnowledgeNode({
  position,
  color,
  scale = 1,
  alert = false
}: {
  position: Vec3;
  color: string;
  scale?: number;
  alert?: boolean;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshPhysicalMaterial
          color={alert ? '#f97316' : color}
          emissive={alert ? '#ea580c' : color}
          emissiveIntensity={alert ? 0.75 : 0.42}
          roughness={0.32}
          clearcoat={0.4}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.34, 0.01, 12, 56]} />
        <meshBasicMaterial color={alert ? '#fdba74' : color} transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function KnowledgeCluster({ cluster, alert, active }: { cluster: Cluster; alert: boolean; active: boolean }) {
  return (
    <group>
      <KnowledgeNode position={cluster.position} color={cluster.color} scale={active ? 1.25 : 1.05} alert={alert} />
      {cluster.orbit.map((position, index) => (
        <React.Fragment key={`${cluster.label}-${index}`}>
          <KnowledgeLink from={cluster.position} to={position} color={cluster.color} alert={alert} />
          <KnowledgeNode position={position} color={cluster.color} scale={0.62} alert={alert} />
        </React.Fragment>
      ))}
      <Text
        position={[cluster.position[0], cluster.position[1] - 0.55, cluster.position[2] + 0.12]}
        rotation={[-0.25, 0, 0]}
        fontSize={0.18}
        maxWidth={1.6}
        textAlign="center"
        color={alert ? '#fed7aa' : '#e5e7eb'}
        anchorX="center"
        anchorY="middle"
      >
        {cluster.label}
      </Text>
    </group>
  );
}

function CentralSynthesisCore({ alert, completed }: { alert: boolean; completed: boolean }) {
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!coreRef.current) return;
    coreRef.current.rotation.y += delta * (completed ? 0.65 : 0.35);
    coreRef.current.position.y = CORE_POSITION[1] + Math.sin(state.clock.elapsedTime * 1.7) * 0.05;
  });

  return (
    <group ref={coreRef} position={CORE_POSITION}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshPhysicalMaterial
          color={alert ? '#f97316' : completed ? '#facc15' : '#e5e7eb'}
          emissive={alert ? '#ea580c' : completed ? '#f59e0b' : '#38bdf8'}
          emissiveIntensity={alert ? 0.75 : completed ? 0.85 : 0.45}
          roughness={0.24}
          clearcoat={0.6}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.84, 0.018, 16, 72]} />
        <meshBasicMaterial color={alert ? '#fdba74' : completed ? '#fde68a' : '#93c5fd'} transparent opacity={0.68} />
      </mesh>
      <Text
        position={[0, -0.86, 0.05]}
        rotation={[-0.25, 0, 0]}
        fontSize={0.19}
        maxWidth={2.2}
        textAlign="center"
        color={completed ? '#fef3c7' : '#e0f2fe'}
        anchorX="center"
        anchorY="middle"
      >
        Hành trình nhận thức
      </Text>
    </group>
  );
}

function ArchivePanels({ alert, completed }: { alert: boolean; completed: boolean }) {
  const panelColor = alert ? '#7f1d1d' : completed ? '#1e3a8a' : '#111827';
  const glowColor = alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8';

  return (
    <group position={[0, 1.75, -4.4]}>
      {[-3.1, 0, 3.1].map((x, index) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, index === 0 ? 0.16 : index === 2 ? -0.16 : 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.25, 1.55, 0.08]} />
            <meshStandardMaterial color={panelColor} roughness={0.58} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.82, 1.04, 0.02]} />
            <meshBasicMaterial color={glowColor} transparent opacity={index === 1 ? 0.34 : 0.2} />
          </mesh>
          <mesh position={[0, -0.58, 0.08]}>
            <boxGeometry args={[1.55, 0.04, 0.025]} />
            <meshBasicMaterial color="#e5e7eb" transparent opacity={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ResearchTable({ alert }: { alert: boolean }) {
  return (
    <group position={[0, 0.1, 1.35]}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.6, 3.95, 0.22, 56]} />
        <meshStandardMaterial color={alert ? '#3f1d12' : '#334155'} roughness={0.72} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.47, 0]}>
        <torusGeometry args={[2.72, 0.018, 16, 96]} />
        <meshBasicMaterial color={alert ? '#fb923c' : '#38bdf8'} transparent opacity={0.45} />
      </mesh>
      {[-1.35, 0, 1.35].map((x, index) => (
        <mesh key={x} position={[x, 0.52, index === 1 ? 0.18 : -0.22]} rotation={[0, 0, index === 0 ? 0.12 : index === 2 ? -0.1 : 0]} castShadow>
          <boxGeometry args={[0.9, 0.035, 1.15]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function ResearcherFigure({
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
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 + position[0]) * (active ? 0.025 : 0.012);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.08, 0]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial color="#e8c39e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.26, -0.02]} castShadow>
        <sphereGeometry args={[0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.36, 16, 20]} />
        <meshPhysicalMaterial color={coat} roughness={0.72} />
      </mesh>
      <mesh position={[0.24, 0.58, 0.15]} rotation={[1.1, 0, -0.25]} castShadow>
        <boxGeometry args={[0.28, 0.03, 0.38]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.75, 0.19]} castShadow>
        <boxGeometry args={[0.25, 0.045, 0.035]} />
        <meshPhysicalMaterial color={accent} roughness={0.5} />
      </mesh>
      <mesh position={[-0.08, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.28, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
      <mesh position={[0.08, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.28, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
    </group>
  );
}

function KnowledgeMap({
  alert,
  completed,
  choiceMode
}: {
  alert: boolean;
  completed: boolean;
  choiceMode: boolean;
}) {
  const mapRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mapRef.current) return;
    mapRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * (alert ? 0.18 : 0.08);
    mapRef.current.position.y = Math.sin(state.clock.elapsedTime * (alert ? 4 : 1.4)) * (alert ? 0.08 : 0.025);
  });

  return (
    <Float speed={1.15} rotationIntensity={0.06} floatIntensity={0.08}>
      <group ref={mapRef} position={[0, 0.25, -0.6]}>
        {CLUSTERS.map((cluster) => (
          <React.Fragment key={cluster.label}>
            <KnowledgeLink from={cluster.position} to={CORE_POSITION} color={cluster.color} alert={alert} />
            <KnowledgeCluster cluster={cluster} alert={alert} active={choiceMode || completed} />
          </React.Fragment>
        ))}
        <CentralSynthesisCore alert={alert} completed={completed} />
      </group>
    </Float>
  );
}

function KnowledgeRoom({
  alert,
  completed,
  choiceMode
}: {
  alert: boolean;
  completed: boolean;
  choiceMode: boolean;
}) {
  return (
    <>
      <fog attach="fog" args={[alert ? '#210b08' : completed ? '#111827' : '#020617', 8, 28]} />
      <ambientLight intensity={alert ? 0.32 : 0.5} color={alert ? '#fed7aa' : '#dbeafe'} />
      <directionalLight position={[4, 8, 6]} intensity={alert ? 1.6 : 2.4} color={alert ? '#fb923c' : '#bae6fd'} castShadow />
      <pointLight position={[0, 3.2, 0.2]} intensity={completed ? 42 : alert ? 26 : 34} color={alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8'} distance={10} />
      <spotLight position={[0, 6, 4]} angle={0.65} penumbra={0.8} intensity={alert ? 38 : 52} color={alert ? '#f97316' : '#e0f2fe'} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, -0.65]} receiveShadow>
        <circleGeometry args={[9, 72]} />
        <meshStandardMaterial color={alert ? '#1c0f0b' : '#0f172a'} roughness={0.86} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -0.65]}>
        <ringGeometry args={[3.95, 4.08, 96]} />
        <meshBasicMaterial color={alert ? '#fb923c' : '#38bdf8'} transparent opacity={0.28} />
      </mesh>

      <ArchivePanels alert={alert} completed={completed} />
      <ResearchTable alert={alert} />
      <KnowledgeMap alert={alert} completed={completed} choiceMode={choiceMode} />
      <ResearcherFigure position={[-2.25, -0.25, 1.65]} coat="#1e293b" accent="#38bdf8" active={!alert} />
      <ResearcherFigure position={[2.15, -0.25, 1.35]} coat="#312e81" accent="#facc15" active={completed} />

      <group position={[0, -0.35, 4.0]} rotation={[0, Math.PI, 0]}>
        <VanguardModel />
      </group>

      <ContactShadows position={[0, -0.15, 0]} opacity={0.58} scale={15} resolution={512} blur={2.4} far={5} color="#020617" />
      <Environment preset="city" />
    </>
  );
}

export function ValleyScene() {
  const currentNode = useDialogueStore((state) => state.currentNode);
  const nodeId = currentNode?.id || '';

  const alert = nodeId.includes('_C_feedback') ||
                nodeId.includes('_D_feedback') ||
                nodeId === 'ending';

  const completed = nodeId.includes('_A_feedback') ||
                    nodeId.includes('summary');

  const choiceMode = nodeId.includes('scene');

  return <KnowledgeRoom alert={alert} completed={completed} choiceMode={choiceMode} />;
}
