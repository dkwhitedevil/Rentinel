export default function ApplySuccess({ txHash, onDashboard }) {
  return (
    <div className="border-4 border-[#002040] bg-white p-10 shadow-[8px_8px_0px_#005060] text-center">
      <h2 className="text-3xl font-bold text-[#002040] mb-4">
        Application Submitted ✅
      </h2>

      <p className="mb-3 font-semibold">
        Your application is now timestamped on the blockchain.
      </p>

      <div className="border-2 border-[#002040] p-3 mb-6 font-mono text-sm break-all">
        TX: {txHash}
      </div>

      <button
        onClick={onDashboard}
        className="bg-[#007070] text-white font-bold py-3 px-6 border-4 border-[#002040] shadow-[4px_4px_0px_#005060] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
