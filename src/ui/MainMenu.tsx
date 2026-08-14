import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLeaderboard } from '../services/leaderboard';
import type { LeaderboardEntry } from '../services/leaderboard';
import type { LocalPlayerData } from '../stores/useGameStore';

export function MainMenu() {
  const startGame = useGameStore((state) => state.startGame);
  const [name, setName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingLB, setLoadingLB] = useState(false);
  const [localPlayer, setLocalPlayer] = useState<LocalPlayerData | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem('dau_chan_tim_duong_player');
    if (localData) {
      try {
        const parsed = JSON.parse(localData) as LocalPlayerData;
        if (parsed.name) {
          setName(parsed.name);
          setLocalPlayer(parsed);
        }
      } catch (error) {
        console.error('Khong doc duoc du lieu nguoi choi:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (showLeaderboard) {
      setLoadingLB(true);
      fetchLeaderboard().then((data) => {
        setLeaderboardData(data);
        setLoadingLB(false);
      });
    }
  }, [showLeaderboard]);

  const handleStart = () => {
    if (name.trim().length < 2) {
      alert('Vui long nhap ten nhom hoac nguoi choi it nhat 2 ky tu.');
      return;
    }
    startGame(name.trim());
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="backdrop-blur-md bg-black/40 border border-white/20 p-12 rounded-2xl shadow-2xl pointer-events-auto flex flex-col items-center gap-6 text-center max-w-xl w-full">
        <div>
          <p className="font-press text-brand-gold text-xs tracking-widest mb-2 uppercase">Game Lich Su - On Tap Sau Thuyet Trinh</p>
          <h1 className="font-serif text-6xl text-brand-red font-bold uppercase" style={{ textShadow: '2px 2px 10px rgba(220, 20, 60, 0.5)' }}>
            Dau Chan Tim Duong
          </h1>
          <p className="font-sans text-gray-300 mt-2">Khoi phuc ho so con duong cuu nuoc</p>
        </div>

        {localPlayer && localPlayer.name === name.trim() ? (
          <div className="w-full bg-brand-red/10 border border-brand-red/30 p-4 rounded-lg my-2">
            <h3 className="font-bold text-brand-gold text-lg mb-2">CHAO MUNG TRO LAI, {localPlayer.name.toUpperCase()}!</h3>
            <div className="text-sm text-gray-300 font-sans grid grid-cols-2 gap-2 text-left bg-black/30 p-3 rounded">
              <p>Diem ho so cao nhat:</p>
              <p className="font-bold text-white text-right">{localPlayer.bestScore?.toLocaleString() || 0} D</p>
              <p>So luot on tap:</p>
              <p className="font-bold text-white text-right">{localPlayer.totalPlays || 0}</p>
            </div>
            <p className="text-xs text-brand-gold mt-3 font-sans italic">San sang noi lai ho so nghien cuu cua ban?</p>
          </div>
        ) : null}

        <div className="flex flex-col w-full gap-4 mt-2">
          <input
            type="text"
            placeholder="NHAP TEN NHOM / NGUOI CHOI"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full bg-black/50 border-2 border-brand-red/50 focus:border-brand-gold text-white font-sans text-center text-lg py-3 rounded-lg outline-none transition-all placeholder:text-gray-500"
            maxLength={20}
          />

          <button
            onClick={handleStart}
            className="w-full px-10 py-4 bg-gradient-to-r from-red-800 to-brand-red hover:from-brand-red hover:to-red-500 border-none text-white font-sans font-black text-xl rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(220,20,60,0.5)] hover:shadow-[0_0_30px_rgba(220,20,60,0.9)] hover:scale-105 tracking-widest cursor-pointer uppercase"
          >
            {localPlayer && localPlayer.name === name.trim() ? 'TIEP TUC KHOI PHUC' : 'BAT DAU KHOI PHUC'}
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full px-10 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-brand-gold font-sans font-bold text-md rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] tracking-widest cursor-pointer uppercase mt-2"
          >
            Bang xep hang
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto"
          >
            <div className="bg-zinc-900 border-2 border-brand-gold rounded-2xl w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(255,215,0,0.3)] overflow-hidden relative">
              <div className="bg-gradient-to-r from-yellow-700 via-brand-gold to-yellow-700 py-4 px-6 relative">
                <h2 className="text-2xl font-black text-black text-center uppercase tracking-widest">Bang Diem Hoc Tap</h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-white font-black text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                >
                  x
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-black/40">
                {loadingLB ? (
                  <div className="text-center text-brand-gold py-10 font-sans animate-pulse">Dang tai du lieu hoc tap...</div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 font-sans italic">Chua co nhom hoc nao duoc ghi danh. Ban hay la nguoi dau tien!</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {leaderboardData.map((entry, index) => (
                      <div key={`${entry.name}-${index}`} className={`flex items-center justify-between p-4 rounded-lg border ${index === 0 ? 'bg-yellow-500/20 border-yellow-500' : index === 1 ? 'bg-gray-300/10 border-gray-400' : index === 2 ? 'bg-amber-700/20 border-amber-600' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-2xl w-8 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                            #{index + 1}
                          </span>
                          <span className="font-bold text-white text-lg font-sans">{entry.name}</span>
                        </div>
                        <span className="font-black text-brand-gold text-xl">{entry.score.toLocaleString()} D</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 bg-zinc-950 text-center text-xs text-gray-500 font-sans">
                Du lieu duoc dong bo qua Google Sheets.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 font-press text-[10px] text-gray-500">React 3D Engine | Historical Diorama</div>
      <div className="absolute bottom-4 right-4 font-press text-[10px] text-gray-500">v2.1.0 © 2026</div>
    </motion.div>
  );
}
