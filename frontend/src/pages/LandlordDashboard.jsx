import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import {
  buildAcceptTransaction,
  buildRejectTransaction,
  buildMarkGhostedTransaction,
} from "../utils/rentinelContract";
import { DEMO_LANDLORD, MOCK_LISTINGS } from "../data/listings";
import LandlordApplicationCard from "../components/landlord/LandlordApplicationCard";

const neobrutalShadow = "6px 6px 0 #005060";
const neobrutalBorder = "4px solid #002040";

const GHOST_LIMIT_HOURS = 48;

/* Mock applications for landlord dashboard demo */
function getMockLandlordApplications(landlordAddr) {
  const base = landlordAddr || DEMO_LANDLORD;
  return [
    {
      id: "m1",
      listing: "2BHK • Chennai • ₹18,000/month",
      message: "Stable income, excellent references. Pet-free.",
      tenant: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      landlord: base,
      status: "pending",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      appliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      objectId: null,
    },
    {
      id: "m2",
      listing: "Cozy Studio Downtown",
      message: "Flexible move-in. Long-term lease preferred.",
      tenant: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      landlord: base,
      status: "pending",
      createdAt: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString(),
      appliedAt: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString(),
      objectId: null,
    },
    {
      id: "m3",
      listing: "3BR House — West Side",
      message: "Family of 4. Need by March.",
      tenant: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      landlord: base,
      status: "accepted",
      createdAt: "2025-02-08T11:00:00Z",
      appliedAt: "2025-02-08T11:00:00Z",
      respondedAt: "2025-02-09T16:22:00Z",
    },
    {
      id: "m4",
      listing: "2BHK • Chennai • ₹18,000/month",
      message: "Sorry, not a fit for our timeline.",
      tenant: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      landlord: base,
      status: "rejected",
      createdAt: "2025-02-07T09:00:00Z",
      appliedAt: "2025-02-07T09:00:00Z",
      respondedAt: "2025-02-07T14:30:00Z",
    },
    {
      id: "m5",
      listing: "Cozy Studio Downtown",
      message: "Very interested! Available immediately.",
      tenant: "0x5e6f7890abcdef1234567890abcdef1234567890",
      landlord: base,
      status: "ghosted",
      createdAt: "2025-02-05T08:00:00Z",
      appliedAt: "2025-02-05T08:00:00Z",
      respondedAt: null,
    },
  ];
}

