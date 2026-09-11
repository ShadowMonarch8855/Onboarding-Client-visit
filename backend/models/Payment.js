import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../utils/constants.js';

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  providerReference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
  paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
