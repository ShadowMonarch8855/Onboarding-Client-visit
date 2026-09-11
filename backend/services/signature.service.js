export const createSignature = async (contractVersionId, signerInfo) => {
  console.log(`[Signature Service] Creating signature for contract version ${contractVersionId} by ${signerInfo}`);
  return {
    signatureId: `sig_${Date.now()}`,
    evidenceUri: `https://mock-signature-service.com/evidence/${Date.now()}`
  };
};

export const verifySignature = async (signatureId) => {
  console.log(`[Signature Service] Verifying signature ${signatureId}`);
  return true;
};
