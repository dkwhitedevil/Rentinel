import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ApplicationCard from "../components/ApplicationCard";
import EvidenceModal from "../components/EvidenceModal";
import LiveActivityFeed from "../components/realtime/LiveActivityFeed";
import useLiveApplications from "../components/realtime/useLiveApplications";
import { generateEvidencePDF } from "../utils/generateEvidencePDF";

const neobrutalShadow = "6px 6px 0 #005060";
const neobrutalBorder = "4px solid #002040";

/* Mock data - merge with localStorage applications for rich demo */
/* Pending app uses recent timestamp so GhostTimer countdown is visible (1h ago) */
const getMockApplications = () => [
  {
    id: "1",
    listing: "2BR Apt on Oak Street — $1,850/mo",
    message: "Hi, I'm very interested. Stable income, excellent references.",
    txHash: "0x7a3f92b1c4e5d6a8",
    status: "ghosted",
    createdAt: "2025-02-10T14:30:00Z",
    appliedAt: "2025-02-10T14:30:00Z",
    openedAt: "2025-02-10T14:35:00Z",
    respondedAt: null,
    daysSilent: 5,
  },
  {
    id: "2",
    listing: "Cozy Studio Downtown",
    message: "Flexible move-in date. Pet-free tenant.",
    txHash: "0x9b2c8d4e1a7f3b0",
    status: "pending",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    appliedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    openedAt: new Date(Date.now() - 59 * 60 * 1000).toISOString(),
    respondedAt: null,
  },
  {
    id: "3",
    listing: "3BR House — West Side",
    message: "Family of 4. Long-term lease preferred.",
    txHash: "0x4e8a1c9f2b7d305",
    status: "responded",
    createdAt: "2025-02-08T11:00:00Z",
    appliedAt: "2025-02-08T11:00:00Z",
    openedAt: "2025-02-08T11:05:00Z",
    respondedAt: "2025-02-09T16:22:00Z",
  },
];

const MOCK_EVIDENCE_RECORDS = [
  { id: "e1", title: "Oak Street Apt — Ghosting Report", date: "2025-02-15", caseRef: "RTL-2025-0147" },
  { id: "e2", title: "Maple Ave LLC — Non-Response Evidence", date: "2025-01-28", caseRef: "RTL-2025-0089" },
];

const MOCK_METRICS = {
  responseRate: 33,
  ghostingIncidents: 2,
  evidenceReports: 2,
};

