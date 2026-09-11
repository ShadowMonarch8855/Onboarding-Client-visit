import express from 'express';
import { processWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// Webhooks don't use standard auth middleware
// Body is parsed as JSON by express.json() middleware in server.js
router.post('/webhook', processWebhook);

export default router;
