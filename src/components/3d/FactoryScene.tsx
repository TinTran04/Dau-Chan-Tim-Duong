import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Text } from '@react-three/drei';
import { VanguardModel } from './VanguardModel';
import { useDialogueStore } from '../../stores/useDialogueStore';
import * as THREE from 'three';

type Vec3 = [number, number, number];

function OrganizingLink({ from, to, color }: { from: Vec3; to: Vec3; color: string }) {
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
      <cylinderGeometry args={[0.012, 0.012, length, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.62} />
    </mesh>
  );
}

function ArchivePerson({
  position,
  coat,
  accent,
  holdingPaper = false,
  active = true
}: {
  position: Vec3;
  coat: string;
  accent: string;
  holdingPaper?: boolean;
  active?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 1.45 + position[0]);
    const step = Math.sin(state.clock.elapsedTime * 0.9 + position[2]);
    groupRef.current.position.x = position[0] + step * (active ? 0.07 : 0.018);
    groupRef.current.position.y = position[1] + pulse * (active ? 0.034 : 0.012);
    groupRef.current.rotation.y = step * (active ? 0.2 : 0.06);
    groupRef.current.rotation.z = pulse * (active ? 0.02 : 0.006);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshPhysicalMaterial color="#e8c39e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, -0.03]} castShadow>
        <sphereGeometry args={[0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <meshPhysicalMaterial color="#111827" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.57, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 18, 24]} />
        <meshPhysicalMaterial color={coat} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.78, 0.22]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.035]} />
        <meshPhysicalMaterial color={accent} roughness={0.5} />
      </mesh>
      <mesh position={[-0.27, 0.6, 0]} rotation={[0, 0, 0.22]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      <mesh position={[0.27, 0.6, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      {holdingPaper && (
        <mesh position={[0.36, 0.45, 0.2]} rotation={[1.1, 0, -0.2]} castShadow>
          <boxGeometry args={[0.34, 0.03, 0.48]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.58} />
        </mesh>
      )}
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

function DocumentaryTimeline({ alert, completed }: { alert: boolean; completed: boolean }) {
  const color = alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8';
  const markers: Array<[number, string]> = [
    [-3.0, 'Bao chi'],
    [-1.05, 'Tổ chức'],
    [1.05, 'Đường cách mệnh'],
    [3.0, 'Hội nghị 1930']
  ];

  return (
    <group position={[0, 2.15, -4.2]}>
      <mesh castShadow>
        <boxGeometry args={[7.2, 1.55, 0.08]} />
        <meshStandardMaterial color={alert ? '#1f1110' : '#111827'} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.12, 0.06]}>
        <boxGeometry args={[6.35, 0.045, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
      {markers.map(([x, label], index) => (
        <group key={label} position={[x, 0.12, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshBasicMaterial color={completed || index < 2 ? color : '#94a3b8'} />
          </mesh>
          <Text position={[0, -0.38, 0]} fontSize={0.16} color="#e5e7eb" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </group>
      ))}
    </group>
  );
}

function EditingTable({ alert }: { alert: boolean }) {
  return (
    <group position={[0, 0.05, 0.55]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.2, 1.85]} />
        <meshStandardMaterial color={alert ? '#3f1d12' : '#78350f'} roughness={0.82} />
      </mesh>
      {[-1.45, -0.3, 0.85].map((x, index) => (
        <mesh key={x} position={[x, 0.58, index === 1 ? 0.18 : -0.15]} rotation={[0, 0, index === 0 ? 0.12 : -0.08]} castShadow>
          <boxGeometry args={[0.86, 0.03, 1.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[1.62, 0.72, 0.15]} castShadow>
        <boxGeometry args={[0.72, 0.42, 0.42]} />
        <meshStandardMaterial color="#111827" roughness={0.62} metalness={0.12} />
      </mesh>
      <mesh position={[1.62, 0.72, 0.39]}>
        <boxGeometry args={[0.52, 0.26, 0.02]} />
        <meshBasicMaterial color={alert ? '#fb923c' : '#38bdf8'} transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function ProjectorBeam({ alert, completed }: { alert: boolean; completed: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!beamRef.current) return;
    beamRef.current.material.opacity = (alert ? 0.15 : 0.22) + Math.sin(state.clock.elapsedTime * 2.2) * 0.035;
  });

  return (
    <group>
      <mesh ref={beamRef} position={[0, 1.65, -1.9]} rotation={[-Math.PI / 2.65, 0, 0]}>
        <coneGeometry args={[2.3, 4.5, 4, 1, true]} />
        <meshBasicMaterial color={alert ? '#fb923c' : completed ? '#facc15' : '#93c5fd'} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[-1.65, 1.2, 1.25]} rotation={[0.18, -0.5, 0]} castShadow>
        <boxGeometry args={[0.72, 0.44, 0.62]} />
        <meshStandardMaterial color="#0f172a" roughness={0.52} metalness={0.18} />
      </mesh>
      <mesh position={[-1.25, 1.2, 1.1]} rotation={[0.18, -0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.32, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.2} />
      </mesh>
    </group>
  );
}

function RevolutionPreparationBackdrop({ alert, completed }: { alert: boolean; completed: boolean }) {
  const wheelRef = useRef<THREE.Mesh>(null);
  const glowColor = alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8';
  const organizationNodes: Vec3[] = [
    [-1.0, -0.1, 0.12],
    [0, 0.32, 0.12],
    [1.0, -0.1, 0.12],
    [0, -0.48, 0.12]
  ];

  useFrame((state, delta) => {
    if (!wheelRef.current) return;
    wheelRef.current.rotation.z += delta * (completed ? 1.2 : 0.55);
    wheelRef.current.position.y = 1.03 + Math.sin(state.clock.elapsedTime * 1.8) * 0.025;
  });

  return (
    <group>
      <group position={[-4.45, 1.05, -1.82]} rotation={[0, 0.22, 0]}>
        {[0, 0.62, 1.24].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.08, 1.05]} />
            <meshStandardMaterial color="#451a03" roughness={0.82} />
          </mesh>
        ))}
        {[
          [-0.28, 0.33, '#e5e7eb'],
          [0.22, 0.33, '#facc15'],
          [-0.2, 0.95, '#fb7185'],
          [0.28, 0.95, '#e5e7eb']
        ].map(([x, y, color]) => (
          <mesh key={`${x}-${y}`} position={[Number(x), Number(y), 0.08]} rotation={[0.1, 0, Number(x) * 0.08]} castShadow>
            <boxGeometry args={[0.34, 0.035, 0.46]} />
            <meshStandardMaterial color={String(color)} roughness={0.58} />
          </mesh>
        ))}
      </group>

      <group position={[3.85, 0.95, -1.58]} rotation={[0, -0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.38, 0.55, 0.82]} />
          <meshStandardMaterial color="#111827" roughness={0.7} metalness={0.18} />
        </mesh>
        <mesh ref={wheelRef} position={[-0.55, 0.08, 0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.24, 0.035, 16, 48]} />
          <meshStandardMaterial color={glowColor} roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0.22, 0.36, 0.48]}>
          <boxGeometry args={[0.7, 0.04, 0.48]} />
          <meshBasicMaterial color="#f8fafc" transparent opacity={0.84} />
        </mesh>
        <Text position={[0.22, 0.42, 0.53]} fontSize={0.1} maxWidth={0.62} color="#111827" anchorX="center" anchorY="middle">
          Báo Thanh Niên
        </Text>
      </group>

      <group position={[0, 2.58, -4.12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.15, 1.55, 0.08]} />
          <meshStandardMaterial color={alert ? '#2a100d' : '#0f172a'} roughness={0.64} />
        </mesh>
        {organizationNodes.slice(0, -1).map((point, index) => (
          <OrganizingLink key={`org-top-${index}`} from={point} to={organizationNodes[index + 1]} color={glowColor} />
        ))}
        <OrganizingLink from={organizationNodes[0]} to={organizationNodes[3]} color={glowColor} />
        <OrganizingLink from={organizationNodes[1]} to={organizationNodes[3]} color={glowColor} />
        <OrganizingLink from={organizationNodes[2]} to={organizationNodes[3]} color={glowColor} />
        {[
          [-1.0, -0.1, 'Tư tưởng'],
          [0, 0.32, 'Chính trị'],
          [1.0, -0.1, 'Tổ chức'],
          [0, -0.48, 'Đảng 1930']
        ].map(([x, y, label]) => (
          <group key={String(label)} position={[Number(x), Number(y), 0.12]}>
            <mesh>
              <sphereGeometry args={[label === 'Đảng 1930' ? 0.13 : 0.1, 24, 24]} />
              <meshBasicMaterial color={label === 'Đảng 1930' ? '#facc15' : glowColor} transparent opacity={0.9} />
            </mesh>
            <Text position={[0, -0.22, 0.03]} fontSize={0.1} maxWidth={0.8} color="#f8fafc" anchorX="center" anchorY="middle">
              {label}
            </Text>
          </group>
        ))}
      </group>

      <group position={[0.92, 0.78, 1.34]} rotation={[0, -0.16, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.045, 0.92]} />
          <meshBasicMaterial color="#fef3c7" transparent opacity={0.92} />
        </mesh>
        <Text position={[0, 0.04, 0.03]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.09} maxWidth={0.6} color="#7f1d1d" anchorX="center" anchorY="middle">
          Cương lĩnh
        </Text>
      </group>
    </group>
  );
}

function ResolutionAction({ completed }: { completed: boolean }) {
  const stampRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!stampRef.current) return;
    stampRef.current.position.y = completed ? 0.9 + Math.abs(Math.sin(state.clock.elapsedTime * 2.4)) * 0.18 : 0.9;
    stampRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.7) * 0.08;
  });

  if (!completed) return null;

  return (
    <group ref={stampRef} position={[0.25, 0.9, 0.8]} rotation={[0, 0, -0.18]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.32, 24]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.82} />
      </mesh>
    </group>
  );
}

