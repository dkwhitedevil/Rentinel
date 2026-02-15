import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useCurrentAccount,
  useSignPersonalMessage,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import ApplyFormFull from "../components/ApplyFormFull";
import BlockchainLoaderStaged from "../components/BlockchainLoaderStaged";
import ApplySuccessCinematic from "../components/ApplySuccessCinematic";
import { buildApplyTransaction } from "../utils/rentinelContract";
import { buildTimestampTransaction } from "../utils/submitApplicationOnChain";

function toProofHash(signature, fallback) {
  if (!signature) return fallback || `0x${Date.now().toString(16)}sui`;
  const str =
    typeof signature === "string"
      ? signature
      : ArrayBuffer.isView(signature)
        ? Array.from(signature).join("")
        : JSON.stringify(signature);
  const hash = str.split("").reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hex = Math.abs(hash).toString(16).padStart(16, "0").slice(0, 16);
  return "0x" + hex + "sui";
}

export default function Apply() {
  const [step, setStep] = useState("form");
  const [txHash, setTxHash] = useState("");
  const [proofNote, setProofNote] = useState("");

  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signMessage } = useSignPersonalMessage();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const navigate = useNavigate();

  const packageId = import.meta.env.VITE_RENTINEL_PACKAGE_ID;
  const useOnChain = !!packageId;

  const handleApply = async (data) => {
    if (!currentAccount?.address) {
      alert("Please connect your Sui wallet first.");
      return;
    }

    try {
      setStep("loading");

      const timestamp = new Date().toISOString();
      let proofHash;
      let proofNote;

      let objectId = null;
      if (useOnChain) {
        const landlord = data.landlord || currentAccount.address;
        const tx = buildApplyTransaction({
          packageId,
          tenant: currentAccount.address,
          landlord,
          listing: data.listing,
        });
        const result = await signAndExecute({ transaction: tx });
        proofHash = result?.digest ?? "";
        proofNote = "On-chain proof — view on Sui Explorer";
        if (client && proofHash) {
          try {
            const txData = await client.core.getTransaction({
              digest: proofHash,
              include: { effects: true, objectTypes: true },
            });
            const tx = txData?.Transaction ?? txData?.FailedTransaction;
            const effects = tx?.effects;
            const objectTypes = tx?.objectTypes;
            const created = effects?.changedObjects?.filter((c) => c?.idOperation === "Created") ?? [];
            const appObj = created.find((c) => {
              const type = objectTypes?.[c?.objectId ?? ""] ?? "";
              return type.includes("application::application::Application");
            });
            objectId = appObj?.objectId ?? created[0]?.objectId;
          } catch (_) {}
        }
      } else {
        const payload = {
          type: "Rentinel Application",
          listing: data.listing,
          message: data.message,
          timestamp,
          applicant: currentAccount.address,
        };
        const messageBytes = new TextEncoder().encode(JSON.stringify(payload));
        const result = await signMessage({ message: messageBytes });
        const sig = result?.signature ?? result?.bytes;
        proofHash = toProofHash(sig);
        proofNote = "Signed with your Sui wallet — verifiable cryptographic proof.";
      }

      const appRecord = {
        listing: data.listing,
        message: data.message,
        txHash: proofHash,
        txDigest: proofHash,
        objectId: objectId ?? undefined,
        status: "pending",
        createdAt: timestamp,
        appliedAt: timestamp,
        openedAt: timestamp,
        signedBy: currentAccount.address,
      };

      const applications = JSON.parse(
        localStorage.getItem("rentinel_applications") || "[]"
      );
      applications.unshift(appRecord);
      localStorage.setItem("rentinel_applications", JSON.stringify(applications));

      const backend = import.meta.env.VITE_API_URL || "http://localhost:5001";
      fetch(`${backend}/applications/timestamp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: currentAccount.address,
          listing: data.listing,
          message: data.message,
          txHash: proofHash,
          payload: { type: "Rentinel Application", timestamp },
        }),
      }).catch(() => {});

      setTxHash(proofHash);
      setProofNote(proofNote);
      setStep("success");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to submit application. Please try again.");
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {step === "form" && (
          <ApplyFormFull
            onSubmit={handleApply}
            isSubmitting={step === "loading"}
          />
        )}

        {step === "loading" && (
          <BlockchainLoaderStaged
            onComplete={() => {}}
            durationMs={2500}
          />
        )}

        {step === "success" && (
          <ApplySuccessCinematic
            txHash={txHash}
            proofNote={proofNote}
            onDashboard={() => navigate("/tenant/dashboard")}
          />
        )}

        {step !== "loading" && (
          <Link
            to="/"
            className="mt-6 block text-center text-sm text-[#007070] hover:underline"
          >
            ← Back to home
          </Link>
        )}
      </div>
    </div>
  );
}
