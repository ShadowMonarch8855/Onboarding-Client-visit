import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import { verifyWebhookSignature } from '../services/payment.service.js';
import { success, error } from '../utils/apiResponse.js';

export const processWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return error(res, 'Invalid signature', 400);
    }
    
    const { invoiceId, amount, providerReference, status } = req.body;
    
    let payment = await Payment.findOne({ providerReference });
    if (!payment) {
      payment = await Payment.create({
        invoice: invoiceId,
        providerReference,
        amount,
        status: status || 'completed',
        paidAt: new Date()
      });
      
      if (payment.status === 'completed') {
        await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid' });
      }
    }
    
    success(res, { message: 'Webhook processed successfully' });
  } catch (err) {
    error(res, err.message, 500);
  }
};
