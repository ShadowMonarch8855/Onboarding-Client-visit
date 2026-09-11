import mongoose from 'mongoose';
import { ASSET_CATEGORY } from '../utils/constants.js';

const assetSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  category: { type: String, enum: Object.values(ASSET_CATEGORY), required: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  storageUri: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
