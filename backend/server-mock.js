const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data store
const mockStore = {
  photos: [
    { id: '1', eventId: 'event-1', url: 'https://picsum.photos/400/300?random=1', caption: 'Beautiful moment', likes: 12, createdAt: new Date() },
    { id: '2', eventId: 'event-1', url: 'https://picsum.photos/400/300?random=2', caption: 'Amazing view', likes: 8, createdAt: new Date() }
  ],
  videos: [
    { id: '1', eventId: 'event-1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Event Highlights', duration: 596, createdAt: new Date() }
  ],
  inspirations: [
    { id: '1', imageUrl: 'https://picsum.photos/400/600?random=10', title: 'Modern Decor', category: 'decoration', likes: 45 },
    { id: '2', imageUrl: 'https://picsum.photos/400/600?random=11', title: 'Elegant Setup', category: 'decoration', likes: 32 }
  ],
  playlists: [
    { id: '1', name: 'Wedding Playlist', mood: 'romantic', tracks: 25, createdBy: 'user-1' },
    { id: '2', name: 'Party Mix', mood: 'energetic', tracks: 40, createdBy: 'user-1' }
  ],
  menuItems: [
    { id: '1', name: 'Caesar Salad', category: 'starter', price: 12.50, allergens: ['gluten', 'dairy'] },
    { id: '2', name: 'Grilled Salmon', category: 'main', price: 28.00, allergens: ['fish'] }
  ],
  roomPlans: [
    { id: '1', name: 'Main Hall Layout', dimensions: { width: 20, height: 15 }, tables: 12 },
    { id: '2', name: 'Garden Setup', dimensions: { width: 30, height: 25 }, tables: 20 }
  ],
  podcasts: [
    { id: '1', title: 'Event Planning Tips', duration: 1800, url: 'https://example.com/podcast1.mp3', description: 'Tips for successful events' },
    { id: '2', title: 'Wedding Trends 2024', duration: 2400, url: 'https://example.com/podcast2.mp3', description: 'Latest wedding trends' }
  ],
  badges: [
    { id: '1', name: 'First Event', description: 'Completed your first event', points: 10 },
    { id: '2', name: 'Super Planner', description: 'Organized 10+ events', points: 50 }
  ],
  eventSites: [
    { id: '1', eventId: 'event-1', slug: 'my-wedding-2024', theme: 'elegant', customDomain: null, published: true },
    { id: '2', eventId: 'event-2', slug: 'corporate-gala', theme: 'modern', customDomain: null, published: false }
  ],
  ambassadors: [
    { id: '1', name: 'John Doe', email: 'john@example.com', referralCode: 'JOHN2024', totalEarnings: 450.00, referrals: 12 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', referralCode: 'JANE2024', totalEarnings: 320.00, referrals: 8 }
  ],
  disputes: [
    { id: '1', bookingId: 'booking-1', status: 'OPEN', description: 'Service not as described', createdAt: new Date() },
    { id: '2', bookingId: 'booking-2', status: 'RESOLVED', description: 'Late delivery', resolvedAt: new Date() }
  ],
  contracts: [
    { id: '1', bookingId: 'booking-1', signedAt: null, contractUrl: null },
    { id: '2', bookingId: 'booking-2', signedAt: new Date(), contractUrl: 'https://example.com/contract2.pdf' }
  ],
  invoices: [
    { id: '1', bookingId: 'booking-1', amount: 1500.00, status: 'PENDING', dueDate: new Date('2024-03-15') },
    { id: '2', bookingId: 'booking-2', amount: 2500.00, status: 'PAID', paidAt: new Date() }
  ]
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date() });
});

// MODULE 1: Photos
app.get('/api/events/:eventId/photos', (req, res) => {
  const photos = mockStore.photos.filter(p => p.eventId === req.params.eventId);
  res.json({ success: true, data: photos });
});

app.post('/api/events/:eventId/photos', (req, res) => {
  const newPhoto = {
    id: String(mockStore.photos.length + 1),
    eventId: req.params.eventId,
    url: req.body.url || 'https://picsum.photos/400/300?random=' + Math.random(),
    caption: req.body.caption || '',
    likes: 0,
    createdAt: new Date()
  };
  mockStore.photos.push(newPhoto);
  res.status(201).json({ success: true, data: newPhoto });
});

// MODULE 2: Videos
app.get('/api/events/:eventId/videos', (req, res) => {
  const videos = mockStore.videos.filter(v => v.eventId === req.params.eventId);
  res.json({ success: true, data: videos });
});

app.post('/api/events/:eventId/videos', (req, res) => {
  const newVideo = {
    id: String(mockStore.videos.length + 1),
    eventId: req.params.eventId,
    url: req.body.url || '',
    title: req.body.title || 'Untitled Video',
    duration: req.body.duration || 0,
    createdAt: new Date()
  };
  mockStore.videos.push(newVideo);
  res.status(201).json({ success: true, data: newVideo });
});

