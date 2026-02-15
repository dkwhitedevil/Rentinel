import { useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { getApplicationEvidence } from "../lib/getApplicationEvidence";
import { generateEvidencePDF } from "../utils/generateEvidencePDF";
import { generateRealEvidencePDF } from "../utils/generateRealEvidencePDF";

const neobrutalShadow = "8px 8px 0px #005060";

export default function EvidenceModal({ app, onClose }) {
  const client = useSuiClient();
  const [loading, setLoading] = useState(false);

  if (!app) return null;

  const hasOnChainData = app.objectId && (app.txHash || app.txDigest);

  const handleDownload = async () => {
    try {
      setLoading(true);
      if (hasOnChainData && client) {
        const evidence = await getApplicationEvidence(client, app.objectId);
        const txDigest = app.txDigest ?? app.txHash;
        generateRealEvidencePDF(evidence, txDigest);
      } else {
        generateEvidencePDF(app);
      }
      onClose();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(err?.message || "Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-[#002040] p-8 max-w-lg w-full"
        style={{ boxShadow: neobrutalShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#002040] mb-4">
          Evidence Report Ready
        </h2>

        <p className="mb-2 font-semibold text-[#002040]">
          Rentinel has compiled a verifiable interaction history for this case.
        </p>

        <p className="mb-6 text-sm text-[#002040]/80">
          {hasOnChainData
            ? "The PDF will fetch live on-chain data: status, timestamps, tenant, landlord — court-ready documentation."
            : "The PDF includes your timeline, ghost detection proof, and blockchain transaction hash — court-ready documentation."}
        </p>

        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-[#007070] text-white font-bold py-3 border-4 border-[#002040] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition mb-3 disabled:opacity-70"
          style={{ boxShadow: "4px 4px 0px #005060" }}
        >
          {loading ? "Fetching on-chain data…" : hasOnChainData ? "Download Real On-Chain Evidence PDF" : "Download Legal Evidence PDF"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full border-4 border-[#002040] py-2 font-bold bg-white hover:bg-[#F0F0F0] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
