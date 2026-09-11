import mongoose from 'mongoose';
import { INVOICE_STATUS } from '../utils/constants.js';

const invoiceSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(INVOICE_STATUS), default: INVOICE_STATUS.DRAFT },
  sentAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
