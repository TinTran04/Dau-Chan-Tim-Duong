import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../stores/useDialogueStore';

export function DialogueSystem() {
  const { currentNode, advance, makeChoice, loadChapter } = useDialogueStore();

  useEffect(() => {
    loadChapter(1);
  }, [loadChapter]);

  if (!currentNode) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end items-center pb-8 px-4">
      <AnimatePresence mode="wait">
        {currentNode.type === 'line' && (
          <motion.div
            key={currentNode.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-4xl pointer-events-auto cursor-pointer"
            onClick={() => advance()}
          >
            <div className="backdrop-blur-xl bg-black/60 border-2 border-brand-red/40 p-6 rounded-xl shadow-[0_0_30px_rgba(220,20,60,0.2)] relative">
              {currentNode.speaker && (
                <div className="absolute -top-5 left-6 bg-brand-dark-red border border-brand-red/60 px-4 py-1 rounded shadow-lg">
                  <span className="font-sans font-bold text-brand-gold tracking-widest text-sm uppercase">
                    {currentNode.speaker}
                  </span>
                </div>
              )}
              <p className="font-sans text-white text-lg leading-relaxed mt-2">
                {currentNode.text}
              </p>
              <div className="absolute bottom-4 right-6 animate-pulse">
                <span className="font-sans text-brand-gold text-xs">Click de tiep tuc</span>
              </div>
            </div>
          </motion.div>
        )}

        {currentNode.type === 'choice' && (
          <motion.div
            key={currentNode.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-3xl pointer-events-auto flex flex-col items-center"
          >
            <div className="backdrop-blur-xl bg-black/80 border border-brand-gold/40 p-6 rounded-xl w-full mb-4 shadow-xl text-center">
              <p className="font-sans font-bold text-brand-gold text-lg">{currentNode.prompt}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-gray-400">Chon cach xu ly ho so</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              {currentNode.options?.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => makeChoice(opt)}
                  className="w-full text-left backdrop-blur-md bg-black/70 hover:bg-brand-red/90 border border-white/20 hover:border-brand-gold p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg group flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/50 group-hover:bg-brand-gold group-hover:text-black transition-colors shrink-0">
                    <span className="font-sans font-bold text-white group-hover:text-black">{opt.key}</span>
                  </div>
                  <span className="font-sans text-gray-100 group-hover:text-white mt-1 leading-relaxed font-medium">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
