import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  metadataJson: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('AuditLog', auditLogSchema);
