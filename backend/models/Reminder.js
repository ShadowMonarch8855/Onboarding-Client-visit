import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  targetType: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reminderType: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  sentAt: { type: Date },
  idempotencyKey: { type: String, required: true, unique: true }
});

export default mongoose.model('Reminder', reminderSchema);
