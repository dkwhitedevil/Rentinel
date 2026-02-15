const express = require("express");
const pool = require("./db");

const router = express.Router();

/* =====================================================
   POST /applications/timestamp
   Store application with blockchain proof (signature)
   Optional: works without DB (returns proof for localStorage)
===================================================== */
router.post("/timestamp", async (req, res) => {
  try {
    const { wallet, listing, message, txHash, signature, payload } = req.body;

    if (!wallet || !listing || !txHash) {
      return res.status(400).json({
        error: "wallet, listing, and txHash required",
      });
    }

    try {
      await pool.query(
        `INSERT INTO applications (wallet, listing, message, tx_hash, signature_base64, payload_json)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at`,
        [
          wallet,
          listing,
          message || "",
          txHash,
          signature || null,
          payload ? JSON.stringify(payload) : null,
        ]
      );
    } catch (dbErr) {
      console.warn("DB store failed (optional):", dbErr.message);
      /* Continue — proof still valid, client has it */
    }

    res.json({
      success: true,
      txHash,
      message: "Application timestamp recorded. Proof is cryptographically verifiable.",
    });
  } catch (err) {
    console.error("Applications timestamp error:", err);
    res.status(500).json({ error: "Failed to record application" });
  }
});

module.exports = router;
