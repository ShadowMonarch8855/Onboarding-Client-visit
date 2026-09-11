import mongoose from 'mongoose';

const contractVersionSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  versionNo: { type: Number, required: true },
  fileUri: { type: String, required: true },
  contentHash: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('ContractVersion', contractVersionSchema);
