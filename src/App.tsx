import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { VillageScene } from './components/3d/VillageScene';
import { ValleyScene } from './components/3d/ValleyScene';
import { FactoryScene } from './components/3d/FactoryScene';
import { MainMenu } from './ui/MainMenu';
import { HUD } from './ui/HUD';
import { DialogueSystem } from './ui/DialogueSystem';
import { ResultScreen } from './ui/ResultScreen';
import { useGameStore } from './stores/useGameStore';
import { AnimatePresence, motion } from 'framer-motion';

const audioTracks = {
  menu: new Audio(`${import.meta.env.BASE_URL}menu_music.mp3`),
  1: new Audio(`${import.meta.env.BASE_URL}chapter1_archive.mp3`),
  2: new Audio(`${import.meta.env.BASE_URL}chapter2_voyage.mp3`),
  3: new Audio(`${import.meta.env.BASE_URL}chapter3_resolution.mp3`),
} as const;

Object.values(audioTracks).forEach((track) => {
  track.loop = true;
  track.preload = 'auto';
  track.volume = 0;
});

function fadeAudio(activeTrack: HTMLAudioElement) {
  Object.values(audioTracks).forEach((track) => {
    const targetVolume = track === activeTrack ? 0.35 : 0;
    const nextVolume = track.volume + (targetVolume - track.volume) * 0.12;
    track.volume = Math.max(0, Math.min(0.35, nextVolume));

    if (track !== activeTrack && track.volume < 0.02) {
      track.pause();
    }
  });
}

export default function App() {
  const isStarted = useGameStore((state) => state.isStarted);
  const chapter = useGameStore((state) => state.chapter);
  const endGameStatus = useGameStore((state) => state.endGameStatus);
  const setEndGameStatus = useGameStore((state) => state.setEndGameStatus);

  useEffect(() => {
    const activeTrack = !isStarted ? audioTracks.menu : audioTracks[chapter];

    const playActiveTrack = () => {
      activeTrack.play().catch((error) => {
        console.log('Đang chờ người chơi tương tác để phát nhạc...', error);
      });
    };

    playActiveTrack();
    window.addEventListener('click', playActiveTrack);
    window.addEventListener('keydown', playActiveTrack);

    const fadeInterval = window.setInterval(() => fadeAudio(activeTrack), 80);

    return () => {
      window.removeEventListener('click', playActiveTrack);
      window.removeEventListener('keydown', playActiveTrack);
      window.clearInterval(fadeInterval);
    };
  }, [isStarted, chapter]);

  const handleRestart = () => {
    setEndGameStatus(null);
    useGameStore.setState({ isStarted: false, chapter: 1, ideology: 50, forces: 1000 });
  };

  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a3a] to-[#0a0a0a]">
        <Canvas camera={{ position: [0, 5, 12], fov: 45 }} shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
          <Suspense fallback={null}>
            {chapter === 1 && <VillageScene />}
            {chapter === 2 && <ValleyScene />}
            {chapter === 3 && <FactoryScene />}

            <EffectComposer multisampling={0}>
              <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} opacity={0.8} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Suspense>

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={!isStarted}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        {!isStarted && !endGameStatus && <MainMenu key="main-menu" />}

        {isStarted && !endGameStatus && (
          <>
            <HUD key="hud" />
            <DialogueSystem key="dialogue" />
          </>
        )}

        {endGameStatus && (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <ResultScreen onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
