import Contract from '../models/Contract.js';
import ContractVersion from '../models/ContractVersion.js';
import ContractSignature from '../models/ContractSignature.js';
import { success, error } from '../utils/apiResponse.js';
import { sendContractEmail } from '../services/email.service.js';
import { createSignature } from '../services/signature.service.js';
import { createAuditLog } from '../services/audit.service.js';

export const createContract = async (req, res) => {
  try {
    const { project, contentHash, fileUri } = req.body;
    const contract = await Contract.create({ project, status: 'draft' });
    const version = await ContractVersion.create({ contract: contract._id, versionNo: 1, contentHash, fileUri });
    await createAuditLog(req.user._id, 'CREATE', 'Contract', contract._id, { versionId: version._id }, req.ip);
    success(res, { contract, version }, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getContracts = async (req, res) => {
  try {
    const query = req.query.project ? { project: req.query.project } : {};
    const contracts = await Contract.find(query).populate('project', 'name');
    success(res, contracts);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('project');
    if (!contract) return error(res, 'Contract not found', 404);
    success(res, contract);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const sendContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('project');
    if (!contract) return error(res, 'Contract not found', 404);
    
    await sendContractEmail('client@example.com', contract.project.name);
    contract.status = 'sent';
    await contract.save();
    
    await createAuditLog(req.user._id, 'SEND', 'Contract', contract._id, null, req.ip);
    success(res, contract);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const signContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return error(res, 'Contract not found', 404);
    
    const version = await ContractVersion.findOne({ contract: contract._id }).sort('-versionNo');
    if (!version) return error(res, 'Contract version not found', 404);
    
    const signatureData = await createSignature(version._id, req.user.name);
    await ContractSignature.create({
      contractVersion: version._id,
      signer: req.user.name,
      evidenceUri: signatureData.evidenceUri
    });
    
    contract.status = 'signed';
    await contract.save();
    
    await createAuditLog(req.user._id, 'SIGN', 'Contract', contract._id, { signatureData }, req.ip);
    success(res, contract);
  } catch (err) {
    error(res, err.message, 500);
  }
};
