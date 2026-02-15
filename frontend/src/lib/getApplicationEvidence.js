/**
 * Fetches on-chain Application object from Sui and returns evidence for PDF.
 * @param {import("@mysten/sui/client").SuiJsonRpcClient} client - Sui client (from useSuiClient)
 * @param {string} objectId - Application object ID
 * @returns {Promise<{tenant: string, landlord: string, listing: string, createdAt: number, status: number, objectId: string}>}
 */
export async function getApplicationEvidence(client, objectId) {
  const result = await client.getObject({
    objectId,
    options: { showContent: true },
  });

  const obj = result?.object ?? result?.data ?? result;
  if (!obj) {
    throw new Error("Object not found");
  }

  const content = obj.content;
  if (!content?.dataType || content.dataType !== "moveObject") {
    throw new Error("Not a valid Application object");
  }

  const fields = content.fields ?? content;
  const listingBytes = fields.listing;
  const listing =
    typeof listingBytes === "string"
      ? listingBytes
      : new TextDecoder().decode(
          Uint8Array.from(
            Array.isArray(listingBytes) ? listingBytes : Object.values(listingBytes)
          )
        );

  return {
    tenant: fields.tenant ?? "",
    landlord: fields.landlord ?? "",
    listing,
    createdAt: Number(fields.created_at ?? 0),
    status: Number(fields.status ?? 0),
    objectId,
  };
}
