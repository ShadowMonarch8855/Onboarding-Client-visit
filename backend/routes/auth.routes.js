import express from 'express';
import { register, login, logout, forgotPassword, resetPassword, getMe, getAllUsers } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.post('/register', protect, authorize(USER_ROLES.ADMIN), register);
router.get('/users', protect, authorize(USER_ROLES.ADMIN), getAllUsers);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
