import Invoice from '../models/Invoice.js';
import { success, error } from '../utils/apiResponse.js';
import { sendInvoiceEmail } from '../services/email.service.js';
import { createAuditLog } from '../services/audit.service.js';

export const createInvoice = async (req, res) => {
  try {
    const { project, amount, dueDate } = req.body;
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = await Invoice.create({ project, invoiceNumber, amount, dueDate });
    await createAuditLog(req.user._id, 'CREATE', 'Invoice', invoice._id, { invoiceNumber, amount }, req.ip);
    success(res, invoice, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getInvoices = async (req, res) => {
  try {
    const query = req.query.project ? { project: req.query.project } : {};
    const invoices = await Invoice.find(query).populate('project', 'name');
    success(res, invoices);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('project');
    if (!invoice) return error(res, 'Invoice not found', 404);
    success(res, invoice);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('project');
    if (!invoice) return error(res, 'Invoice not found', 404);
    
    await sendInvoiceEmail('client@example.com', invoice.invoiceNumber, invoice.amount);
    invoice.status = 'sent';
    invoice.sentAt = new Date();
    await invoice.save();
    
    await createAuditLog(req.user._id, 'SEND', 'Invoice', invoice._id, null, req.ip);
    success(res, invoice);
  } catch (err) {
    error(res, err.message, 500);
  }
};
