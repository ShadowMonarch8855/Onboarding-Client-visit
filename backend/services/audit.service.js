import AuditLog from '../models/AuditLog.js';

export const createAuditLog = async (actorUserId, action, entityType, entityId, metadata, ipAddress) => {
  try {
    const log = new AuditLog({
      actorUserId,
      action,
      entityType,
      entityId,
      metadataJson: metadata,
      ipAddress
    });
    await log.save();
    console.log(`[Audit Service] Logged action: ${action} on ${entityType} ${entityId}`);
  } catch (error) {
    console.error(`[Audit Service] Failed to create audit log: ${error.message}`);
  }
};
