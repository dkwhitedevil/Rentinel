import { motion } from "framer-motion";

const neobrutalShadow = "8px 8px 0 #005060";
const neobrutalBorder = "4px solid #002040";

export default function ApplySuccessCinematic({ txHash, proofNote, onDashboard }) {
  const explorerUrl =
    txHash && txHash.length > 20 && !txHash.includes(" ")
      ? `https://suiscan.xyz/testnet/tx/${txHash}`
      : null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div
        className="bg-white p-8 md:p-10"
        style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-4xl bg-[#007070] text-white border-4 border-[#002040]"
        >
          ✓
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold text-[#002040] mb-3">
          Application Protected
        </h2>
        <p className="text-[#002040]/80 mb-6">
          Your application is timestamped with blockchain proof. Sentinel will
          monitor landlord response.
        </p>

        <div
          className="p-4 mb-6 text-left bg-[#F0F0F0] border-2 border-[#002040]"
          style={{ boxShadow: "4px 4px 0 #005060" }}
        >
          <p className="text-xs font-bold text-[#002040]/70 mb-1">
            SUI BLOCKCHAIN PROOF
          </p>
          <p className="font-mono text-sm break-all text-[#002040]">
            {txHash}
          </p>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xs text-[#007070] font-semibold hover:underline"
            >
              View on Sui Explorer →
            </a>
          )}
          {proofNote && !explorerUrl && (
            <p className="mt-2 text-xs text-[#007070]">{proofNote}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onDashboard}
          className="w-full py-4 bg-[#007070] text-white font-bold text-lg border-4 border-[#002040] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
          style={{ boxShadow: "6px 6px 0 #005060" }}
        >
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}
