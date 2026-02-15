import { useEffect, useState, useCallback, useRef } from "react";

export default function useLiveApplications(initialApps) {
  const [apps, setApps] = useState(initialApps);
  const [events, setEvents] = useState(() => {
    const pending = initialApps.filter((a) => a.status === "pending").length;
    return pending > 0 ? [`Monitoring ${pending} application${pending > 1 ? "s" : ""} — 48h response window active`] : [];
  });
  const simulatedRef = useRef(false);

  const addEvent = useCallback((e) => {
    setEvents((prev) => [e, ...prev]);
  }, []);

  useEffect(() => {
    if (simulatedRef.current) return;
    simulatedRef.current = true;

    const timer = setTimeout(() => {
      setApps((prev) => {
        const firstPendingIdx = prev.findIndex((a) => a.status === "pending");
        if (firstPendingIdx === -1) return prev;
        return prev.map((a, i) =>
          i === firstPendingIdx ? { ...a, status: "responded", respondedAt: new Date().toISOString() } : a
        );
      });
      setEvents((prev) => [
        "Landlord opened your application",
        "Landlord responded to an application",
        ...prev,
      ]);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return { apps, setApps, events, addEvent };
}
