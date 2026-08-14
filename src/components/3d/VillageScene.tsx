import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Sky, Text } from '@react-three/drei';
import { VanguardModel } from './VanguardModel';
import { useDialogueStore } from '../../stores/useDialogueStore';
import * as THREE from 'three';

type Vec3 = [number, number, number];

function SimplePerson({
  position,
  coat = '#334155',
  accent = '#facc15',
  hat = false,
  active = true
}: {
  position: Vec3;
  coat?: string;
  accent?: string;
  hat?: boolean;
  active?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 1.6 + position[0]);
    const step = Math.sin(state.clock.elapsedTime * 0.85 + position[2]);
    groupRef.current.position.x = position[0] + step * (active ? 0.06 : 0.018);
    groupRef.current.position.y = position[1] + pulse * (active ? 0.035 : 0.012);
    groupRef.current.rotation.y = step * (active ? 0.18 : 0.06);
    groupRef.current.rotation.z = pulse * (active ? 0.025 : 0.008);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshPhysicalMaterial color="#e8c39e" roughness={0.48} />
      </mesh>
      {hat && (
        <>
          <mesh position={[0, 1.43, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 0.25, 24]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.31, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.04, 24]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        </>
      )}
      <mesh position={[0, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.42, 18, 24]} />
        <meshPhysicalMaterial color={coat} roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.78, 0.22]} castShadow>
        <boxGeometry args={[0.3, 0.06, 0.04]} />
        <meshPhysicalMaterial color={accent} roughness={0.55} />
      </mesh>
      <mesh position={[-0.27, 0.62, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      <mesh position={[0.27, 0.62, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.28, 12, 16]} />
        <meshPhysicalMaterial color={coat} roughness={0.78} />
      </mesh>
      <mesh position={[-0.09, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.07, 0.3, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
      <mesh position={[0.09, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.07, 0.3, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.85} />
      </mesh>
    </group>
  );
}

function HarborShip({ alert }: { alert: boolean }) {
  const shipRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!shipRef.current) return;
    shipRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
    shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
  });

  return (
    <group ref={shipRef} position={[2.9, 0.28, -2.7]} rotation={[0, -0.34, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.5, 1.0]} />
        <meshStandardMaterial color={alert ? '#7f1d1d' : '#7c2d12'} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.7, 0.6, 0.78]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[0.35, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 12]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0.92, 1.35, 0]} castShadow>
        <boxGeometry args={[1.1, 0.68, 0.035]} />
        <meshStandardMaterial color={alert ? '#fed7aa' : '#f8fafc'} roughness={0.55} />
      </mesh>
      {[-1.25, -0.55, 0.15, 0.85, 1.55].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.53]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.045, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function DockAndWater({ alert }: { alert: boolean }) {
  return (
    <group>
      <mesh position={[0, -0.22, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color={alert ? '#1e1b4b' : '#075985'} roughness={0.74} metalness={0.08} />
      </mesh>
      <mesh position={[-2.35, 0.03, 1.6]} castShadow receiveShadow>
        <boxGeometry args={[4.9, 0.2, 2.2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.88} />
      </mesh>
      {[-4.3, -3.1, -1.9, -0.7, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.28, 0.55]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.92, 12]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
      ))}
      {[-3.65, -2.55, -1.45].map((x, index) => (
        <group key={x} position={[x, 0.22, 2.35]} rotation={[0, 0, index === 1 ? 0.08 : -0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.56, 0.35, 0.38]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.42, 0.04, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ColonialHarborBackdrop({ alert, completed }: { alert: boolean; completed: boolean }) {
  const lampRef = useRef<THREE.PointLight>(null);
  const bannerColor = alert ? '#7f1d1d' : completed ? '#854d0e' : '#1e293b';

  useFrame((state) => {
    if (!lampRef.current) return;
    lampRef.current.intensity = (alert ? 18 : 12) + Math.sin(state.clock.elapsedTime * 3.1) * 2;
  });

  return (
    <group>
      <group position={[-5.15, 0.68, -3.35]} rotation={[0, 0.18, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.65, 1.65, 1.05]} />
          <meshStandardMaterial color={alert ? '#3f1d12' : '#4b5563'} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[2.9, 0.18, 1.2]} />
          <meshStandardMaterial color="#1f2937" roughness={0.82} />
        </mesh>
        <mesh position={[0.0, 0.13, 0.55]}>
          <boxGeometry args={[1.95, 0.52, 0.035]} />
          <meshBasicMaterial color={bannerColor} transparent opacity={0.86} />
        </mesh>
        <Text position={[0, 0.14, 0.59]} fontSize={0.12} maxWidth={1.8} color="#f8fafc" anchorX="center" anchorY="middle">
          Kho thuộc địa
        </Text>
      </group>

      <group position={[4.85, 0.55, -3.6]} rotation={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.05, 1.35, 0.82]} />
          <meshStandardMaterial color={alert ? '#451a03' : '#374151'} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2.26, 0.14, 0.94]} />
          <meshStandardMaterial color="#111827" roughness={0.78} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.1, 0.43]}>
            <boxGeometry args={[0.38, 0.42, 0.035]} />
            <meshBasicMaterial color={alert ? '#fed7aa' : '#bae6fd'} transparent opacity={0.22} />
          </mesh>
        ))}
      </group>

      <group position={[-4.15, 0.56, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.065, 1.35, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.58} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshBasicMaterial color={alert ? '#fb923c' : '#fde68a'} transparent opacity={0.72} />
        </mesh>
        <pointLight ref={lampRef} position={[0, 0.8, 0]} color={alert ? '#fb923c' : '#fde68a'} distance={4.2} intensity={12} />
      </group>

      {[-4.6, -3.7, 3.55, 4.28].map((x, index) => (
        <group key={x} position={[x, 0.2, 1.55 + (index % 2) * 0.32]} rotation={[0, index % 2 ? -0.18 : 0.14, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.42, 0.58]} />
            <meshStandardMaterial color={index < 2 ? '#92400e' : '#78350f'} roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.48, 0.035, 0.48]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
        </group>
      ))}

      <group position={[0, 2.72, -4.22]}>
        {[
          [-2.7, 'Cần Vương'],
          [-0.9, 'Yên Thế'],
          [0.9, 'Đông Du'],
          [2.7, 'Duy Tân']
        ].map(([x, label]) => (
          <group key={label} position={[Number(x), 0, 0.1]}>
            <mesh>
              <boxGeometry args={[1.28, 0.34, 0.035]} />
              <meshBasicMaterial color={completed ? '#facc15' : '#0f172a'} transparent opacity={completed ? 0.34 : 0.5} />
            </mesh>
            <Text position={[0, 0, 0.03]} fontSize={0.12} maxWidth={1.1} color="#f8fafc" anchorX="center" anchorY="middle">
              {label}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}

function JourneyMarkers({ completed }: { completed: boolean }) {
  const markers: Array<[number, string]> = [
    [-3.2, 'Thuộc địa'],
    [-1.5, 'Can Vuong'],
    [0.2, 'Yen The'],
    [1.9, 'Đường lối mới']
  ];

  return (
    <group position={[0, 1.62, -4.1]}>
      <mesh castShadow>
        <boxGeometry args={[6.8, 1.25, 0.08]} />
        <meshStandardMaterial color="#111827" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.17, 0.06]}>
        <boxGeometry args={[5.95, 0.035, 0.02]} />
        <meshBasicMaterial color={completed ? '#facc15' : '#38bdf8'} transparent opacity={0.65} />
      </mesh>
      {markers.map(([x, label], index) => (
        <group key={label} position={[x, 0.17, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshBasicMaterial color={completed || index < 2 ? '#facc15' : '#38bdf8'} />
          </mesh>
          <Text position={[0, -0.34, 0]} fontSize={0.16} color="#e5e7eb" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </group>
      ))}
    </group>
  );
}

function DepartureAction({ completed }: { completed: boolean }) {
  const actionRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!actionRef.current) return;
    actionRef.current.position.x = completed ? -1.15 + Math.sin(state.clock.elapsedTime * 1.2) * 0.22 : -2.2;
    actionRef.current.position.y = 0.42 + Math.sin(state.clock.elapsedTime * 2.6) * 0.025;
  });

  if (!completed) return null;

  return (
    <group ref={actionRef} position={[-1.15, 0.42, 1.82]}>
      <mesh rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.72, 0.04, 0.06]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.38, 0.03, 0]}>
        <coneGeometry args={[0.12, 0.28, 24]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
    </group>
  );
}

