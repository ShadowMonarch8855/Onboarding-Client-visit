import mongoose from 'mongoose';
import { PROJECT_STATUS } from '../utils/constants.js';

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: Object.values(PROJECT_STATUS), default: PROJECT_STATUS.DRAFT },
  timezone: { type: String, default: 'UTC' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
