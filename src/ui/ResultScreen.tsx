import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/useGameStore';

interface ResultScreenProps {
  onRestart: () => void;
}

export function ResultScreen({ onRestart }: ResultScreenProps) {
  const sessionStats = useGameStore((state) => state.sessionStats);
  const endGameStatus = useGameStore((state) => state.endGameStatus);
  const ideology = useGameStore((state) => state.ideology);
  const forces = useGameStore((state) => state.forces);
  const playerName = useGameStore((state) => state.playerName);

  if (!endGameStatus) return null;

  // Calculate percentage
  const totalQuestions = sessionStats.correctAnswers + sessionStats.wrongAnswers;
  const percentage = totalQuestions > 0 ? Math.round((sessionStats.correctAnswers / totalQuestions) * 100) : 0;

  const isWin = endGameStatus.type === 'win';
  const score = isWin ? 
    (endGameStatus.title.includes('HOÀN CHỈNH') ? ideology * 100 + forces : ideology * 50 + forces) : 
    (Math.max(0, ideology * 10) + forces);

  return (
    <div className={`border-4 p-8 rounded-xl max-w-3xl w-full text-center shadow-2xl relative overflow-hidden flex flex-col ${isWin ? 'bg-zinc-900 border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.6)]' : 'bg-zinc-900 border-red-700 shadow-[0_0_50px_rgba(220,38,38,0.5)]'}`}>
      {/* Background Gradient */}
      <div className={`absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 ${isWin ? 'bg-gradient-to-br from-yellow-500 to-transparent' : 'bg-gradient-to-br from-red-700 to-transparent'}`} />

      {/* Header */}
      <div className="z-10 relative">
        <h2 className={`text-5xl font-black mb-2 tracking-widest uppercase ${isWin ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]' : 'text-red-500 drop-shadow-lg'}`}>
          {endGameStatus.title}
        </h2>
        <p className={`text-xl font-semibold mb-6 ${isWin ? 'text-yellow-50' : 'text-red-100'}`}>
          {endGameStatus.message}
        </p>

        {/* Score Card */}
        <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${isWin ? 'bg-yellow-900/30 border border-yellow-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
          <div className="text-left font-sans">
            <p className="text-gray-400 text-sm">HỒ SƠ</p>
            <p className="text-white font-bold text-xl uppercase">{playerName}</p>
          </div>
          <div className="text-right font-sans">
            <p className="text-gray-400 text-sm">ĐIỂM NHẬN THỨC</p>
            <p className={`font-black text-3xl ${isWin ? 'text-brand-gold' : 'text-brand-red'}`}>
              {score.toLocaleString()} Đ
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-sans">
          <div className="bg-black/40 p-4 rounded-lg border border-white/10 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">LẬP LUẬN ĐÚNG</span>
            <span className="text-green-400 font-bold text-2xl">{sessionStats.correctAnswers} / {totalQuestions}</span>
            <div className="w-full h-1 bg-gray-700 mt-2 rounded overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${percentage}%` }} />
            </div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/10 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">LẬP LUẬN SAI</span>
            <span className="text-red-400 font-bold text-2xl">{sessionStats.wrongAnswers}</span>
          </div>

          <div className="bg-black/40 p-4 rounded-lg border border-white/10 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">TƯ LIỆU MỞ KHÓA</span>
            <span className="text-purple-400 font-bold text-2xl">{sessionStats.bonusUnlocked}</span>
          </div>

          <div className="bg-black/40 p-4 rounded-lg border border-white/10 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">CHƯƠNG ĐẠT</span>
            <span className="text-blue-400 font-bold text-2xl">{sessionStats.chapterReached} / 4</span>
          </div>
        </div>

        {/* Details List */}
        {sessionStats.correctDetails.length > 0 && (
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-8 max-h-48 overflow-y-auto text-left font-sans scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <h3 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider sticky top-0 bg-zinc-950/90 py-1">Lịch sử lập luận đúng</h3>
            <ul className="space-y-3">
              {sessionStats.correctDetails.map((detail, idx) => (
                <li key={idx} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <div className="flex gap-2 mb-1 text-sm text-gray-300">
                    <span className="text-brand-gold font-bold whitespace-nowrap">Chương {detail.chapter}:</span>
                    <span className="italic line-clamp-2" title={detail.question}>{detail.question}</span>
                  </div>
                  <div className="text-green-400 font-bold text-sm pl-8 relative before:content-['→'] before:absolute before:left-3 before:text-green-600">
                    {detail.answer}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={onRestart}
          className={`px-10 py-4 font-bold rounded shadow-lg transform transition hover:scale-105 tracking-widest ${isWin ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-700 active:to-yellow-800 text-white font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white'}`}
        >
          {isWin ? 'HOÀN THÀNH HỒ SƠ' : 'ÔN TẬP LẠI'}
        </button>
      </div>
    </div>
  );
}
