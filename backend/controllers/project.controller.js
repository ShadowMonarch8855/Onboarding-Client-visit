import Project from '../models/Project.js';
import OnboardingInstance from '../models/OnboardingInstance.js';
import OnboardingStepProgress from '../models/OnboardingStepProgress.js';
import OnboardingTemplateVersion from '../models/OnboardingTemplateVersion.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { createAuditLog } from '../services/audit.service.js';

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (req.query.client) query.client = req.query.client;
    if (req.query.status) query.status = req.query.status;
    if (req.query.assignedUser) query.assignedUser = req.query.assignedUser;
    
    if (req.user.role === 'client') {
       query.client = req.user.client; // assuming req.user.client is set for client users
    }
    
    const projects = await Project.find(query)
      .populate('client', 'companyName')
      .populate('assignedUser', 'name')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');
    const total = await Project.countDocuments(query);
    
    paginated(res, projects, total, page, limit);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client')
      .populate('assignedUser');
    if (!project) return error(res, 'Project not found', 404);
    success(res, project);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    await createAuditLog(req.user._id, 'CREATE', 'Project', project._id, req.body, req.ip);
    success(res, project, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return error(res, 'Project not found', 404);
    await createAuditLog(req.user._id, 'UPDATE', 'Project', project._id, req.body, req.ip);
    success(res, project);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const startOnboarding = async (req, res) => {
  try {
    const { templateVersionId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found', 404);
    
    let template;
    if (templateVersionId && templateVersionId !== 'default-template') {
      template = await OnboardingTemplateVersion.findById(templateVersionId);
    }
    if (!template) {
      template = await OnboardingTemplateVersion.findOne({ status: 'active' }).sort('createdAt');
    }
    if (!template) return error(res, 'No active onboarding template found', 404);
    
    const instance = await OnboardingInstance.create({
      project: project._id,
      templateVersion: template._id,
      status: 'in_progress',
      progress: 0
    });

    // Spawn step progress records from template steps
    if (template.steps && template.steps.length > 0) {
      const stepDocs = template.steps.map(s => ({
        instance: instance._id,
        stepTitle: s.title,
        stepDescription: s.description,
        stepType: s.type || 'general',
        stepPlaceholder: s.placeholder,
        stepPosition: s.position,
        required: s.required,
        status: 'pending'
      }));
      await OnboardingStepProgress.insertMany(stepDocs);
    }
    
    await createAuditLog(req.user._id, 'START_ONBOARDING', 'Project', project._id, { instanceId: instance._id }, req.ip);
    success(res, instance, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};
