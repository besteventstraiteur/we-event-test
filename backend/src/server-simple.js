import express,  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin.env.CLIENT_URL || 'http://localhost:5173',
  credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended }));

// Mock data store
const mockStore = {
  photos: [
    { id: '1', eventId: 'event-1', url: 'https://picsum.photos/400/300?random=1', caption: 'Beautiful moment', likes, createdAt Date() },
    { id: '2', eventId: 'event-1', url: 'https://picsum.photos/400/300?random=2', caption: 'Amazing view', likes, createdAt Date() }
  ],
  videos: [
    { id: '1', eventId: 'event-1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Event Highlights', duration, createdAt Date() }
  ],
  inspirations: [
    { id: '1', imageUrl: 'https://picsum.photos/400/600?random=10', title: 'Modern Decor', category: 'decoration', likes },
    { id: '2', imageUrl: 'https://picsum.photos/400/600?random=11', title: 'Elegant Setup', category: 'decoration', likes }
  ],
  playlists: [
    { id: '1', name: 'Wedding Playlist', mood: 'romantic', tracks, createdBy: 'user-1' },
    { id: '2', name: 'Party Mix', mood: 'energetic', tracks, createdBy: 'user-1' }
  ],
  menuItems: [
    { id: '1', name: 'Caesar Salad', category: 'starter', price.50, allergens: ['gluten', 'dairy'] },
    { id: '2', name: 'Grilled Salmon', category: 'main', price.00, allergens: ['fish'] }
  ],
  roomPlans: [
    { id: '1', name: 'Main Hall Layout', dimensions: { width, height }, tables },
    { id: '2', name: 'Garden Setup', dimensions: { width, height }, tables }
  ],
  podcasts: [
    { id: '1', title: 'Event Planning Tips', duration, url: 'https://example.com/podcast1.mp3', description: 'Tips for successful events' },
    { id: '2', title: 'Wedding Trends 2024', duration, url: 'https://example.com/podcast2.mp3', description: 'Latest wedding trends' }
  ],
  badges: [
    { id: '1', name: 'First Event', description: 'Completed your first event', points },
    { id: '2', name: 'Super Planner', description: 'Organized 10+ events', points }
  ],
  eventSites: [
    { id: '1', eventId: 'event-1', slug: 'my-wedding-2024', theme: 'elegant', customDomain, published },
    { id: '2', eventId: 'event-2', slug: 'corporate-gala', theme: 'modern', customDomain, published }
  ],
  ambassadors: [
    { id: '1', name: 'John Doe', email: 'john@example.com', referralCode: 'JOHN2024', totalEarnings.00, referrals },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', referralCode: 'JANE2024', totalEarnings.00, referrals }
  ],
  disputes: [
    { id: '1', bookingId: 'booking-1', status: 'OPEN', description: 'Service not as described', createdAt Date() },
    { id: '2', bookingId: 'booking-2', status: 'RESOLVED', description: 'Late delivery', resolvedAt Date() }
  ],
  contracts: [
    { id: '1', bookingId: 'booking-1', signedAt, contractUrl },
    { id: '2', bookingId: 'booking-2', signedAt Date(), contractUrl: 'https://example.com/contract2.pdf' }
  ],
  invoices: [
    { id: '1', bookingId: 'booking-1', amount.00, status: 'PENDING', dueDate Date('2024-03-15') },
    { id: '2', bookingId: 'booking-2', amount.00, status: 'PAID', paidAt Date() }
  ]
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp Date() });
});

// MODULE 1
app.get('/api/events/:eventId/photos', (req, res) => {
  const photos = mockStore.photos.filter(p => p.eventId === req.params.eventId);
  res.json({ success, data });
});

app.post('/api/events/:eventId/photos', (req, res) => {
  const newPhoto = {
    id(mockStore.photos.length + 1),
    eventId.params.eventId,
    url.body.url || 'https://picsum.photos/400/300?random=' + Math.random(),
    caption.body.caption || '',
    likes,
    createdAt Date()
  };
  mockStore.photos.push(newPhoto);
  res.status(201).json({ success, data });
});

// MODULE 2
app.get('/api/events/:eventId/videos', (req, res) => {
  const videos = mockStore.videos.filter(v => v.eventId === req.params.eventId);
  res.json({ success, data });
});

app.post('/api/events/:eventId/videos', (req, res) => {
  const newVideo = {
    id(mockStore.videos.length + 1),
    eventId.params.eventId,
    url.body.url || '',
    title.body.title || 'Untitled Video',
    duration.body.duration || 0,
    createdAt Date()
  };
  mockStore.videos.push(newVideo);
  res.status(201).json({ success, data });
});

// MODULE 3
app.get('/api/inspirations', (req, res) => {
  res.json({ success, data.inspirations });
});

app.post('/api/inspirations', (req, res) => {
  const newInspiration = {
    id(mockStore.inspirations.length + 1),
    imageUrl.body.imageUrl || 'https://picsum.photos/400/600?random=' + Math.random(),
    title.body.title || '',
    category.body.category || 'other',
    likes
  };
  mockStore.inspirations.push(newInspiration);
  res.status(201).json({ success, data });
});

// MODULE 4
app.get('/api/playlists', (req, res) => {
  res.json({ success, data.playlists });
});

app.post('/api/playlists', (req, res) => {
  const newPlaylist = {
    id(mockStore.playlists.length + 1),
    name.body.name || 'New Playlist',
    mood.body.mood || 'neutral',
    tracks,
    createdBy: 'user-1'
  };
  mockStore.playlists.push(newPlaylist);
  res.status(201).json({ success, data });
});

