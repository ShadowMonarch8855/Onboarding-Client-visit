import mongoose from 'mongoose';
import { NOTIFICATION_TYPE } from '../utils/constants.js';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Notification', notificationSchema);
