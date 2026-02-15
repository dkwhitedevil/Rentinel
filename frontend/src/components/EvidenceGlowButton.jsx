export default function EvidenceGlowButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="
        mt-4
        bg-[#007070] text-white font-bold py-2 px-4
        border-4 border-[#002040]
        shadow-[0_0_0_0_#005060]
        animate-glow
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
        transition-all
      "
    >
      Generate Legal Evidence
    </button>
  );
}
