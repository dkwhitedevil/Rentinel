export default function BlockchainLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="w-16 h-16 border-4 border-[#002040] border-t-transparent rounded-full animate-spin"></div>

      <p className="font-bold text-[#002040]">
        Anchoring your application on-chain...
      </p>
    </div>
  );
}
