import { Transaction } from "@mysten/sui/transactions";

/** Sui Clock shared object address */
export const SUI_CLOCK = "0x6";

/**
 * Build apply transaction - creates on-chain Application object
 * @param {Object} opts
 * @param {string} opts.packageId - Rentinel package ID
 * @param {string} opts.tenant - Tenant wallet address
 * @param {string} opts.landlord - Landlord wallet address
 * @param {string} opts.listing - Listing title/description
 */
export function buildApplyTransaction({ packageId, tenant, landlord, listing }) {
  const tx = new Transaction();
  const listingBytes = Array.from(new TextEncoder().encode(listing));

  tx.moveCall({
    target: `${packageId}::application::apply`,
    arguments: [
      tx.object(SUI_CLOCK),
      tx.pure.address(tenant),
      tx.pure.address(landlord),
      tx.pure.vector("u8", listingBytes),
    ],
  });

  return tx;
}

/**
 * Build accept transaction - landlord accepts application
 */
export function buildAcceptTransaction({ packageId, appId }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::application::accept`,
    arguments: [tx.object(appId)],
  });
  return tx;
}

/**
 * Build reject transaction - landlord rejects application
 */
export function buildRejectTransaction({ packageId, appId }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::application::reject`,
    arguments: [tx.object(appId)],
  });
  return tx;
}

/**
 * Build mark_ghosted transaction - anyone can call after 48h
 */
export function buildMarkGhostedTransaction({ packageId, appId }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::application::mark_ghosted`,
    arguments: [tx.object(SUI_CLOCK), tx.object(appId)],
  });
  return tx;
}
