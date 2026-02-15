import ResponseTimer from "../realtime/ResponseTimer";
import { STATUS_LABEL } from "../../lib/statusMap";

const neobrutalShadow = "6px 6px 0px #005060";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tenantInitials(tenant) {
  if (!tenant || typeof tenant !== "string") return "??";
  if (tenant.length < 12) return tenant.slice(0, 6) + "…";
  return `${tenant.slice(0, 6)}…${tenant.slice(-4)}`;
}

function statusColor(status) {
  if (typeof status === "string") {
    const m = { pending: "bg-amber-100 text-amber-800", accepted: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800", ghosted: "bg-purple-100 text-purple-800", responded: "bg-green-100 text-green-800" };
    return m[status] ?? "bg-gray-100 text-gray-800";
  }
  const m = { 0: "bg-amber-100 text-amber-800", 1: "bg-green-100 text-green-800", 2: "bg-red-100 text-red-800", 3: "bg-purple-100 text-purple-800" };
  return m[status] ?? "bg-gray-100 text-gray-800";
}

function statusText(status) {
  if (typeof status === "string") return status.charAt(0).toUpperCase() + status.slice(1);
  return STATUS_LABEL[status] ?? "Unknown";
}

export default function LandlordApplicationCard({
  app,
  onAccept,
  onReject,
  onGhost,
  loading,
}) {
  const status = app.status ?? "pending";
  const appliedAt = app.appliedAt || app.createdAt;
  const isPending = status === "pending" || status === 0;
  const tenantAddr = app.tenant || app.signedBy || "0x???";
  const displayStatus = typeof status === "number" ? STATUS_LABEL[status] : status;

  return (
    <div
      className="border-4 border-[#002040] bg-white p-6 flex flex-col gap-4"
      style={{ boxShadow: neobrutalShadow }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#002040]">{app.listing}</h3>
          <p className="text-xs text-[#002040]/70 mt-1 font-mono">
            Tenant: {tenantInitials(tenantAddr)}
          </p>
        </div>
        <span
          className={`shrink-0 px-3 py-1 rounded font-bold text-sm border-2 border-[#002040] ${statusColor(status)}`}
        >
          {displayStatus}
        </span>
      </div>

      {app.message && (
        <p className="text-sm text-[#002040]/80 line-clamp-2">{app.message}</p>
      )}

      <p className="text-xs text-[#002040]/70">Applied → {formatDate(appliedAt)}</p>

      {isPending && (
        <ResponseTimer
          appliedAt={appliedAt}
          status="pending"
          onGhost={() => onGhost?.(app)}
        />
      )}

      {isPending && (
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => onAccept(app)}
            disabled={!!loading}
            className="bg-green-600 text-white font-bold py-2 px-4 border-4 border-[#002040] disabled:opacity-50 hover:-translate-y-0.5 transition"
            style={{ boxShadow: "4px 4px 0 #005060" }}
          >
            {loading === "accept" ? "…" : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => onReject(app)}
            disabled={!!loading}
            className="bg-red-600 text-white font-bold py-2 px-4 border-4 border-[#002040] disabled:opacity-50 hover:-translate-y-0.5 transition"
            style={{ boxShadow: "4px 4px 0 #005060" }}
          >
            {loading === "reject" ? "…" : "Reject"}
          </button>
          <button
            type="button"
            onClick={() => onGhost(app)}
            disabled={!!loading}
            className="bg-purple-600 text-white font-bold py-2 px-4 border-4 border-[#002040] disabled:opacity-50 hover:-translate-y-0.5 transition"
            style={{ boxShadow: "4px 4px 0 #005060" }}
          >
            {loading === "ghost" ? "…" : "Mark Ghosted"}
          </button>
        </div>
      )}

      {app.objectId && (
        <p className="font-mono text-xs text-[#007070] break-all">
          Object: {app.objectId.slice(0, 16)}…
        </p>
      )}
    </div>
  );
}
