import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { id: "record", label: "Recording your application on-chain…", icon: "⛓" },
  { id: "protected", label: "Your application is now protected.", icon: "🛡" },
  { id: "tracking", label: "Rentinel is tracking landlord response.", icon: "👁" },
];

export default function BlockchainLoaderStaged({ onComplete, durationMs = 2500 }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const perStage = durationMs / STAGES.length;
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStageIndex(i), i * perStage)
    );
    const done = setTimeout(() => onComplete?.(), durationMs);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [durationMs, onComplete]);

  const current = STAGES[stageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[320px] px-6"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-4xl border-4 border-[#002040] bg-white animate-pulse">
            {current.icon}
          </div>
          <p className="text-xl font-bold text-[#002040] max-w-sm">
            {current.label}
          </p>
          <div className="mt-6 flex justify-center gap-1.5">
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition ${
                  i <= stageIndex ? "bg-[#007070]" : "bg-[#002040]/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 w-16 h-16 border-4 border-[#002040] border-t-transparent rounded-full animate-spin" />
    </motion.div>
  );
}
