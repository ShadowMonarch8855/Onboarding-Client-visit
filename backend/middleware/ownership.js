import { error } from '../utils/apiResponse.js';
import { USER_ROLES } from '../utils/constants.js';

export const checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      if (req.user.role === USER_ROLES.ADMIN) {
        return next();
      }
      
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return error(res, 'Resource not found', 404);
      }
      
      if (req.user.role === USER_ROLES.TEAM_MEMBER) {
        if (resource.assignedUser && resource.assignedUser.toString() === req.user._id.toString()) {
          return next();
        }
        return error(res, 'Not authorized to access this resource', 403);
      }
      
      if (req.user.role === USER_ROLES.CLIENT) {
        if (resource.client && resource.client.toString() === req.user.client?.toString()) {
          return next();
        }
        return error(res, 'Not authorized to access this resource', 403);
      }
      
      return error(res, 'Not authorized', 403);
    } catch (err) {
      next(err);
    }
  };
};
