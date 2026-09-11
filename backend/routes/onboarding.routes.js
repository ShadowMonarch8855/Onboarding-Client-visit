import express from 'express';
import { getInstance, getProgress, updateStep, submitOnboarding, reviewOnboarding, getTemplates } from '../controllers/onboarding.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router.get('/templates', getTemplates);
router.get('/:id', getInstance);
router.get('/:id/progress', getProgress);
router.put('/:id/steps/:stepId', updateStep);
router.post('/:id/submit', submitOnboarding);
router.post('/:id/review', authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), reviewOnboarding);

export default router;