export default function LandlordDashboard() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const landlordAddr = currentAccount?.address ?? DEMO_LANDLORD;
  const packageId = import.meta.env.VITE_RENTINEL_PACKAGE_ID;
  const canActOnChain = !!packageId;

  const allApplications = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem("rentinel_applications") || "[]");
    const forLandlord = stored.filter((a) => (a.landlord || DEMO_LANDLORD) === landlordAddr);
    const merged = [
      ...forLandlord.map((a, i) => ({
        ...a,
        id: a.objectId || `stored-${i}`,
        appliedAt: a.appliedAt || a.createdAt,
      })),
      ...getMockLandlordApplications(landlordAddr),
    ];
    return merged.sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));
  }, [landlordAddr]);

  const [applications, setApplications] = useState([]);
  useEffect(() => {
    setApplications(allApplications);
  }, [allApplications]);

  const effectiveApps = applications.length > 0 ? applications : allApplications;
  const pendingApps = effectiveApps.filter((a) => (a.status || a.status === 0) === "pending" || a.status === 0);
  const nearGhostLimit = pendingApps.filter((a) => {
    const applied = new Date(a.appliedAt || a.createdAt).getTime();
    const hoursLeft = (GHOST_LIMIT_HOURS * 60 * 60 * 1000 - (Date.now() - applied)) / (60 * 60 * 1000);
    return hoursLeft > 0 && hoursLeft < 12;
  });

  const acceptedCount = effectiveApps.filter((a) => a.status === "accepted" || a.status === 1).length;
  const rejectedCount = effectiveApps.filter((a) => a.status === "rejected" || a.status === 2).length;
  const ghostedCount = effectiveApps.filter((a) => a.status === "ghosted" || a.status === 3).length;
  const respondedCount = acceptedCount + rejectedCount;
  const totalWithOutcome = respondedCount + ghostedCount;
  const responseRate = totalWithOutcome > 0 ? Math.round((respondedCount / totalWithOutcome) * 100) : 85;
  const ghostRate = totalWithOutcome > 0 ? Math.round((ghostedCount / totalWithOutcome) * 100) : 10;
  const trustScore = Math.max(0, Math.min(100, 100 - ghostRate * 5 - (100 - responseRate) * 0.3));
  const trustColor = trustScore >= 70 ? "text-green-600" : trustScore >= 40 ? "text-amber-600" : "text-red-600";

  const handleAction = async (action, app) => {
    const appId = app?.objectId?.trim?.();
    if (canActOnChain && appId && !currentAccount?.address) {
      setError("Connect your wallet first.");
      return;
    }
    try {
      setError("");
      setLoading(action);

      if (canActOnChain && appId) {
        let tx;
        if (action === "accept") tx = buildAcceptTransaction({ packageId, appId });
        else if (action === "reject") tx = buildRejectTransaction({ packageId, appId });
        else if (action === "ghost") tx = buildMarkGhostedTransaction({ packageId, appId });
        if (tx) {
          await signAndExecute({ transaction: tx });
        }
      }

      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, status: action === "accept" ? "accepted" : action === "reject" ? "rejected" : "ghosted" }
            : a
        )
      );
    } catch (err) {
      setError(err?.message || `Failed to ${action}`);
    } finally {
      setLoading("");
    }
  };

  const landlordName = currentAccount?.address
    ? `${currentAccount.address.slice(0, 6)}…${currentAccount.address.slice(-4)}`
    : "Landlord";

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <nav className="bg-white sticky top-0 z-50" style={{ borderBottom: neobrutalBorder }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#002040]">
            Rentinel
          </Link>
          <div className="flex gap-3">
            <ConnectButton connectText="Connect Sui Wallet" />
            <Link
              to="/tenant/dashboard"
              className="border-4 border-[#002040] py-2 px-4 font-bold text-[#002040] hover:bg-[#F0F0F0] transition"
              style={{ boxShadow: "4px 4px 0 #005060" }}
            >
              Tenant View
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 1. Responsibility Header + Trust Score */}
        <section
          className="bg-white p-6 md:p-8"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#002040] mb-2">
            You are part of a transparent rental system.
          </h1>
          <p className="text-[#002040]/80 mb-4">Hello, {landlordName}.</p>
          <p className="text-sm text-[#002040]/70 mb-4">
            Your responses are timestamped and visible to tenants.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#002040] text-white font-bold">
            <span>Trust Score</span>
            <span className={`text-2xl ${trustColor}`}>{Math.round(trustScore)}</span>
            <span className="text-sm opacity-90">/ 100</span>
          </div>
        </section>

        {/* 2. Trust Score Overview Panel */}
        <section
          className="bg-white p-6"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">Trust Score Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 border-4 border-[#002040]">
              <p className="text-2xl font-bold text-[#007070]">{responseRate}%</p>
              <p className="text-sm font-semibold text-[#002040]">Response rate</p>
            </div>
            <div className="p-4 border-4 border-[#002040]">
              <p className="text-2xl font-bold text-[#007070]">{ghostRate}%</p>
              <p className="text-sm font-semibold text-[#002040]">Ghosting rate</p>
            </div>
            <div className="p-4 border-4 border-[#002040]">
              <p className="text-2xl font-bold text-[#007070]">~4h</p>
              <p className="text-sm font-semibold text-[#002040]">Avg response time</p>
            </div>
          </div>
          <p className="text-sm text-[#002040]/80 italic">
            Responding within 24h increases tenant trust.
          </p>
        </section>

        {/* 3. Real-Time Accountability Warning */}
        {nearGhostLimit.length > 0 && (
          <section
            className="bg-amber-50 p-6 border-4 border-amber-600"
            style={{ boxShadow: neobrutalShadow }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-bold text-[#002040]">
                  Pending responses that may affect your score
                </h2>
                <p className="text-sm text-[#002040]/80">
                  {nearGhostLimit.length} application{nearGhostLimit.length !== 1 ? "s" : ""} nearing
                  the 48h ghost limit.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 4. Incoming Applications Queue */}
        <section>
          <h2 className="text-xl font-bold text-[#002040] mb-4">Incoming Applications</h2>
          {error && (
            <p className="mb-4 text-sm text-red-600 font-medium bg-red-50 p-3 border-2 border-red-200">
              {error}
            </p>
          )}
          {effectiveApps.length === 0 ? (
            <div
              className="bg-white p-8 text-center"
              style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
            >
              <p className="text-[#002040]/70">No applications yet.</p>
              <p className="text-sm text-[#002040]/60 mt-2">
                When tenants apply to your listings, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {effectiveApps.map((app) => (
                <LandlordApplicationCard
                  key={app.id}
                  app={app}
                  onAccept={(a) => handleAction("accept", a)}
                  onReject={(a) => handleAction("reject", a)}
                  onGhost={(a) => handleAction("ghost", a)}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. Decision History Timeline */}
        <section
          className="bg-white p-6"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">Decision History</h2>
          <p className="text-sm text-[#002040]/70 mb-4">
            The system remembers your behavior. Past decisions are shown above.
          </p>
          <div className="space-y-2">
            {effectiveApps
              .filter((a) => a.status !== "pending" && a.status !== 0)
              .slice(0, 5)
              .map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-2 border-b-2 border-[#002040]/10 last:border-0"
                >
                  <span className="font-medium text-[#002040] truncate max-w-[200px]">
                    {app.listing}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      app.status === "accepted" || app.status === 1
                        ? "bg-green-100"
                        : app.status === "rejected" || app.status === 2
                          ? "bg-red-100"
                          : "bg-purple-100"
                    }`}
                  >
                    {app.status === "accepted" || app.status === 1
                      ? "Accepted"
                      : app.status === "rejected" || app.status === 2
                        ? "Rejected"
                        : "Ghosted"}
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* 6. Trust Score Impact Simulator */}
        <section
          className="bg-white p-6"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">How to improve your score</h2>
          <ul className="space-y-2 text-sm text-[#002040]/90">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">+5</span>
              Respond to pending applications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">+8</span>
              Avoid ghosting this week
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">+3</span>
              Maintain &lt;10% rejection inconsistency
            </li>
          </ul>
        </section>

        {/* 7. Listings Management */}
        <section
          className="bg-white p-6"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">Your Listings</h2>
          <div className="space-y-3">
            {MOCK_LISTINGS.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-4 border-4 border-[#002040]"
              >
                <div>
                  <p className="font-bold text-[#002040]">{l.title}</p>
                  <p className="text-sm text-[#002040]/70">{l.rent} • {l.location}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 font-bold text-xs">
                  Active
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 w-full py-3 border-4 border-[#002040] font-bold text-[#002040] hover:bg-[#F0F0F0] transition"
            style={{ boxShadow: "4px 4px 0 #005060" }}
          >
            + Add New Listing
          </button>
        </section>

        {/* 8. Transparency Education Panel */}
        <section
          className="bg-[#007070] text-white p-6 md:p-8"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold mb-4">Why transparency matters</h2>
          <p className="text-white/95 max-w-2xl">
            Unanswered applications contribute to invisible housing discrimination. Sentinel helps
            create fair, measurable rental interactions.
          </p>
        </section>

        <Link to="/" className="inline-block text-sm text-[#007070] hover:underline pb-8">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