export function VillageScene() {
  const currentNode = useDialogueStore((state) => state.currentNode);
  const nodeId = currentNode?.id || '';
  const alert = nodeId.includes('_C_feedback') ||
                nodeId.includes('_D_feedback') ||
                nodeId === 'ending';
  const completed = nodeId.includes('_A_feedback') ||
                    nodeId.includes('summary');

  return (
    <>
      <Sky distance={450000} sunPosition={[5, 1.5, 7]} turbidity={alert ? 12 : 6} rayleigh={alert ? 3 : 1.5} mieCoefficient={0.04} />
      <fog attach="fog" args={[alert ? '#1e1b4b' : '#082f49', 8, 34]} />
      <ambientLight intensity={alert ? 0.35 : 0.58} color={alert ? '#fed7aa' : '#e0f2fe'} />
      <directionalLight position={[8, 8, 5]} intensity={alert ? 1.8 : 3.0} color={alert ? '#fb923c' : '#fef3c7'} castShadow />
      <pointLight position={[-2, 2.8, 1.4]} intensity={alert ? 20 : 28} color={completed ? '#facc15' : '#38bdf8'} distance={8} />

      <DockAndWater alert={alert} />
      <ColonialHarborBackdrop alert={alert} completed={completed} />
      <HarborShip alert={alert} />
      <JourneyMarkers completed={completed} />
      <DepartureAction completed={completed} />

      <SimplePerson position={[-2.95, 0.12, 0.9]} coat="#0f172a" accent="#38bdf8" hat active={!completed} />
      <SimplePerson position={[0.1, 0.12, 1.05]} coat="#334155" accent="#facc15" active />
      <SimplePerson position={[1.25, 0.12, 0.45]} coat="#164e63" accent="#e0f2fe" hat active={!alert} />

      <group position={[-1.15, 0.1, 2.72]} rotation={[0, 0.2, 0]}>
        <VanguardModel />
      </group>

      <ContactShadows position={[0, -0.15, 0]} opacity={0.56} scale={18} blur={2.2} far={5} color="#020617" />
      <Environment preset="dawn" />
    </>
  );
}
