import { useGameStore } from '../stores/useGameStore';
import { motion } from 'framer-motion';

const chapterRoman = {
  1: 'I',
  2: 'II',
  3: 'III',
} as const;

const chapterTitles = {
  1: 'Những Con Đường Chưa Mở',
  2: 'Qua Những Đại Dương',
  3: 'Con Đường Được Xác Lập',
} as const;

export function HUD() {
  const { ideology, forces, chapter } = useGameStore();

  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-3">
        <div className="backdrop-blur-md bg-black/50 border border-white/10 px-4 py-3 rounded-lg flex flex-col gap-2 min-w-[220px]">
          <div className="flex justify-between items-center">
            <span className="font-sans font-bold text-xs text-brand-gold uppercase tracking-wider">Độ chính xác hồ sơ</span>
            <span className="font-press text-[10px] text-white">{ideology}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-brand-red"
              initial={{ width: 0 }}
              animate={{ width: `${ideology}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="backdrop-blur-md bg-black/50 border border-white/10 px-4 py-3 rounded-lg flex justify-between items-center">
          <span className="font-sans font-bold text-xs text-green-400 uppercase tracking-wider">Tư liệu khôi phục</span>
          <span className="font-press text-[10px] text-white">{forces.toLocaleString()}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="backdrop-blur-md bg-black/50 border border-white/10 px-6 py-3 rounded-lg text-right">
          <h2 className="font-sans font-black text-sm text-brand-gold uppercase tracking-widest">
            Chương {chapterRoman[chapter]}
          </h2>
          <p className="font-sans text-xs text-gray-300 mt-1">{chapterTitles[chapter]}</p>
        </div>
      </div>
    </motion.div>
  );
}