// MODULE 3: Inspirations
app.get('/api/inspirations', (req, res) => {
  res.json({ success: true, data: mockStore.inspirations });
});

app.post('/api/inspirations', (req, res) => {
  const newInspiration = {
    id: String(mockStore.inspirations.length + 1),
    imageUrl: req.body.imageUrl || 'https://picsum.photos/400/600?random=' + Math.random(),
    title: req.body.title || '',
    category: req.body.category || 'other',
    likes: 0
  };
  mockStore.inspirations.push(newInspiration);
  res.status(201).json({ success: true, data: newInspiration });
});

// Like inspiration
app.post('/api/inspirations/:id/like', (req, res) => {
  const inspiration = mockStore.inspirations.find(i => i.id === req.params.id);
  if (inspiration) {
    inspiration.likes += 1;
    res.json({ success: true, data: inspiration });
  } else {
    res.status(404).json({ success: false, message: 'Inspiration not found' });
  }
});

// MODULE 4: Playlists
app.get('/api/playlists', (req, res) => {
  res.json({ success: true, data: mockStore.playlists });
});

app.post('/api/playlists', (req, res) => {
  const newPlaylist = {
    id: String(mockStore.playlists.length + 1),
    name: req.body.name || 'New Playlist',
    mood: req.body.mood || 'neutral',
    tracks: 0,
    createdBy: 'user-1'
  };
  mockStore.playlists.push(newPlaylist);
  res.status(201).json({ success: true, data: newPlaylist });
});

app.get('/api/playlists/:id', (req, res) => {
  const playlist = mockStore.playlists.find(p => p.id === req.params.id);
  if (playlist) {
    res.json({ success: true, data: playlist });
  } else {
    res.status(404).json({ success: false, message: 'Playlist not found' });
  }
});

// MODULE 5: Menu Items
app.get('/api/menu-items', (req, res) => {
  res.json({ success: true, data: mockStore.menuItems });
});

app.post('/api/menu-items', (req, res) => {
  const newItem = {
    id: String(mockStore.menuItems.length + 1),
    name: req.body.name || 'New Item',
    category: req.body.category || 'main',
    price: req.body.price || 0,
    allergens: req.body.allergens || []
  };
  mockStore.menuItems.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/menu-items/:id', (req, res) => {
  const item = mockStore.menuItems.find(m => m.id === req.params.id);
  if (item) {
    Object.assign(item, req.body);
    res.json({ success: true, data: item });
  } else {
    res.status(404).json({ success: false, message: 'Menu item not found' });
  }
});

app.delete('/api/menu-items/:id', (req, res) => {
  const index = mockStore.menuItems.findIndex(m => m.id === req.params.id);
  if (index > -1) {
    mockStore.menuItems.splice(index, 1);
    res.json({ success: true, message: 'Menu item deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Menu item not found' });
  }
});

// MODULE 6: Room Plans
app.get('/api/room-plans', (req, res) => {
  res.json({ success: true, data: mockStore.roomPlans });
});

app.post('/api/room-plans', (req, res) => {
  const newPlan = {
    id: String(mockStore.roomPlans.length + 1),
    name: req.body.name || 'New Layout',
    dimensions: req.body.dimensions || { width: 10, height: 10 },
    tables: req.body.tables || 0
  };
  mockStore.roomPlans.push(newPlan);
  res.status(201).json({ success: true, data: newPlan });
});

// MODULE 7: Podcasts
app.get('/api/podcasts', (req, res) => {
  res.json({ success: true, data: mockStore.podcasts });
});

// MODULE 8: Badges
app.get('/api/badges', (req, res) => {
  res.json({ success: true, data: mockStore.badges });
});

// MODULE 9: Event Sites (Mini-sites)
app.get('/api/events/:eventId/site', (req, res) => {
  const site = mockStore.eventSites.find(s => s.eventId === req.params.eventId) || {
    id: 'demo',
    eventId: req.params.eventId,
    slug: 'demo-event',
    theme: 'default',
    customDomain: null,
    published: false
  };
  res.json({ success: true, data: site });
});

app.put('/api/events/:eventId/site', (req, res) => {
  const existingIndex = mockStore.eventSites.findIndex(s => s.eventId === req.params.eventId);
  const updatedSite = {
    id: existingIndex >= 0 ? mockStore.eventSites[existingIndex].id : String(mockStore.eventSites.length + 1),
    eventId: req.params.eventId,
    slug: req.body.slug || 'event-site',
    theme: req.body.theme || 'default',
    customDomain: req.body.customDomain || null,
    published: req.body.published || false
  };
  
  if (existingIndex >= 0) {
    mockStore.eventSites[existingIndex] = updatedSite;
  } else {
    mockStore.eventSites.push(updatedSite);
  }
  
  res.json({ success: true, data: updatedSite });
});

