import { useState } from "react";
import { motion } from "framer-motion";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import ListingHero from "./ListingHero";
import { MOCK_LISTINGS } from "../data/listings";

const neobrutalShadow = "6px 6px 0 #005060";
const neobrutalBorder = "4px solid #002040";

const INCOME_RANGES = [
  "< ₹20,000",
  "₹20,000 – ₹40,000",
  "₹40,000 – ₹60,000",
  "₹60,000 – ₹1,00,000",
  "> ₹1,00,000",
  "Prefer not to say",
];

export default function ApplyFormFull({ onSubmit, isSubmitting }) {
  const currentAccount = useCurrentAccount();
  const [listingId, setListingId] = useState("1");
  const [message, setMessage] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [notes, setNotes] = useState("");
  const [hideSensitiveUntilResponse, setHideSensitiveUntilResponse] = useState(true);

  const listing = MOCK_LISTINGS.find((l) => l.id === listingId) || MOCK_LISTINGS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      listing: listing.fullTitle || listing.title,
      listingId: listing.id,
      landlord: listing.landlord,
      message,
      incomeRange,
      moveInDate,
      notes,
      hideSensitiveUntilResponse,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* 1. Listing selector (if multiple) */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#002040] mb-2">
          Select listing
        </label>
        <select
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
          className="w-full border-4 border-[#002040] p-3 bg-white font-medium text-[#002040]"
          style={{ boxShadow: "4px 4px 0 #005060" }}
        >
          {MOCK_LISTINGS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title} — {l.rent}
            </option>
          ))}
        </select>
      </div>

      {/* 1. Listing Hero */}
      <ListingHero listing={listing} />

      {/* 2. Protection Promise Banner */}
      <div
        className="mb-6 p-4 md:p-5 bg-[#007070] text-white"
        style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
      >
        <p className="font-bold text-lg flex items-center gap-2">
          <span aria-hidden>🛡</span> Your application is protected by Rentinel.
        </p>
        <ul className="mt-2 text-sm text-white/95 space-y-1">
          <li>• Timestamped on blockchain</li>
          <li>• Ghosting automatically detected</li>
          <li>• Evidence can be generated</li>
        </ul>
      </div>

      {/* 3. Smart Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className="p-6 bg-white"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">
            Application Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#002040] mb-1">
                Cover message
              </label>
              <textarea
                placeholder="Introduce yourself and why you're interested..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full border-4 border-[#002040] p-3 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#007070]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#002040] mb-1">
                Income range
              </label>
              <select
                value={incomeRange}
                onChange={(e) => setIncomeRange(e.target.value)}
                className="w-full border-4 border-[#002040] p-3 bg-white font-medium text-[#002040]"
              >
                <option value="">Select range</option>
                {INCOME_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#002040] mb-1">
                Preferred move-in date
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full border-4 border-[#002040] p-3 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#002040] mb-1">
                Optional notes
              </label>
              <textarea
                placeholder="Pets, flexibility, questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border-4 border-[#002040] p-3 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#007070]"
              />
            </div>

            {/* Privacy toggle */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={hideSensitiveUntilResponse}
                onChange={(e) => setHideSensitiveUntilResponse(e.target.checked)}
                className="mt-1 w-4 h-4 border-2 border-[#002040] text-[#007070] focus:ring-[#007070]"
              />
              <span className="text-sm text-[#002040]/90 group-hover:text-[#002040]">
                <strong>Hide sensitive details until landlord responds.</strong>{" "}
                Rentinel will only reveal income and notes after the landlord
                initiates contact — tenant dignity first.
              </span>
            </label>
          </div>
        </div>

        {/* 4. Transparency Timeline */}
        <div
          className="p-6 bg-white"
          style={{ border: neobrutalBorder, boxShadow: neobrutalShadow }}
        >
          <h2 className="text-xl font-bold text-[#002040] mb-4">
            What happens next?
          </h2>
          <ol className="space-y-3 text-[#002040]">
            <li className="flex gap-3">
              <span className="font-bold text-[#007070] shrink-0">1.</span>
              <span>Application timestamped on Sui blockchain</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#007070] shrink-0">2.</span>
              <span>Landlord notified</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#007070] shrink-0">3.</span>
              <span>48-hour response window tracked</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#007070] shrink-0">4.</span>
              <span>Evidence generated if ignored</span>
            </li>
          </ol>
        </div>

        {/* 5. Blockchain Proof Preview */}
        <div
          className="p-6 bg-[#F0F0F0] border-4 border-[#002040]"
          style={{ boxShadow: neobrutalShadow }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#007070] text-white text-xs font-bold mb-3">
            ⛓ REAL BLOCKCHAIN
          </div>
          <h2 className="text-lg font-bold text-[#002040] mb-3">
            Your application will receive:
          </h2>
          <ul className="space-y-1 text-sm text-[#002040]/90">
            <li>• Immutable timestamp</li>
            <li>• Transaction hash (Sui blockchain)</li>
            <li>• Tamper-proof record</li>
          </ul>
          <p className="mt-3 text-xs text-[#007070] font-medium">
            Signed with your Sui wallet — real cryptographic proof.
          </p>
        </div>

        {/* 6. Discrimination Note */}
        <p className="text-sm text-[#002040]/70 italic text-center px-4">
          Silent rejection is a common form of housing discrimination. Rentinel
          makes silence measurable.
        </p>

        {/* 7. Wallet + CTA */}
        <div className="space-y-4">
          {!currentAccount ? (
            <div
              className="p-4 bg-amber-50 border-4 border-amber-600 text-amber-900 text-center"
              style={{ boxShadow: "4px 4px 0 #92400e" }}
            >
              <p className="font-bold mb-3">
                Connect your Sui wallet to create protected applications
              </p>
              <div className="flex justify-center">
                <ConnectButton connectText="Connect Sui Wallet" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#007070] text-center">
              Connected: {currentAccount.address.slice(0, 8)}…
              {currentAccount.address.slice(-6)}
            </p>
          )}

          <button
            type="submit"
            disabled={!currentAccount || isSubmitting}
            className="w-full py-4 bg-[#007070] text-white font-bold text-lg border-4 border-[#002040] disabled:opacity-60 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
            style={{ boxShadow: "6px 6px 0 #005060" }}
          >
            {isSubmitting ? "Signing…" : "Apply with Protection"}
          </button>
          <p className="text-center text-sm text-[#002040]/70">
            Takes 3 seconds. Creates permanent proof.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
