import express from 'express';
import { getClients, getClient, createClient, updateClient, archiveClient } from '../controllers/client.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), getClients);
router.post('/', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), createClient);
router.get('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), getClient);
router.put('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), updateClient);
router.delete('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), archiveClient);

export default router;
