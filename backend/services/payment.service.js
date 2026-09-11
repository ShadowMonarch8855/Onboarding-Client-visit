export const verifyWebhookSignature = (payload, signature) => {
  // Mock verification, always returns true
  console.log(`[Payment Service] Verifying webhook signature...`);
  return true;
};

export const processPayment = async (invoiceId, amount) => {
  console.log(`[Payment Service] Processing payment of ${amount} for invoice ${invoiceId}`);
  return { success: true, transactionId: `txn_${Date.now()}` };
};