export default function TenantDashboard() {
  const storedApps = JSON.parse(localStorage.getItem("rentinel_applications") || "[]");
  const initialApplications = useMemo(
    () =>
      [
        ...storedApps.map((a, i) => ({
          id: `stored-${i}`,
          listing: a.listing,
          message: a.message,
          txHash: a.txHash,
          status: a.status || "pending",
          createdAt: a.createdAt || new Date().toISOString(),
          appliedAt: a.createdAt || new Date().toISOString(),
          openedAt: a.createdAt || new Date().toISOString(),
          respondedAt: null,
        })),
        ...getMockApplications(),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    []
  );

  const { apps: applications, setApps: setApplications, events, addEvent } = useLiveApplications(initialApplications);
  const [evidenceApp, setEvidenceApp] = useState(null);

  const updateStatus = (id, status) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === "ghosted") {
      addEvent("Application marked as ghosted — no response after 48h");
    }
  };

  const handleEvidence = (app) => {
    setEvidenceApp(app);
  };

  const handleEvidenceVaultDownload = (rec) => {
    const keyPhrase = rec.title.split("—")[0].trim().toLowerCase().split(" ").slice(0, 2).join(" ");
    const match = applications.find(
      (a) => a.status === "ghosted" && keyPhrase && a.listing.toLowerCase().includes(keyPhrase)
    );
    const app = match
      ? { ...match, caseRef: rec.caseRef }
      : {
          listing: rec.title,
          title: rec.title,
          status: "ghosted",
          appliedAt: rec.date,
          createdAt: rec.date,
          openedAt: rec.date,
          caseRef: rec.caseRef,
          txHash: `Case ${rec.caseRef}`,
        };
    try {
      generateEvidencePDF(app);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const ghostedCases = applications.filter((a) => a.status === "ghosted");
  const hasGhosted = ghostedCases.length > 0;
  const evidenceRecords = MOCK_EVIDENCE_RECORDS;

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <EvidenceModal app={evidenceApp} onClose={() => setEvidenceApp(null)} />

      {/* Nav */}
      <nav className="bg-white sticky top-0 z-50" style={{ borderBottom: neobrutalBorder }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#002040]">
            Rentinel
          </Link>
          <div className="flex gap-3">
            <Link
              to="/apply"
              className="bg-[#007070] text-white font-bold py-2 px-4 border-4 border-[#002040] hover:-translate-y-0.5 transition"
              style={{ boxShadow: neobrutalShadow }}
            >
              + New Application
            </Link>
           
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Live Activity Feed */}
        <LiveActivityFeed events={events} />

        {/* 1. Protection Header */}
        <section
          className="bg-white p-6 md:p-8"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#002040] mb-2">
            You&apos;re protected by Rentinel.
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold text-[#002040]">
              Monitoring landlord responses
            </span>
          </div>
          <p className="text-[#002040]/70 text-sm">
            All interactions are timestamped and tamper-proof.
          </p>
        </section>

        {/* 2. Ghost Alert Center - only when ghosted cases exist */}
        {hasGhosted && (
          <section
            className="bg-amber-50 p-6 border-4 border-amber-600"
            style={{ boxShadow: neobrutalShadow }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#002040] mb-1">
                  Silent rejection detected
                </h2>
                <p className="text-[#002040]/80 mb-4">
                  {ghostedCases.length} landlord{ghostedCases.length > 1 ? "s have" : " has"} not
                  responded. You may generate legal evidence.
                </p>
                <button
                  onClick={() => setEvidenceApp(ghostedCases[0])}
                  className="bg-[#007070] text-white font-bold py-3 px-6 border-4 border-[#002040] hover:-translate-y-0.5 transition animate-pulse"
                  style={{ boxShadow: neobrutalShadow }}
                >
                  Create Evidence Report
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Justice Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Response Transparency Score",
              value: `${MOCK_METRICS.responseRate}%`,
              sub: "landlords replied to you",
            },
            {
              label: "Ghosting Incidents Detected",
              value: MOCK_METRICS.ghostingIncidents,
              sub: "no response after 48h",
            },
            {
              label: "Evidence Reports Generated",
              value: MOCK_METRICS.evidenceReports,
              sub: "court-ready documents",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-white p-5"
              style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
            >
              <p className="text-2xl font-bold text-[#007070] mb-1">{metric.value}</p>
              <p className="text-sm font-semibold text-[#002040]">{metric.label}</p>
              <p className="text-xs text-[#002040]/70">{metric.sub}</p>
            </div>
          ))}
        </section>

        {/* 4. Application Timeline */}
        <section>
          <h2 className="text-xl font-bold text-[#002040] mb-4">Application Timeline</h2>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div
                className="bg-white p-8 text-center"
                style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
              >
                <p className="text-[#002040]/70 mb-4">No applications yet.</p>
                <Link to="/apply" className="text-[#007070] font-semibold hover:underline">
                  Submit your first application →
                </Link>
              </div>
            ) : (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  updateStatus={updateStatus}
                  onEvidence={handleEvidence}
                />
              ))
            )}
          </div>
        </section>

        {/* 5. Evidence Vault */}
        <section>
          <h2 className="text-xl font-bold text-[#002040] mb-4">Your Evidence Records</h2>
          <div
            className="bg-white p-6"
            style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
          >
            {evidenceRecords.length === 0 ? (
              <p className="text-[#002040]/70 text-center py-4">
                No evidence reports yet. Generate one when a landlord goes silent.
              </p>
            ) : (
              <div className="space-y-3">
                {evidenceRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between py-3 border-b-2 border-[#002040]/20 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-[#002040]">{rec.title}</p>
                      <p className="text-xs text-[#002040]/70">
                        {rec.date} • {rec.caseRef}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEvidenceVaultDownload(rec)}
                      className="bg-[#007070] text-white font-bold py-2 px-4 border-2 border-[#002040] hover:-translate-y-0.5 transition text-sm"
                      style={{ boxShadow: "4px 4px 0 #005060" }}
                    >
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. Fair Housing Help */}
        <section>
          <h2 className="text-xl font-bold text-[#002040] mb-4">Need Help?</h2>
          <div
            className="bg-white p-6"
            style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
          >
            <p className="text-[#002040]/80 mb-4">
              Take action with your evidence. These options connect you to real resources.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "📩", label: "Share with Legal Aid", desc: "Send evidence to housing attorneys" },
                { icon: "🏛", label: "File Housing Complaint Draft", desc: "Prepare HUD/Fair Housing complaint" },
                { icon: "📄", label: "Export Evidence Bundle", desc: "Download all records as ZIP" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="text-left p-4 border-4 border-[#002040] bg-white hover:bg-[#F0F0F0] transition text-[#002040]"
                  style={{ boxShadow: "4px 4px 0 #005060" }}
                >
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <p className="font-bold">{item.label}</p>
                  <p className="text-xs text-[#002040]/70">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <Link to="/" className="inline-block text-sm text-[#007070] hover:underline pb-8">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
