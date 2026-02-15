const neobrutalShadow = "6px 6px 0px #005060";
const neobrutalBorder = "4px solid #002040";

export default function LiveActivityFeed({ events }) {
  if (!events?.length) return null;

  return (
    <div
      className="border-4 border-[#002040] bg-white p-5 shadow-[6px_6px_0px_#005060] mb-6"
      style={{ boxShadow: neobrutalShadow }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h3 className="font-bold text-[#002040]">Live Activity</h3>
      </div>
      <ul className="space-y-2 text-sm font-semibold text-[#002040]">
        {events.map((e, i) => (
          <li key={i}>• {e}</li>
        ))}
      </ul>
    </div>
  );
}
