const express = require("express");
const crypto = require("crypto");

const pool = require("./db");

const router = express.Router();

/* =====================================================
   In-memory nonce store (OK for MVP / hackathon)
===================================================== */
const nonces = {};

/* =====================================================
   1️⃣ Generate Nonce
   POST /auth/nonce
===================================================== */
router.post("/nonce", async (req, res) => {
  try {
    const { wallet } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    const nonce = crypto.randomBytes(16).toString("hex");
    nonces[wallet] = nonce;

    res.json({ nonce });
  } catch (err) {
    console.error("Nonce error:", err);
    res.status(500).json({ error: "Failed to generate nonce" });
  }
});

/* =====================================================
   2️⃣ Verify Signature & Login (Sui wallet)
   POST /auth/verify
   Uses @mysten/sui verifyPersonalMessageSignature
===================================================== */
router.post("/verify", async (req, res) => {
  try {
    const { wallet, signature, bytes: signedBytesBase64, nonce: _clientNonce, role, network: clientNetwork } = req.body;

    if (!wallet || !signature) {
      return res.status(400).json({ error: "Wallet and signature required" });
    }

    const nonce = nonces[wallet];
    if (!nonce) {
      return res.status(400).json({ error: "Nonce not found or expired" });
    }

    /* Get message bytes - use wallet's signed bytes (Slush returns exact bytes it signed) */
    let rawMessageBytes;
    if (signedBytesBase64) {
      rawMessageBytes = new Uint8Array(Buffer.from(signedBytesBase64, "base64"));
      const messageText = new TextDecoder().decode(rawMessageBytes);
      if (!messageText.includes(nonce)) {
        return res.status(401).json({ error: "Signed message does not contain valid nonce" });
      }
    } else {
      const message = `Login to Sentinel. Nonce: ${nonce}`;
      rawMessageBytes = new TextEncoder().encode(message);
    }

    const { SuiJsonRpcClient, getJsonRpcFullnodeUrl } = await import("@mysten/sui/jsonRpc");
    const { bcs } = await import("@mysten/sui/bcs");

    /* Try both formats: raw bytes (what SDK uses) and BCS-encoded (what some RPC implementations expect) */
    const bytesFormats = [
      Buffer.from(rawMessageBytes).toString("base64"),
      Buffer.from(bcs.byteVector().serialize(rawMessageBytes).toBytes()).toString("base64"),
    ];

    const preferredNetwork = clientNetwork || process.env.SUI_NETWORK || "testnet";
    const networksToTry = [...new Set([preferredNetwork, "testnet", "mainnet", "devnet"])];

    let verified = false;
    let lastError = null;

    for (const bytesForVerify of bytesFormats) {
      if (verified) break;
      for (const network of networksToTry) {
        try {
          const suiClient = new SuiJsonRpcClient({
            url: getJsonRpcFullnodeUrl(network),
            network,
          });

          const result = await suiClient.core.verifyZkLoginSignature({
            bytes: bytesForVerify,
            signature,
            intentScope: "PersonalMessage",
            address: wallet,
          });

          if (result.success && (!result.errors || result.errors.length === 0)) {
            verified = true;
            break;
          }
          if (result.errors?.length) lastError = result.errors[0];
        } catch (e) {
          lastError = e.message;
        }
      }
    }

    if (!verified) {
      /* Fallback for non-zkLogin wallets (Sui Wallet, etc.) */
      try {
        const { verifyPersonalMessageSignature } = await import("@mysten/sui/verify");
        const network = process.env.SUI_NETWORK || "testnet";
        const suiClient = new SuiJsonRpcClient({
          url: getJsonRpcFullnodeUrl(network),
          network,
        });
        const messageBytes = signedBytesBase64
          ? Buffer.from(signedBytesBase64, "base64")
          : new TextEncoder().encode(`Login to Sentinel. Nonce: ${nonce}`);
        await verifyPersonalMessageSignature(new Uint8Array(messageBytes), signature, {
          address: wallet,
          client: suiClient,
        });
      } catch (fallbackErr) {
        throw new Error(lastError || fallbackErr.message || "Signature verification failed");
      }
    }

    /* =====================================================
       Check / Create user in DB (Supabase Postgres)
    ===================================================== */

    const existingUser = await pool.query(
      "SELECT role FROM users WHERE wallet = $1",
      [wallet]
    );

    let finalRole = role;

    if (existingUser.rows.length > 0) {
      finalRole = existingUser.rows[0].role;
    } else {
      if (!role) {
        return res.status(400).json({ error: "Role required for new user" });
      }
      await pool.query(
        "INSERT INTO users (wallet, role) VALUES ($1, $2)",
        [wallet, role]
      );
    }

    delete nonces[wallet];

    res.json({
      success: true,
      role: finalRole,
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({
      error: err.message || "Authentication failed",
    });
  }
});

module.exports = router;
