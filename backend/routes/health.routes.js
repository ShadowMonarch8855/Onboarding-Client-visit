import express from 'express';

const router = express.Router();

import mongoose from 'mongoose';

router.get('/', async (req, res) => {
  let userCount = 0;
  try {
    if (mongoose.connection.readyState === 1) {
      userCount = await mongoose.connection.db.collection('users').countDocuments();
    }
  } catch (e) {
    userCount = -1;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: {
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      userCount
    }
  });
});

export default router;
