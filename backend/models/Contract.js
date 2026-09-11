import mongoose from 'mongoose';
import { CONTRACT_STATUS } from '../utils/constants.js';

const contractSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: Object.values(CONTRACT_STATUS), default: CONTRACT_STATUS.DRAFT }
}, { timestamps: true });

export default mongoose.model('Contract', contractSchema);
