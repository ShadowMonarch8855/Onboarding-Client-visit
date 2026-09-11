import Notification from '../models/Notification.js';
import { success, error, paginated } from '../utils/apiResponse.js';

export const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const filter = req.query.filter;
    const query = { user: req.user._id };
    
    if (filter === 'unread') {
      query.readAt = null;
    } else if (filter === 'read') {
      query.readAt = { $ne: null };
    }
    
    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');
    const total = await Notification.countDocuments(query);
    
    paginated(res, notifications, total, page, limit);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { readAt: new Date() },
      { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    success(res, notification);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        user: req.user._id, 
        $or: [{ readAt: null }, { readAt: { $exists: false } }] 
      },
      { readAt: new Date() }
    );
    success(res, { message: 'All notifications marked as read' });
  } catch (err) {
    error(res, err.message, 500);
  }
};
