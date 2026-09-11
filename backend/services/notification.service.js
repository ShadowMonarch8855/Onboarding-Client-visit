import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message
    });
    await notification.save();
    console.log(`[Notification Service] Created notification for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error(`[Notification Service] Failed to create notification: ${error.message}`);
  }
};
