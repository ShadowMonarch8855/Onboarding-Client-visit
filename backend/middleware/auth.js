import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';
import { error } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return error(res, 'Not authorized to access this route', 401);
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return error(res, 'User not found', 404);
    }
    if (user.status !== 'active') {
      return error(res, 'User account is inactive', 403);
    }
    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Not authorized to access this route', 401);
  }
};
