import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import crypto from 'crypto';

export const generateToken = (payload, expiresIn = env.JWT_EXPIRE) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
