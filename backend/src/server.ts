import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './prisma';

// Import routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import packageRoutes from './routes/package.routes';
import bookingRoutes from './routes/booking.routes';
import ratingRoutes from './routes/rating.routes';
import messageRoutes from './routes/message.routes';
import photoRoutes from './routes/photo.routes';
import analyticsRoutes from './routes/analytics.routes';
import businessRoutes from './routes/business.routes';
import videoRoutes from './routes/video.routes';
import inspirationRoutes from './routes/inspiration.routes';
import playlistRoutes from './routes/playlist.routes';
import menuRoutes from './routes/menu.routes';
import roomPlanRoutes from './routes/roomPlan.routes';
import podcastRoutes from './routes/podcast.routes';
import badgeRoutes from './routes/badge.routes';
import eventSiteRoutes from './routes/eventSite.routes';
import ambassadorRoutes from './routes/ambassador.routes';
import disputeRoutes from './routes/dispute.routes';
import contractRoutes from './routes/contract.routes';
import invoiceRoutes from './routes/invoice.routes';

// Import middleware
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

// Import socket handlers
import { initializeSocket } from './socket/socket.handler';

dotenv.config();

// Create Express app
const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSocket(io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', inspirationRoutes);
app.use('/api', playlistRoutes);
app.use('/api', menuRoutes);
app.use('/api', roomPlanRoutes);
app.use('/api', podcastRoutes);
app.use('/api', badgeRoutes);
app.use('/api', eventSiteRoutes);
app.use('/api', ambassadorRoutes);
app.use('/api', disputeRoutes);
app.use('/api', contractRoutes);
app.use('/api', invoiceRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO running`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { io };
export { prisma } from './prisma';
