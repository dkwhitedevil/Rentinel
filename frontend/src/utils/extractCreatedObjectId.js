/**
 * Extract created shared object ID from transaction result
 * @param {Object} txResult - From getTransactionBlock or signAndExecute effects
 * @param {string} typePrefix - e.g. "application::Application" to filter
 * @returns {string|null} Object ID or null
 */
export function extractCreatedObjectId(txResult, typePrefix = "application::Application") {
  const effects = txResult?.effects ?? txResult?.Transaction?.effects ?? txResult?.transaction?.effects;
  if (!effects) return null;

  const created = effects.created ?? effects.objectChanges?.filter((c) => c.type === "created") ?? [];
  for (const c of created) {
    const ref = c.reference ?? c.ref ?? c;
    const objectId = ref.objectId ?? ref.object?.objectId ?? ref.id;
    const type = c.objectType ?? c.type ?? ref.objectType ?? "";
    if (objectId && (type.includes("Application") || type.includes("application"))) {
      return objectId;
    }
  }

  const changes = effects.objectChanges ?? [];
  for (const change of changes) {
    if (change.type === "created" || change.objectType) {
      const objectId = change.objectId ?? change.reference?.objectId ?? change.ref?.objectId;
      const type = change.objectType ?? change.type ?? "";
      if (objectId && type.includes("application")) {
        return objectId;
      }
    }
  }

  return null;
}