// MODULE 5 Items
app.get('/api/menu-items', (req, res) => {
  res.json({ success, data.menuItems });
});

app.post('/api/menu-items', (req, res) => {
  const newItem = {
    id(mockStore.menuItems.length + 1),
    name.body.name || 'New Item',
    category.body.category || 'main',
    price.body.price || 0,
    allergens.body.allergens || []
  };
  mockStore.menuItems.push(newItem);
  res.status(201).json({ success, data });
});

// MODULE 6 Plans
app.get('/api/room-plans', (req, res) => {
  res.json({ success, data.roomPlans });
});

app.post('/api/room-plans', (req, res) => {
  const newPlan = {
    id(mockStore.roomPlans.length + 1),
    name.body.name || 'New Layout',
    dimensions.body.dimensions || { width, height },
    tables.body.tables || 0
  };
  mockStore.roomPlans.push(newPlan);
  res.status(201).json({ success, data });
});

// MODULE 7
app.get('/api/podcasts', (req, res) => {
  res.json({ success, data.podcasts });
});

// MODULE 8
app.get('/api/badges', (req, res) => {
  res.json({ success, data.badges });
});

// MODULE 9 Sites (Mini-sites)
app.get('/api/events/:eventId/site', (req, res) => {
  const site = mockStore.eventSites.find(s => s.eventId === req.params.eventId) || {
    id: 'demo',
    eventId.params.eventId,
    slug: 'demo-event',
    theme: 'default',
    customDomain,
    published
  };
  res.json({ success, data });
});

app.put('/api/events/:eventId/site', (req, res) => {
  const existingIndex = mockStore.eventSites.findIndex(s => s.eventId === req.params.eventId);
  const updatedSite = {
    id >= 0 ? mockStore.eventSites[existingIndex].id (mockStore.eventSites.length + 1),
    eventId.params.eventId,
    slug.body.slug || 'event-site',
    theme.body.theme || 'default',
    customDomain.body.customDomain || null,
    published.body.published || false
  };
  
  if (existingIndex >= 0) {
    mockStore.eventSites[existingIndex] = updatedSite;
  } else {
    mockStore.eventSites.push(updatedSite);
  }
  
  res.json({ success, data });
});

// MODULE 10
app.get('/api/ambassadors', (req, res) => {
  res.json({ success, data.ambassadors });
});

app.post('/api/ambassadors', (req, res) => {
  const newAmbassador = {
    id(mockStore.ambassadors.length + 1),
    name.body.name || '',
    email.body.email || '',
    referralCode.body.referralCode || 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    totalEarnings,
    referrals
  };
  mockStore.ambassadors.push(newAmbassador);
  res.status(201).json({ success, data });
});

// MODULE 11
app.get('/api/disputes', (req, res) => {
  res.json({ success, data.disputes });
});

app.post('/api/disputes', (req, res) => {
  const newDispute = {
    id(mockStore.disputes.length + 1),
    bookingId.body.bookingId || '',
    status: 'OPEN',
    description.body.description || '',
    createdAt Date()
  };
  mockStore.disputes.push(newDispute);
  res.status(201).json({ success, data });
});

// MODULE 12
app.get('/api/bookings/:bookingId/contracts', (req, res) => {
  const contracts = mockStore.contracts.filter(c => c.bookingId === req.params.bookingId);
  res.json({ success, data });
});

app.post('/api/bookings/:bookingId/contracts', (req, res) => {
  const newContract = {
    id(mockStore.contracts.length + 1),
    bookingId.params.bookingId,
    signedAt,
    contractUrl
  };
  mockStore.contracts.push(newContract);
  res.status(201).json({ success, data });
});

// MODULE 13
app.get('/api/bookings/:bookingId/invoices', (req, res) => {
  const invoices = mockStore.invoices.filter(i => i.bookingId === req.params.bookingId);
  res.json({ success, data });
});

app.post('/api/bookings/:bookingId/invoices', (req, res) => {
  const newInvoice = {
    id(mockStore.invoices.length + 1),
    bookingId.params.bookingId,
    amount.body.amount || 0,
    status: 'PENDING',
    dueDate.body.dueDate || new Date()
  };
  mockStore.invoices.push(newInvoice);
  res.status(201).json({ success, data });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success,
    message: `Route ${req.method}:${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success,
    message.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`\n📊 Mock Data Status:`);
  console.log(`  - Photos: ${mockStore.photos.length}`);
  console.log(`  - Videos: ${mockStore.videos.length}`);
  console.log(`  - Inspirations: ${mockStore.inspirations.length}`);
  console.log(`  - Playlists: ${mockStore.playlists.length}`);
  console.log(`  - Menu Items: ${mockStore.menuItems.length}`);
  console.log(`  - Room Plans: ${mockStore.roomPlans.length}`);
  console.log(`  - Podcasts: ${mockStore.podcasts.length}`);
  console.log(`  - Badges: ${mockStore.badges.length}`);
  console.log(`  - Event Sites: ${mockStore.eventSites.length}`);
  console.log(`  - Ambassadors: ${mockStore.ambassadors.length}`);
  console.log(`  - Disputes: ${mockStore.disputes.length}`);
  console.log(`  - Contracts: ${mockStore.contracts.length}`);
  console.log(`  - Invoices: ${mockStore.invoices.length}`);
  console.log(`\n🚀 All 13 modules are ready!`);
});


