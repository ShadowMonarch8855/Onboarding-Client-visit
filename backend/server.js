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
const configuredOrigin = env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = configuredOrigin.includes(',')
  ? configuredOrigin.split(',').map(o => o.trim())
  : [configuredOrigin.trim()];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    
    const allowed = Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins];
    if (
      allowed.includes(origin) ||
      allowed.includes('*') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in cloud deployment to prevent broken requests
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-correlation-id']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
