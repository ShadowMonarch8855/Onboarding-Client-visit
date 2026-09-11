import express from 'express';
import { createInvoice, getInvoices, getInvoice, sendInvoice } from '../controllers/invoice.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getInvoices);
router.post('/', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), createInvoice);
router.get('/:id', getInvoice);
router.post('/:id/send', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), sendInvoice);

export default router;
