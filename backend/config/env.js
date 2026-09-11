import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://tube71133_db_user:g5ROusuq9pljXddC@ac-p23ypxv-shard-00-00.uhekirw.mongodb.net:27017,ac-p23ypxv-shard-00-01.uhekirw.mongodb.net:27017,ac-p23ypxv-shard-00-02.uhekirw.mongodb.net:27017/clientflow?ssl=true&replicaSet=atlas-f0cg9w-shard-0&authSource=admin&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads'
};

const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    console.warn(`Warning: Environment variable ${envVar} is missing.`);
  }
}
