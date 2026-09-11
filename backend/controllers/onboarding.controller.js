import OnboardingInstance from '../models/OnboardingInstance.js';
import OnboardingStepProgress from '../models/OnboardingStepProgress.js';
import OnboardingTemplateVersion from '../models/OnboardingTemplateVersion.js';
import { success, error } from '../utils/apiResponse.js';
import { createAuditLog } from '../services/audit.service.js';

export const getInstance = async (req, res) => {
  try {
    const instance = await OnboardingInstance.findById(req.params.id).populate('project').populate('templateVersion');
    if (!instance) return error(res, 'Instance not found', 404);
    const steps = await OnboardingStepProgress.find({ instance: instance._id }).sort('stepPosition');
    const result = instance.toObject();
    result.steps = steps;
    success(res, result);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getProgress = async (req, res) => {
  try {
    const progress = await OnboardingStepProgress.find({ instance: req.params.id }).sort('stepPosition');
    success(res, progress);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const updateStep = async (req, res) => {
  try {
    const { status, dataJson } = req.body;
    let step = await OnboardingStepProgress.findById(req.params.stepId);
    if (!step) {
      // create it if not exists
      step = await OnboardingStepProgress.create({
        instance: req.params.id,
        ...req.body
      });
    } else {
      step.status = status || step.status;
      if (dataJson) step.dataJson = dataJson;
      if (status === 'completed') step.completedAt = new Date();
      await step.save();
    }
    
    // Recalculate progress percentage
    const allSteps = await OnboardingStepProgress.find({ instance: req.params.id });
    const completed = allSteps.filter(s => s.status === 'completed').length;
    const progressPerc = allSteps.length > 0 ? (completed / allSteps.length) * 100 : 0;
    
    await OnboardingInstance.findByIdAndUpdate(req.params.id, { progress: progressPerc, status: 'in_progress' });
    
    success(res, step);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const submitOnboarding = async (req, res) => {
  try {
    const instance = await OnboardingInstance.findByIdAndUpdate(req.params.id, { status: 'submitted' }, { new: true });
    if (!instance) return error(res, 'Instance not found', 404);
    await createAuditLog(req.user._id, 'SUBMIT', 'OnboardingInstance', instance._id, null, req.ip);
    success(res, instance);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const reviewOnboarding = async (req, res) => {
  try {
    const { approved } = req.body;
    const status = approved ? 'approved' : 'changes_requested';
    const instance = await OnboardingInstance.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!instance) return error(res, 'Instance not found', 404);
    await createAuditLog(req.user._id, 'REVIEW', 'OnboardingInstance', instance._id, { status }, req.ip);
    success(res, instance);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await OnboardingTemplateVersion.find({ status: 'active' }).sort('createdAt');
    success(res, templates);
  } catch (err) {
    error(res, err.message, 500);
  }
};