// MODULE 10: Ambassadors
app.get('/api/ambassadors', (req, res) => {
  res.json({ success: true, data: mockStore.ambassadors });
});

app.post('/api/ambassadors', (req, res) => {
  const newAmbassador = {
    id: String(mockStore.ambassadors.length + 1),
    name: req.body.name || '',
    email: req.body.email || '',
    referralCode: req.body.referralCode || 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    totalEarnings: 0,
    referrals: 0
  };
  mockStore.ambassadors.push(newAmbassador);
  res.status(201).json({ success: true, data: newAmbassador });
});

app.get('/api/ambassadors/:id', (req, res) => {
  const ambassador = mockStore.ambassadors.find(a => a.id === req.params.id);
  if (ambassador) {
    res.json({ success: true, data: ambassador });
  } else {
    res.status(404).json({ success: false, message: 'Ambassador not found' });
  }
});

// MODULE 11: Disputes
app.get('/api/disputes', (req, res) => {
  res.json({ success: true, data: mockStore.disputes });
});

app.post('/api/disputes', (req, res) => {
  const newDispute = {
    id: String(mockStore.disputes.length + 1),
    bookingId: req.body.bookingId || '',
    status: 'OPEN',
    description: req.body.description || '',
    createdAt: new Date()
  };
  mockStore.disputes.push(newDispute);
  res.status(201).json({ success: true, data: newDispute });
});

app.get('/api/disputes/:id', (req, res) => {
  const dispute = mockStore.disputes.find(d => d.id === req.params.id);
  if (dispute) {
    res.json({ success: true, data: dispute });
  } else {
    res.status(404).json({ success: false, message: 'Dispute not found' });
  }
});

app.put('/api/disputes/:id', (req, res) => {
  const dispute = mockStore.disputes.find(d => d.id === req.params.id);
  if (dispute) {
    Object.assign(dispute, req.body);
    if (req.body.status === 'RESOLVED' && !dispute.resolvedAt) {
      dispute.resolvedAt = new Date();
    }
    res.json({ success: true, data: dispute });
  } else {
    res.status(404).json({ success: false, message: 'Dispute not found' });
  }
});

// MODULE 12: Contracts
app.get('/api/bookings/:bookingId/contracts', (req, res) => {
  const contracts = mockStore.contracts.filter(c => c.bookingId === req.params.bookingId);
  res.json({ success: true, data: contracts });
});

app.post('/api/bookings/:bookingId/contracts', (req, res) => {
  const newContract = {
    id: String(mockStore.contracts.length + 1),
    bookingId: req.params.bookingId,
    signedAt: null,
    contractUrl: null
  };
  mockStore.contracts.push(newContract);
  res.status(201).json({ success: true, data: newContract });
});

app.get('/api/contracts/:id', (req, res) => {
  const contract = mockStore.contracts.find(c => c.id === req.params.id);
  if (contract) {
    res.json({ success: true, data: contract });
  } else {
    res.status(404).json({ success: false, message: 'Contract not found' });
  }
});

app.put('/api/contracts/:id/sign', (req, res) => {
  const contract = mockStore.contracts.find(c => c.id === req.params.id);
  if (contract) {
    contract.signedAt = new Date();
    contract.contractUrl = req.body.contractUrl || `https://example.com/contract-${contract.id}.pdf`;
    res.json({ success: true, data: contract });
  } else {
    res.status(404).json({ success: false, message: 'Contract not found' });
  }
});

// MODULE 13: Invoices
app.get('/api/bookings/:bookingId/invoices', (req, res) => {
  const invoices = mockStore.invoices.filter(i => i.bookingId === req.params.bookingId);
  res.json({ success: true, data: invoices });
});

app.post('/api/bookings/:bookingId/invoices', (req, res) => {
  const newInvoice = {
    id: String(mockStore.invoices.length + 1),
    bookingId: req.params.bookingId,
    amount: req.body.amount || 0,
    status: 'PENDING',
    dueDate: req.body.dueDate || new Date()
  };
  mockStore.invoices.push(newInvoice);
  res.status(201).json({ success: true, data: newInvoice });
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = mockStore.invoices.find(i => i.id === req.params.id);
  if (invoice) {
    res.json({ success: true, data: invoice });
  } else {
    res.status(404).json({ success: false, message: 'Invoice not found' });
  }
});

app.put('/api/invoices/:id', (req, res) => {
  const invoice = mockStore.invoices.find(i => i.id === req.params.id);
  if (invoice) {
    Object.assign(invoice, req.body);
    if (req.body.status === 'PAID' && !invoice.paidAt) {
      invoice.paidAt = new Date();
    }
    res.json({ success: true, data: invoice });
  } else {
    res.status(404).json({ success: false, message: 'Invoice not found' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method}:${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
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

module.exports = app;
