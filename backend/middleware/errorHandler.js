import { error } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return error(res, `Validation Error: ${messages.join(', ')}`, 400);
  }
  
  if (err.code === 11000) {
    return error(res, 'Duplicate field value entered', 400);
  }
  
  if (err.name === 'CastError') {
    return error(res, `Resource not found with id of ${err.value}`, 404);
  }
  
  error(res, 'Server Error', 500);
};
