import User from '../models/User.js';
import { generateToken, generateResetToken } from '../utils/token.js';
import { success, error } from '../utils/apiResponse.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return error(res, 'User already exists', 400);
    }
    const user = await User.create({ name, email, password, role });
    success(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return error(res, 'Invalid credentials', 401);
    }
    if (user.status !== 'active') {
      return error(res, 'User account is inactive', 403);
    }
    const token = generateToken({ id: user._id });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  success(res, { message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const resetToken = generateResetToken();
  await sendPasswordResetEmail(email, resetToken);
  success(res, { message: 'Password reset email sent' });
};

export const resetPassword = async (req, res) => {
  success(res, { message: 'Password reset successful' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return error(res, 'User not found', 404);
    }
    success(res, { id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    success(res, users);
  } catch (err) {
    error(res, err.message, 500);
  }
};

