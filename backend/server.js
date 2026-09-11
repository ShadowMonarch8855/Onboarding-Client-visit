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
app.use(helmet());
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/health', healthRoutes);

// Error Handler
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
