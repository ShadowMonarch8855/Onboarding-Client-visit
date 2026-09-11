export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member',
  CLIENT: 'client'
};

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  READY_TO_START: 'ready_to_start',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold'
};

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  SIGNED: 'signed',
  EXPIRED: 'expired'
};

export const ONBOARDING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes_requested'
};

export const STEP_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const ASSET_CATEGORY = {
  LOGO: 'logo',
  DOCUMENT: 'document',
  IMAGE: 'image',
  VIDEO: 'video',
  OTHER: 'other'
};

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ACTION: 'action'
};

export const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv', 'text/plain', 'application/zip'
];

import { env } from '../config/env.js';
export const MAX_FILE_SIZE = env.MAX_FILE_SIZE;
