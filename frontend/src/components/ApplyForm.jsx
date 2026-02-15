import { useState } from "react";

export default function ApplyForm({ onSubmit }) {
  const [listing, setListing] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ listing, message });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-4 border-[#002040] bg-white p-8 shadow-[8px_8px_0px_#005060] flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-[#002040]">Apply to Rental</h2>

      <input
        type="text"
        placeholder="Listing title or URL"
        value={listing}
        onChange={(e) => setListing(e.target.value)}
        required
        className="border-4 border-[#002040] p-3 font-semibold"
      />

      <textarea
        placeholder="Message to landlord..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-4 border-[#002040] p-3 font-semibold"
        rows={4}
      />

      <button
        type="submit"
        className="bg-[#0070B0] text-white font-bold py-3 border-4 border-[#002040] shadow-[4px_4px_0px_#005060] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
      >
        Apply with Rentinel
      </button>
    </form>
  );
}
