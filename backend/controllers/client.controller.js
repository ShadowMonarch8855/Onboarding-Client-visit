import Client from '../models/Client.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { createAuditLog } from '../services/audit.service.js';

export const getClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const query = { status: 'active' };
    if (req.query.search) {
      query.$or = [
        { companyName: { $regex: req.query.search, $options: 'i' } },
        { contactName: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const clients = await Client.find(query).skip(skip).limit(limit).sort('-createdAt');
    const total = await Client.countDocuments(query);
    
    paginated(res, clients, total, page, limit);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return error(res, 'Client not found', 404);
    success(res, client);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    await createAuditLog(req.user._id, 'CREATE', 'Client', client._id, client, req.ip);
    success(res, client, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return error(res, 'Client not found', 404);
    await createAuditLog(req.user._id, 'UPDATE', 'Client', client._id, req.body, req.ip);
    success(res, client);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const archiveClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
    if (!client) return error(res, 'Client not found', 404);
    await createAuditLog(req.user._id, 'ARCHIVE', 'Client', client._id, null, req.ip);
    success(res, client);
  } catch (err) {
    error(res, err.message, 500);
  }
};
