import { useEffect, useState } from "react";

export default function GhostTimer({ appliedAt, onGhost }) {
  const GHOST_LIMIT = 48 * 60 * 60 * 1000; // 48h in ms
  const [remaining, setRemaining] = useState(GHOST_LIMIT);

  useEffect(() => {
    const applied = new Date(appliedAt).getTime();

    const update = () => {
      const diff = GHOST_LIMIT - (Date.now() - applied);

      if (diff <= 0) {
        onGhost();
        return;
      }
      setRemaining(diff);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [appliedAt, onGhost]);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <p className="text-sm font-semibold text-[#002040]">
      Ghost detection in: {hours}h {minutes}m {seconds}s
    </p>
  );
}
