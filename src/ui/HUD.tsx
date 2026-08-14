import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { motion } from 'framer-motion';

export function HUD() {
  const { ideology, forces, chapter } = useGameStore();

  return (
    <motion.div 
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Top Left: Stats */}
      <div className="absolute top-4 left-4 flex flex-col gap-3">
        <div className="backdrop-blur-md bg-black/50 border border-white/10 px-4 py-3 rounded-lg flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between items-center">
            <span className="font-sans font-bold text-xs text-brand-gold uppercase tracking-wider">Nhận thức lịch sử</span>
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
          <span className="font-sans font-bold text-xs text-green-400 uppercase tracking-wider">Tư liệu</span>
          <span className="font-press text-[10px] text-white">{forces.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Right: Chapter Info */}
      <div className="absolute top-4 right-4">
        <div className="backdrop-blur-md bg-black/50 border border-white/10 px-6 py-3 rounded-lg text-right">
          <h2 className="font-sans font-black text-sm text-brand-gold uppercase tracking-widest">
            Chương {chapter === 1 ? 'I' : chapter === 2 ? 'II' : chapter === 3 ? 'III' : 'IV'}
          </h2>
          <p className="font-sans text-xs text-gray-300 mt-1">
            {chapter === 1 && "Hành trình tìm đường cứu nước"}
            {chapter === 2 && "Tiếp thu Đông - Tây"}
            {chapter === 3 && "Từ yêu nước đến Mác-Lênin"}
            {chapter === 4 && "Giả định lịch sử 1911"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
