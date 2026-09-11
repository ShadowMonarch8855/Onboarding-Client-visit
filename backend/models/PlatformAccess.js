import mongoose from 'mongoose';

const platformAccessSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  platform: { type: String, required: true },
  accountIdentifier: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'revoked'], default: 'pending' },
  notes: { type: String }
});

export default mongoose.model('PlatformAccess', platformAccessSchema);
