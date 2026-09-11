import express from 'express';
import { createContract, getContracts, getContract, sendContract, signContract } from '../controllers/contract.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getContracts);
router.post('/', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), createContract);
router.get('/:id', getContract);
router.post('/:id/send', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), sendContract);
router.post('/:id/sign', authorize(USER_ROLES.CLIENT, USER_ROLES.ADMIN), signContract);

export default router;
