import mongoose from 'mongoose';

const projectInformationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  businessDescription: { type: String },
  targetAudience: { type: String },
  goals: { type: String },
  messaging: { type: String },
  competitors: { type: String },
  requirements: { type: String }
}, { timestamps: true });

export default mongoose.model('ProjectInformation', projectInformationSchema);
