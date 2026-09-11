import mongoose from 'mongoose';
import { STEP_STATUS } from '../utils/constants.js';

const stepProgressSchema = new mongoose.Schema({
  instance: { type: mongoose.Schema.Types.ObjectId, ref: 'OnboardingInstance', required: true },
  stepTitle: { type: String, required: true },
  stepDescription: { type: String },
  stepType: { type: String, default: 'general' },
  stepPlaceholder: { type: String },
  stepPosition: { type: Number, required: true },
  required: { type: Boolean, default: true },
  status: { type: String, enum: Object.values(STEP_STATUS), default: STEP_STATUS.PENDING },
  dataJson: { type: mongoose.Schema.Types.Mixed },
  completedAt: { type: Date }
});

export default mongoose.model('OnboardingStepProgress', stepProgressSchema);
