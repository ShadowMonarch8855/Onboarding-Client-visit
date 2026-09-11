import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      mongoose.connection.on('error', (err) => {
        console.error(`MongoDB Connection Error: ${err}`);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Disconnected');
      });
      
      return;
    } catch (error) {
      retries++;
      console.error(`Error connecting to MongoDB (Attempt ${retries}/${maxRetries}): ${error.message}`);
      if (retries === maxRetries) {
        console.error('Failed to connect to MongoDB after maximum retries. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};
