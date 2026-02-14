#!/bin/bash

echo "🧪 Testing All 13 Modules"
echo "=========================="
echo ""

# Module 1: Photos
echo "1️⃣ MODULE PHOTOS"
echo "GET /api/events/event-1/photos"
curl -s http://localhost:3001/api/events/event-1/photos | jq '.success, .data | length'
echo ""

# Module 2: Videos
echo "2️⃣ MODULE VIDEOS"
echo "GET /api/events/event-1/videos"
curl -s http://localhost:3001/api/events/event-1/videos | jq '.success, .data | length'
echo ""

# Module 3: Inspirations
echo "3️⃣ MODULE INSPIRATIONS"
echo "GET /api/inspirations"
curl -s http://localhost:3001/api/inspirations | jq '.success, .data | length'
echo ""

# Module 4: Playlists
echo "4️⃣ MODULE PLAYLISTS"
echo "GET /api/playlists"
curl -s http://localhost:3001/api/playlists | jq '.success, .data | length'
echo ""

# Module 5: Menu Items
echo "5️⃣ MODULE MENU ITEMS"
echo "GET /api/menu-items"
curl -s http://localhost:3001/api/menu-items | jq '.success, .data | length'
echo ""

# Module 6: Room Plans
echo "6️⃣ MODULE ROOM PLANS"
echo "GET /api/room-plans"
curl -s http://localhost:3001/api/room-plans | jq '.success, .data | length'
echo ""

# Module 7: Podcasts
echo "7️⃣ MODULE PODCASTS"
echo "GET /api/podcasts"
curl -s http://localhost:3001/api/podcasts | jq '.success, .data | length'
echo ""

# Module 8: Badges
echo "8️⃣ MODULE BADGES"
echo "GET /api/badges"
curl -s http://localhost:3001/api/badges | jq '.success, .data | length'
echo ""

# Module 9: Mini-sites
echo "9️⃣ MODULE MINI-SITES"
echo "GET /api/events/demo-event-id/site"
curl -s http://localhost:3001/api/events/demo-event-id/site | jq '.success, .data.slug'
echo ""

# Module 10: Ambassadors
echo "🔟 MODULE AMBASSADORS"
echo "GET /api/ambassadors"
curl -s http://localhost:3001/api/ambassadors | jq '.success, .data | length'
echo ""

# Module 11: Disputes
echo "1️⃣1️⃣ MODULE DISPUTES"
echo "GET /api/disputes"
curl -s http://localhost:3001/api/disputes | jq '.success, .data | length'
echo ""

# Module 12: Contracts
echo "1️⃣2️⃣ MODULE CONTRACTS"
echo "GET /api/bookings/booking-1/contracts"
curl -s http://localhost:3001/api/bookings/booking-1/contracts | jq '.success, .data | length'
echo ""

# Module 13: Invoices
echo "1️⃣3️⃣ MODULE INVOICES"
echo "GET /api/bookings/booking-1/invoices"
curl -s http://localhost:3001/api/bookings/booking-1/invoices | jq '.success, .data | length'
echo ""

echo "=========================="
echo "✅ All 13 modules tested!"