function ArchiveRoom({ alert, completed }: { alert: boolean; completed: boolean }) {
  return (
    <>
      <fog attach="fog" args={[alert ? '#1f1110' : '#111827', 8, 26]} />
      <ambientLight intensity={alert ? 0.32 : 0.48} color={alert ? '#fed7aa' : '#e0f2fe'} />
      <directionalLight position={[5, 8, 6]} intensity={alert ? 1.6 : 2.4} color={alert ? '#fb923c' : '#fef3c7'} castShadow />
      <pointLight position={[0, 3.1, -1]} intensity={completed ? 40 : alert ? 24 : 34} color={alert ? '#fb923c' : completed ? '#facc15' : '#38bdf8'} distance={9} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, -0.5]} receiveShadow>
        <circleGeometry args={[8.5, 72]} />
        <meshStandardMaterial color={alert ? '#1c0f0b' : '#18181b'} roughness={0.86} metalness={0.06} />
      </mesh>

      <DocumentaryTimeline alert={alert} completed={completed} />
      <RevolutionPreparationBackdrop alert={alert} completed={completed} />
      <EditingTable alert={alert} />
      <ProjectorBeam alert={alert} completed={completed} />
      <ResolutionAction completed={completed} />

      <ArchivePerson position={[-2.65, 0.0, 0.75]} coat="#1e293b" accent="#38bdf8" holdingPaper active={!alert} />
      <ArchivePerson position={[2.35, 0.0, 0.55]} coat="#4c1d95" accent="#facc15" holdingPaper active={completed} />
      <ArchivePerson position={[0.7, 0.0, -0.15]} coat="#374151" accent="#fb7185" active={alert} />

      <group position={[-0.65, 0.02, 2.7]} rotation={[0, 0.3, 0]}>
        <VanguardModel />
      </group>

      <ContactShadows position={[0, -0.15, 0]} opacity={0.58} scale={16} resolution={512} blur={2.2} far={5} color="#020617" />
      <Environment preset="night" />
    </>
  );
}

export function FactoryScene() {
  const currentNode = useDialogueStore((state) => state.currentNode);
  const nodeId = currentNode?.id || '';
  const alert = nodeId.includes('_C_feedback') ||
                nodeId.includes('_D_feedback') ||
                nodeId === 'ending';
  const completed = nodeId.includes('_A_feedback') ||
                    nodeId.includes('summary');

  return <ArchiveRoom alert={alert} completed={completed} />;
}
