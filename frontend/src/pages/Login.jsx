import { useState } from "react";
import { useCurrentAccount, useSignPersonalMessage, useSuiClientContext } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigate, Link } from "react-router-dom";

const neobrutalShadow = "6px 6px 0 var(--color-sentinel-shadow)";
const neobrutalBorder = "4px solid var(--color-sentinel-navy)";

export default function Login() {
  const currentAccount = useCurrentAccount();
  const { network } = useSuiClientContext();
  const { mutateAsync: signMessage } = useSignPersonalMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const handleLogin = async (role) => {
    try {
      setLoading(true);
      setError("");

      if (!currentAccount?.address) {
        setError("Please connect your wallet first.");
        return;
      }

      const wallet = currentAccount.address;

      /* 1. Get nonce */
      const nonceRes = await fetch(`${backend}/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      if (!nonceRes.ok) {
        const err = await nonceRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to get nonce");
      }

      const { nonce } = await nonceRes.json();

      /* 2. Sign message (must match backend exactly) */
      const message = `Login to Sentinel. Nonce: ${nonce}`;

      const result = await signMessage({
        message: new TextEncoder().encode(message),
      });

      /* Sui wallet returns { bytes, signature } - use the exact bytes the wallet signed */
      const { signature, bytes } = result;

      /* 3. Verify with backend (send bytes so backend verifies exactly what was signed) */
      const verifyRes = await fetch(`${backend}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, signature, bytes, nonce, role, network }),
      });

      const data = await verifyRes.json();

      if (!data.success) {
        throw new Error(data.error || "Login failed");
      }

      /* 4. Redirect by role */
      if (data.role === "tenant") {
        navigate("/tenant/dashboard");
      } else {
        navigate("/landlord/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] px-4">
      <div
        className="w-full max-w-md bg-white p-8 md:p-10 text-center"
        style={{
          border: neobrutalBorder,
          boxShadow: neobrutalShadow,
        }}
      >
        <h1 className="text-3xl font-bold text-[#002040] mb-2">Rentinel Login</h1>
        <p className="text-[#002040]/70 text-sm mb-6">
          Connect your Sui wallet to sign in
        </p>

        <div className="mb-6 flex justify-center">
          <ConnectButton connectText="Connect Sui Wallet" />
        </div>

        {currentAccount && (
          <p className="text-sm text-[#007070] mb-4 break-all">
            Connected: {currentAccount.address.slice(0, 8)}...
            {currentAccount.address.slice(-6)}
          </p>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("tenant")}
            className="block w-full px-6 py-3 font-bold text-white bg-[#0070B0] border-4 border-[#002040] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-none transition disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              boxShadow: "4px 4px 0 #005060",
            }}
            disabled={loading || !currentAccount}
          >
            {loading ? "Connecting..." : "Login as Tenant"}
          </button>

          <button
            onClick={() => handleLogin("landlord")}
            className="block w-full px-6 py-3 font-bold text-[#002040] bg-white border-4 border-[#002040] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-none transition disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              boxShadow: "4px 4px 0 #005060",
            }}
            disabled={loading || !currentAccount}
          >
            {loading ? "Connecting..." : "Login as Landlord"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
        )}

        <Link
          to="/"
          className="mt-6 inline-block text-sm text-[#007070] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
