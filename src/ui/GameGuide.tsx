import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type GameGuideProps = {
  isStarted: boolean;
};

export function GameGuide({ isStarted }: GameGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`absolute ${isStarted ? 'top-24 right-4' : 'top-4 right-4'} z-30 pointer-events-auto flex items-center gap-2 rounded-lg border border-brand-gold/40 bg-black/60 px-4 py-2 text-sm font-bold uppercase tracking-wider text-brand-gold backdrop-blur-md transition hover:border-brand-gold hover:bg-brand-gold hover:text-black`}
        aria-label="Mở hướng dẫn chơi"
      >
        <HelpCircle size={18} />
        Hướng dẫn
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-xl rounded-xl border-2 border-brand-gold bg-zinc-950 shadow-[0_0_40px_rgba(255,215,0,0.25)]"
              initial={{ y: 24, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.96, opacity: 0 }}
            >
              <div className="flex items-center justify-between border-b border-brand-gold/30 px-6 py-4">
                <h2 className="font-sans text-xl font-black uppercase tracking-widest text-brand-gold">
                  Hướng dẫn chơi
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:border-brand-gold hover:text-brand-gold"
                  aria-label="Đóng hướng dẫn"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 px-6 py-5 font-sans text-sm leading-relaxed text-gray-200">
                <p>
                  Bạn nhập vai nhà nghiên cứu trẻ, đi qua 3 chương để nối lại hồ sơ về hành trình tìm đường cứu nước.
                </p>
                <div className="grid gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <strong className="text-brand-gold">Khi gặp lựa chọn:</strong> chọn đáp án bạn thấy đầy đủ nhất. Mỗi câu có 1 đáp án tốt nhất, 1 đáp án gần đúng và 2 đáp án sai.
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <strong className="text-brand-gold">Sau khi chọn:</strong> game giải thích ngay vì sao đáp án đó đúng, gần đúng hoặc sai, rồi mở cảnh tiếp theo.
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <strong className="text-brand-gold">Điểm số:</strong> đáp án tốt nhất tăng điểm nhiều nhất; đáp án gần đúng vẫn cho đi tiếp nhưng ít điểm hơn; đáp án sai bị trừ độ chính xác hồ sơ.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
