import { useEffect, useState } from "react";

const LIMIT = 48 * 60 * 60 * 1000;

export default function ResponseTimer({ appliedAt, status, onGhost }) {
  const [remaining, setRemaining] = useState(LIMIT);

  useEffect(() => {
    if (status !== "pending") return;

    const tick = () => {
      const applied = new Date(appliedAt).getTime();
      const diff = LIMIT - (Date.now() - applied);

      if (diff <= 0) {
        onGhost?.();
        return;
      }
      setRemaining(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [appliedAt, status, onGhost]);

  if (status !== "pending") return null;

  const h = Math.floor(remaining / (1000 * 60 * 60));
  const m = Math.floor((remaining / (1000 * 60)) % 60);
  const s = Math.floor((remaining / 1000) % 60);

  return (
    <p className="text-sm font-semibold text-[#002040]">
      Awaiting response • {h}h {m}m {s}s left
    </p>
  );
}
