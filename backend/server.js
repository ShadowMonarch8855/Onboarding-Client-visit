import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { correlationIdMiddleware } from './middleware/correlationId.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import projectRoutes from './routes/project.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import contractRoutes from './routes/contract.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import assetRoutes from './routes/asset.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import healthRoutes from './routes/health.routes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Bulletproof CORS Middleware - Runs First on All Incoming Requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-correlation-id');

  // Respond immediately with 200 OK to preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Also use standard cors package as backup
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware (with Cross-Origin Resource Policy allowed for SPA)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(correlationIdMiddleware);

app.use(express.json());

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'ClientFlow Backend API is running successfully',
    documentation: '/api/health'
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes (Mounted under /api and root fallback)
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/clients`, clientRoutes);
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/invoices`, invoiceRoutes);
  app.use(`${prefix}/payments`, paymentRoutes);
  app.use(`${prefix}/contracts`, contractRoutes);
  app.use(`${prefix}/onboarding`, onboardingRoutes);
  app.use(`${prefix}/assets`, assetRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/health`, healthRoutes);
};

mountRoutes('/api');
mountRoutes('');

// Error Handler
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
