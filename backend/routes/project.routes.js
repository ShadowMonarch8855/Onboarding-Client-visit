import express from 'express';
import { getProjects, getProject, createProject, updateProject, startOnboarding } from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { checkOwnership } from '../middleware/ownership.js';
import Project from '../models/Project.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', authorize(USER_ROLES.ADMIN), createProject);
router.get('/:id', checkOwnership(Project), getProject);
router.put('/:id', checkOwnership(Project), updateProject);
router.post('/:id/start-onboarding', checkOwnership(Project), authorize(USER_ROLES.ADMIN, USER_ROLES.TEAM_MEMBER), startOnboarding);

export default router;
