import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['form', 'document', 'credentials', 'questionnaire', 'approval', 'general'], default: 'general' },
  placeholder: { type: String },
  required: { type: Boolean, default: true },
  position: { type: Number, required: true }
});

const templateVersionSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Standard Onboarding' },
  category: { type: String, enum: ['client_visit', 'software_dev', 'digital_marketing', 'general_consulting'], default: 'client_visit' },
  description: { type: String },
  templateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  versionNo: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
  steps: [stepSchema]
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('OnboardingTemplateVersion', templateVersionSchema);
