import LiveStatusBadge from "./realtime/LiveStatusBadge";
import ResponseTimer from "./realtime/ResponseTimer";
import GhostBadge from "./GhostBadge";
import EvidenceGlowButton from "./EvidenceGlowButton";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ApplicationCard({ app, updateStatus, onEvidence }) {
  const status = app.status || "pending";
  const appliedAt = app.appliedAt || app.createdAt;

  return (
    <div
      className="border-4 border-[#002040] bg-white p-6 flex flex-col gap-3"
      style={{ boxShadow: "6px 6px 0px #005060" }}
    >
      {/* Listing */}
      <h3 className="text-xl font-bold text-[#002040]">{app.listing}</h3>

      {app.message && (
        <p className="text-[#002040]/80 text-sm">{app.message}</p>
      )}

      {/* Timeline info */}
      <p className="text-xs text-[#002040]/70">✓ Applied → {formatDate(appliedAt)}</p>
      {app.openedAt && (
        <p className="text-xs text-[#002040]/70">✓ Opened → {formatDate(app.openedAt)}</p>
      )}

      {/* Live Status Badge */}
      <LiveStatusBadge status={status} />

      {/* Response Timer - only for pending */}
      {updateStatus && (
        <ResponseTimer
          appliedAt={appliedAt}
          status={status}
          onGhost={() => updateStatus(app.id, "ghosted")}
        />
      )}

      {status === "responded" && app.respondedAt && (
        <p className="text-xs text-green-700 font-semibold">
          ✓ Responded → {formatDate(app.respondedAt)}
        </p>
      )}

      {status === "ghosted" && (
        <>
          <p className="text-sm text-red-700 font-semibold">
            ✗ No response after 48h — silence is now evidence
          </p>
          <EvidenceGlowButton onClick={() => onEvidence?.({ ...app, status: "ghosted" })} />
        </>
      )}

      <p className="font-mono text-xs text-[#007070] break-all mt-1">
        TX: {app.txHash}
      </p>
    </div>
  );
}
