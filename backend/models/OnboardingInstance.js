import mongoose from 'mongoose';
import { ONBOARDING_STATUS } from '../utils/constants.js';

const instanceSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  templateVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'OnboardingTemplateVersion', required: true },
  status: { type: String, enum: Object.values(ONBOARDING_STATUS), default: ONBOARDING_STATUS.PENDING },
  progress: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

export default mongoose.model('OnboardingInstance', instanceSchema);
