import { Transaction } from "@mysten/sui/transactions";

/**
 * Builds a Sui transaction to timestamp a rental application on-chain.
 * Calls rentinel_contract::rentinel_contract::submit_application
 *
 * @param {Object} opts
 * @param {string} opts.packageId - Published Rentinel package ID (e.g. from VITE_RENTINEL_PACKAGE_ID)
 * @param {string} opts.listing - Listing title/description
 * @param {string} opts.message - Application message
 * @returns {Transaction} Transaction ready for signAndExecute
 */
export function buildTimestampTransaction({ packageId, listing, message }) {
  const tx = new Transaction();

  const listingBytes = Array.from(new TextEncoder().encode(listing));
  const messageBytes = Array.from(new TextEncoder().encode(message));

  tx.moveCall({
    target: `${packageId}::rentinel_contract::submit_application`,
    arguments: [
      tx.pure.vector("u8", listingBytes),
      tx.pure.vector("u8", messageBytes),
    ],
  });

  return tx;
}
