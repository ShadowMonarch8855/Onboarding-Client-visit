import mongoose from 'mongoose';

const contractSignatureSchema = new mongoose.Schema({
  contractVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractVersion', required: true },
  signer: { type: String, required: true },
  signedAt: { type: Date, default: Date.now },
  evidenceUri: { type: String, required: true }
});

export default mongoose.model('ContractSignature', contractSignatureSchema);
