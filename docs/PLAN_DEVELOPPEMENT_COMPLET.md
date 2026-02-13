# 📋 PLAN DE DÉVELOPPEMENT COMPLET - WE EVENT PHASES 5 & 6 + NOTATION MUTUELLE

**Date d'analyse :** 2026-02-13  
**Dernière mise à jour :** 2026-02-13 (Ajout système notation mutuelle)  
**Branche de travail :** `we-event-test-robin`  
**Durée estimée :** 9-13 semaines (+1 semaine pour notation mutuelle)  
**Document source :** `cahier-des-charges-phases-5-6.docx`

---

## 🎯 RÉSUMÉ EXÉCUTIF

### Objectif Global
Transformer la MVP We Event actuellement basée sur des données mockées en une plateforme événementielle complète et fonctionnelle, connectée à un backend persistant.

### Chiffres Clés
- **33 entités** de base de données à créer/adapter (+1 pour `partner_ratings`)
- **46 modules** (pages) à développer (+3 pour notations)
- **4 espaces** distincts (Public, Client, Partenaire, Admin)
- **3 types d'utilisateurs** (Client, Partenaire, Administrateur)

### 🆕 Nouvelle Fonctionnalité : Notation Mutuelle
- **Partenaires → Clients** : Noter les clients après événement
- **Partenaires → Partenaires** : Se noter mutuellement après collaboration
- **Critères détaillés** : Professionnalisme, communication, ponctualité, qualité
- **Badges automatiques** : "Client fiable", "Excellent collaborateur"
- **📄 Documentation complète :** `docs/ADDENDUM_NOTATION_MUTUELLE.md`

### État Actuel vs. État Cible

| Aspect | État Actuel | État Cible (Phases 5 & 6) |
|--------|-------------|--------------------------|
| **Frontend** | React + TypeScript ✅ | React + TypeScript ✅ |
| **Données** | Mockées (statiques) ❌ | Backend persistant ✅ |
| **Authentification** | Redux + JWT ✅ | À conserver ✅ |
| **API** | api-staging.we-event.eu ✅ | À étendre ✅ |
| **Base de données** | PostgreSQL (Staging) ✅ | À étendre avec nouvelles tables ✅ |
| **Fichiers** | Basique ❌ | Upload/Download complet ✅ |

---

## 🏗️ ARCHITECTURE ET STACK TECHNIQUE

### Stack Actuel (Fonctionnel)
```
Frontend:
├── React 19.1.1
├── TypeScript 5.8.3
├── Vite 7.1.2
├── TailwindCSS 4.1.12
├── Redux Toolkit (état global)
├── Framer Motion (animations)
├── Axios (requêtes HTTP)
└── Lucide React (icônes)

Backend (Staging):
├── Node.js + Express
├── PostgreSQL (EC2: 54.154.49.156:5432)
├── API: https://api-staging.we-event.eu/api
└── Authentification: JWT

Déploiement:
├── Frontend: Sandbox (5174-...-sandbox.novita.ai)
└── Production: app.we-event.eu (S3 + CloudFront)
```

### Stack Cible (Cahier des Charges)
```
Le cahier des charges mentionne Base44 BaaS, mais nous allons :
✅ CONSERVER notre stack actuelle (Node.js + PostgreSQL)
✅ ADAPTER les concepts Base44 vers notre API
✅ CRÉER une couche d'abstraction compatible
```

### Stratégie d'Adaptation

**Base44 SDK → Notre API**
```typescript
// Au lieu de :
// base44.entities.Event.list()

// Nous utiliserons :
import { apiClient } from '@/utils/api-client';
apiClient.events.list()

// Avec une couche d'abstraction qui imite Base44
```

---

## 📊 ANALYSE DES ENTITÉS (32 ENTITÉS)

### 1. Entités Existantes (Partielles)

#### ✅ User (À Étendre)
**État actuel :** Redux `login.data` contient `{id, email, role}`  
**À ajouter :**
- `full_name: string`
- `profile_picture_url: string`
- `phone_number: string`
- `address: string`
- `event_preferences: object`

**Tables BD :** `users` (existe probablement)

---

#### ✅ Partner (Partiellement via BusinessProfile)
**État actuel :** Données fake dans `fakePartnerDetails.ts`  
**À remplacer par :** Vraie entité Partner en BD

**Attributs requis :**
```typescript
interface Partner {
  id: string;
  user_email: string; // Lien vers User
  company_name: string;
  category: 'Photo/Vidéo' | 'DJ' | 'Lieu' | 'Traiteur' | 'Décoration' | 'Son/Lumière' | 'Animation' | 'Autre';
  description: string;
  location: string;
  phone: string;
  website: string;
  rating: number; // default: 0
  reviews_count: number; // default: 0
  events_count: number; // default: 0
  subscription: 'Basic' | 'Standard' | 'Premium'; // default: Basic
  status: 'pending' | 'active' | 'suspended'; // default: pending
  verified: boolean; // default: false
  gamification_points: number; // default: 0
  portfolio_images: string[]; // URLs
  social_links: object; // {facebook, instagram, etc.}
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `partners` (à créer/adapter)

---

### 2. Entités À Créer (27 Nouvelles Entités)

#### 🆕 Event (Événements Clients)
**Priorité :** 🔴 HAUTE (Fondamental)

```typescript
interface Event {
  id: string;
  title: string;
  event_type: 'Mariage' | 'Anniversaire' | 'Corporate' | 'Gala' | 'Autre';
  event_date: Date;
  location: string;
  city: string;
  department: string;
  guests_count: number;
  guests_confirmed: number; // default: 0
  budget: number;
  status: 'draft' | 'planning' | 'confirmed' | 'completed' | 'cancelled'; // default: draft
  mini_site_slug: string;
  mini_site_published: boolean; // default: false
  client_id: string; // Lien vers User
  partner_ids: string[]; // Liens vers Partner
  created_date: datetime;
  updated_date: datetime;
  created_by: string; // Email du créateur
}
```

**Tables BD :** `events`

**Endpoints API à créer :**
- `GET /api/events` - Liste des événements
- `GET /api/events/:id` - Détails d'un événement
- `POST /api/events` - Créer un événement
- `PUT /api/events/:id` - Modifier un événement
- `DELETE /api/events/:id` - Supprimer un événement
- `GET /api/events/client/:clientId` - Événements d'un client
- `GET /api/events/partner/:partnerId` - Événements d'un partenaire

---

#### 🆕 Package (Offres de Services)
**Priorité :** 🔴 HAUTE

```typescript
interface Package {
  id: string;
  partner_id: string; // Lien vers Partner
  name: string;
  description: string;
  category: string;
  price: number;
  price_unit: 'forfait' | 'par_personne' | 'par_heure' | 'par_jour'; // default: forfait
  features: string[]; // Prestations incluses
  images: string[]; // URLs des images
  status: 'draft' | 'pending' | 'approved' | 'rejected'; // default: draft
  sales_count: number; // default: 0
  revenue: number; // default: 0
  created_date: datetime;
  updated_date: datetime;
  created_by: string;
}
```

**Tables BD :** `packages`

**Endpoints API :**
- `GET /api/packages` - Liste des packages
- `GET /api/packages/:id` - Détails d'un package
- `POST /api/packages` - Créer un package
- `PUT /api/packages/:id` - Modifier un package
- `DELETE /api/packages/:id` - Supprimer un package
- `GET /api/packages/partner/:partnerId` - Packages d'un partenaire
- `GET /api/packages/status/:status` - Packages par statut (admin)
- `PUT /api/packages/:id/approve` - Approuver un package (admin)
- `PUT /api/packages/:id/reject` - Rejeter un package (admin)

---

#### 🆕 Booking (Réservations)
**Priorité :** 🔴 HAUTE

```typescript
interface Booking {
  id: string;
  event_id: string; // Lien vers Event
  package_id: string; // Lien vers Package
  partner_id: string; // Lien vers Partner
  client_email: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // default: pending
  payment_status: 'unpaid' | 'partial' | 'paid'; // default: unpaid
  notes: string;
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `bookings`

**Endpoints API :**
- `GET /api/bookings` - Liste des réservations
- `GET /api/bookings/:id` - Détails d'une réservation
- `POST /api/bookings` - Créer une réservation
- `PUT /api/bookings/:id` - Modifier une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation
- `GET /api/bookings/event/:eventId` - Réservations d'un événement
- `GET /api/bookings/partner/:partnerId` - Réservations d'un partenaire
- `GET /api/bookings/client/:clientEmail` - Réservations d'un client

---

#### 🆕 Message & Conversation
**Priorité :** 🔴 HAUTE (Communication essentielle)

```typescript
interface Conversation {
  id: string;
  client_email: string;
  partner_id: string; // Lien vers Partner
  event_id: string; // Lien vers Event
  last_message: string;
  last_message_date: datetime;
  unread_count: number; // default: 0
  status: 'active' | 'archived'; // default: active
  created_date: datetime;
  updated_date: datetime;
}

interface Message {
  id: string;
  conversation_id: string; // Lien vers Conversation
  sender_email: string;
  sender_name: string;
  content: string;
  attachments: string[]; // URLs des fichiers joints
  read: boolean; // default: false
  created_date: datetime;
}
```

**Tables BD :** `conversations`, `messages`

**Endpoints API :**
- `GET /api/conversations` - Liste des conversations
- `GET /api/conversations/:id` - Détails + messages
- `POST /api/conversations` - Créer une conversation
- `GET /api/conversations/user/:userEmail` - Conversations d'un utilisateur
- `POST /api/messages` - Envoyer un message
- `PUT /api/messages/:id/read` - Marquer comme lu
- **WebSocket :** Temps réel pour les nouveaux messages

---

#### 🆕 Photo & Video
**Priorité :** 🟡 MOYENNE

```typescript
interface Photo {
  id: string;
  event_id: string; // Lien vers Event
  url: string; // URL de la photo stockée
  uploader_email: string;
  uploader_name: string;
  type: 'pro' | 'guest'; // Professionnel ou invité
  category: 'cérémonie' | 'réception' | 'soirée' | 'décoration' | 'portraits' | 'groupe' | 'autre';
  likes: number; // default: 0
  liked_by: string[]; // Emails des utilisateurs
  created_date: datetime;
}

interface Video {
  id: string;
  event_id: string;
  title: string;
  url: string; // URL de la vidéo
  thumbnail: string; // URL miniature
  uploader_email: string;
  uploader_name: string;
  type: 'pro' | 'guest';
  duration: string; // Format: MM:SS
  status: 'draft' | 'review' | 'approved' | 'published'; // default: draft
  created_date: datetime;
}

interface VideoComment {
  id: string;
  video_id: string; // Lien vers Video
  author_email: string;
  author_name: string;
  timecode: number; // Position en ms
  selection_start: number; // Début sélection en ms
  selection_end: number; // Fin sélection en ms
  text: string;
  created_date: datetime;
}
```

**Tables BD :** `photos`, `videos`, `video_comments`

---

#### 🆕 Contract & Invoice
**Priorité :** 🟡 MOYENNE

```typescript
interface Contract {
  id: string;
  booking_id: string; // Lien vers Booking
  contract_number: string;
  client_email: string;
  partner_id: string;
  service: string;
  amount: number;
  content: string; // HTML ou texte du contrat
  status: 'draft' | 'pending' | 'signed' | 'cancelled'; // default: draft
  signed_date: datetime | null;
  signature_data: string; // Base64 de la signature
  signer_name: string;
  signer_ip: string;
  created_date: datetime;
  updated_date: datetime;
}

interface Invoice {
  id: string;
  booking_id: string;
  invoice_number: string;
  client_email: string;
  partner_id: string;
  provider_name: string;
  service: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'; // default: pending
  due_date: Date;
  paid_date: Date | null;
  stripe_payment_intent_id: string; // ID Stripe
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `contracts`, `invoices`

---

#### 🆕 Task
**Priorité :** 🟡 MOYENNE

```typescript
interface Task {
  id: string;
  event_id: string; // Lien vers Event
  assigned_to_email: string;
  title: string;
  description: string;
  due_date: Date;
  priority: 'low' | 'medium' | 'high'; // default: medium
  status: 'todo' | 'in_progress' | 'done'; // default: todo
  category: string;
  created_date: datetime;
  updated_date: datetime;
  created_by: string;
}
```

**Tables BD :** `tasks`

---

#### 🆕 Playlist
**Priorité :** 🟢 BASSE

```typescript
interface Playlist {
  id: string;
  event_id: string;
  name: string;
  songs: {
    title: string;
    artist: string;
    duration: string;
    moment: string; // Ex: "Ouverture de bal", "Dîner"
  }[];
  avoid_songs: string[]; // Titres à éviter
  mood: string; // Ambiance générale
  dj_partner_id: string; // Lien vers Partner DJ
  status: 'draft' | 'shared' | 'confirmed'; // default: draft
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `playlists`

---

#### 🆕 MenuItem & GuestMenuChoice
**Priorité :** 🟢 BASSE

```typescript
interface MenuItem {
  id: string;
  event_id: string;
  name: string;
  category: 'entrée' | 'plat' | 'dessert' | 'boisson' | 'autre';
  description: string;
  allergens: string[];
  dietary_tags: string[]; // ['végétarien', 'vegan', 'sans gluten', 'halal', 'casher']
  price_per_person: number;
  available: boolean; // default: true
  created_date: datetime;
}

interface GuestMenuChoice {
  id: string;
  event_id: string;
  guest_name: string;
  guest_email: string;
  starter_id: string; // Lien vers MenuItem
  main_course_id: string; // Lien vers MenuItem
  dessert_id: string; // Lien vers MenuItem
  allergies: string;
  special_requests: string;
  table_number: number;
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `menu_items`, `guest_menu_choices`

---

#### 🆕 Inspiration, Category, Trend, UserInspiration
**Priorité :** 🟡 MOYENNE

```typescript
interface Inspiration {
  id: string;
  title: string;
  image_url: string;
  category: string; // Lien vers Category
  theme: string;
  tags: string[];
  photographer_id: string; // Lien vers Partner
  photographer_name: string;
  partners: {
    id: string;
    name: string;
    type: string;
  }[];
  likes: number; // default: 0
  views: number; // default: 0
  status: 'draft' | 'published'; // default: draft
  created_date: datetime;
  updated_date: datetime;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number; // default: 0
  active: boolean; // default: true
  order: number;
}

interface Trend {
  id: string;
  name: string;
  icon: string; // Emoji ou nom icône
  active: boolean; // default: true
  order: number;
}

interface UserInspiration {
  id: string;
  user_email: string;
  event_id: string;
  inspiration_id: string; // Lien vers Inspiration
  created_date: datetime;
}
```

**Tables BD :** `inspirations`, `categories`, `trends`, `user_inspirations`

---

#### 🆕 Podcast
**Priorité :** 🟢 BASSE

```typescript
interface Podcast {
  id: string;
  title: string;
  description: string;
  provider: string;
  type: 'podcast' | 'talkshow';
  audio_url: string;
  cover_emoji: string;
  duration: string; // Format: HH:MM:SS
  theme: 'Mariage' | 'Témoignages' | 'Conseils Pro' | 'Tendances' | 'Organisation' | 'Budget' | 'Décoration' | 'Autre';
  listens: number; // default: 0
  rating: number; // default: 0
  ratings_count: number; // default: 0
  status: 'draft' | 'published'; // default: draft
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `podcasts`

---

#### 🆕 EventSite (Mini-sites)
**Priorité :** 🟡 MOYENNE

```typescript
interface EventSite {
  id: string;
  event_id: string; // Lien vers Event
  slug: string; // URL unique
  title: string;
  cover_image: string;
  welcome_message: string;
  modules: {
    guestBook: boolean;
    guestBookText: boolean;
    guestBookAudio: boolean;
    guestBookVideo: boolean;
    crowdfunding: boolean;
    photoVideo: boolean;
    menuChoice: boolean;
    schedule: boolean;
  };
  crowdfunding_url: string;
  theme: 'elegant' | 'romantic' | 'modern' | 'boheme'; // default: elegant
  primary_color: string; // default: #1e3a5f
  schedule: {
    time: string;
    title: string;
    location: string;
  }[];
  published: boolean; // default: false
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `event_sites`

---

#### 🆕 Ambassador
**Priorité :** 🟢 BASSE (Admin uniquement)

```typescript
interface Ambassador {
  id: string;
  partner_id: string; // Lien vers Partner
  user_email: string;
  name: string;
  zone: string;
  departments: string; // CSV des départements couverts
  partners_recruited: number; // default: 0
  commission_earned: number; // default: 0
  commission_rate: number; // default: 10
  status: 'active' | 'inactive'; // default: active
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `ambassadors`

---

#### 🆕 Badge & PartnerBadge (Gamification)
**Priorité :** 🟢 BASSE

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Nom icône Lucide React
  criteria: string; // Critères d'obtention
  points_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // default: common
  active: boolean; // default: true
  created_date: datetime;
}

interface PartnerBadge {
  id: string;
  partner_id: string; // Lien vers Partner
  badge_id: string; // Lien vers Badge
  earned_date: datetime;
}
```

**Tables BD :** `badges`, `partner_badges`

---

#### 🆕 Dispute
**Priorité :** 🟢 BASSE (Admin)

```typescript
interface Dispute {
  id: string;
  booking_id: string; // Lien vers Booking
  client_email: string;
  client_name: string;
  partner_id: string;
  partner_name: string;
  reason: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed'; // default: open
  resolution: string;
  resolved_date: datetime | null;
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `disputes`

---

#### 🆕 PlatformConfig
**Priorité :** 🟡 MOYENNE (Admin)

```typescript
interface PlatformConfig {
  id: string;
  config_key: string; // Clé unique (ex: 'main_config')
  platform_name: string;
  support_email: string;
  support_phone: string;
  platform_commission: number; // default: 15
  ambassador_commission: number; // default: 10
  notifications: {
    new_partners: boolean;
    disputes: boolean;
    packages_pending: boolean;
  };
  security: {
    require_2fa_admin: boolean;
    require_email_verification: boolean;
  };
  updated_date: datetime;
}
```

**Tables BD :** `platform_config`

---

#### 🆕 RoomPlan (Plans de Salle)
**Priorité :** 🟢 BASSE

```typescript
interface RoomPlan {
  id: string;
  name: string;
  width: number;
  length: number;
  capacity: number;
  floor_material: string;
  wall_material: string;
  elements: {
    type: string; // 'table', 'bar', 'stage', etc.
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    properties: object;
  }[];
  created_date: datetime;
  updated_date: datetime;
  created_by: string;
}
```

**Tables BD :** `room_plans`

---

#### 🆕 AdvantageConfig
**Priorité :** 🟢 BASSE

```typescript
interface AdvantageConfig {
  id: string;
  link: string;
  description: string;
  created_date: datetime;
  updated_date: datetime;
}
```

**Tables BD :** `advantage_configs`

---

## 🗺️ PLAN DE DÉVELOPPEMENT PAR PHASES

### PHASE 0 : PRÉPARATION (1 semaine)
**Objectif :** Mettre en place l'infrastructure de base

#### Tâches :
1. **Analyse de l'existant**
   - ✅ Cahier des charges lu et analysé
   - [ ] Audit complet du code actuel
   - [ ] Identification des composants réutilisables
   - [ ] Documentation de l'architecture actuelle

2. **Couche d'abstraction API**
   - [ ] Créer `src/api/api-client.ts` (abstraction compatible Base44)
   - [ ] Créer `src/types/entities.ts` (tous les types TypeScript)
   - [ ] Configurer Axios avec intercepteurs
   - [ ] Gestion centralisée des erreurs

3. **Structure de dossiers**
   ```
   src/
   ├── api/                    # Couche API
   │   ├── api-client.ts      # Client API principal
   │   ├── endpoints/         # Endpoints par entité
   │   └── hooks/             # React Query hooks
   ├── types/                 # Types TypeScript
   │   ├── entities.ts        # Toutes les entités
   │   └── api.ts             # Types de réponses API
   ├── pages/                 # Pages par rôle
   │   ├── public/            # Pages publiques
   │   ├── client/            # Pages clients
   │   ├── partner/           # Pages partenaires
   │   └── admin/             # Pages admin
   ├── components/            # Composants réutilisables
   │   ├── common/            # Composants communs
   │   ├── client/            # Composants clients
   │   ├── partner/           # Composants partenaires
   │   └── admin/             # Composants admin
   ├── hooks/                 # Custom hooks
   ├── utils/                 # Utilitaires
   └── stores/                # Redux stores
   ```

4. **Configuration Backend**
   - [ ] Schémas de base de données (SQL)
   - [ ] Scripts de migration
   - [ ] Seeds de données de test
   - [ ] Documentation API (Swagger/OpenAPI)

---

### PHASE 1 : FONDATIONS (2 semaines)
**Priorité :** 🔴 CRITIQUE  
**Objectif :** Mettre en place les entités de base et l'authentification

#### Semaine 1.1 : Entités Fondamentales

**Backend :**
- [ ] Créer table `events` + endpoints
- [ ] Créer table `partners` (remplacer fake data)
- [ ] Étendre table `users`
- [ ] Créer table `packages` + endpoints
- [ ] Créer table `bookings` + endpoints

**Frontend :**
- [ ] Types TypeScript pour Event, Partner, Package, Booking
- [ ] API hooks avec React Query
- [ ] Composants de base (EventCard, PackageCard, etc.)

**Tests :**
- [ ] Tests unitaires des endpoints
- [ ] Tests d'intégration des flux de base

#### Semaine 1.2 : Authentification & Autorisation

**Backend :**
- [ ] Middleware de vérification de rôle
- [ ] Protection des routes sensibles
- [ ] Gestion des permissions par entité

**Frontend :**
- [ ] Adapter `ProtectedRoute.tsx` pour gérer les nouveaux rôles
- [ ] Composant `<AuthGuard>` réutilisable
- [ ] Redirection automatique selon le rôle
- [ ] Gestion du state utilisateur avec React Query

**Documentation :**
- [ ] Guide d'authentification
- [ ] Matrice des permissions

---

### PHASE 2 : MODULES CLIENT (4 semaines)
**Priorité :** 🔴 HAUTE  
**Objectif :** Créer tous les modules pour les clients

#### Semaine 2.1 : Dashboard Client & Événements

**Backend :**
- [ ] Endpoint `GET /api/events/client/:clientId`
- [ ] Endpoint `GET /api/events/:id/summary` (stats)
- [ ] Endpoint `PUT /api/events/:id` (modification)

**Frontend :**
- [ ] Page `ClientDashboard.tsx`
- [ ] Composant `EventSummary.tsx`
- [ ] Composant `QuickActions.tsx`
- [ ] Composant `UpcomingTasks.tsx`
- [ ] Connexion aux vraies données Event

**Features :**
- ✅ Aperçu de l'événement en cours
- ✅ Statut, date, localisation, invités
- ✅ Liste des tâches en cours
- ✅ Réservations confirmées
- ✅ Factures à payer

#### Semaine 2.2 : Messages & Communication

**Backend :**
- [ ] Tables `conversations` + `messages`
- [ ] Endpoints CRUD complets
- [ ] WebSocket pour temps réel (Socket.io)
- [ ] Upload de fichiers joints

**Frontend :**
- [ ] Page `ClientMessages.tsx`
- [ ] Composant `ConversationList.tsx`
- [ ] Composant `MessageThread.tsx`
- [ ] Composant `MessageInput.tsx` (avec upload)
- [ ] Hook `useRealtimeMessages()` (WebSocket)

**Features :**
- ✅ Liste des conversations
- ✅ Vue détaillée avec historique
- ✅ Envoi de messages temps réel
- ✅ Pièces jointes
- ✅ Notifications de nouveaux messages

#### Semaine 2.3 : Photos & Vidéos

**Backend :**
- [ ] Tables `photos` + `videos` + `video_comments`
- [ ] Upload sécurisé (Multer + S3/local)
- [ ] Génération de miniatures
- [ ] Endpoints likes/comments

**Frontend :**
- [ ] Page `ClientPhotos.tsx`
- [ ] Page `ClientVideos.tsx`
- [ ] Composant `PhotoGallery.tsx` (lightbox)
- [ ] Composant `VideoPlayer.tsx` (avec timecode)
- [ ] Composant `VideoComments.tsx`
- [ ] Hook `useFileUpload()` (upload avec progression)

**Features :**
- ✅ Galerie de photos avec filtres
- ✅ Lien de collecte pour invités
- ✅ Upload de photos/vidéos
- ✅ Likes sur les photos
- ✅ Player vidéo avec commentaires horodatés

#### Semaine 2.4 : Inspiration & Autres Modules

**Backend :**
- [ ] Tables `inspirations`, `categories`, `trends`, `user_inspirations`
- [ ] Endpoints de gestion
- [ ] Système de likes/favoris

**Frontend :**
- [ ] Page `ClientInspiration.tsx`
- [ ] Composant `InspirationGallery.tsx`
- [ ] Composant `Moodboard.tsx` (inspirations sauvegardées)
- [ ] Page `ClientPlaylist.tsx`
- [ ] Page `ClientCatering.tsx`
- [ ] Page `ClientFloorPlan.tsx` (basique)

**Features :**
- ✅ Galerie d'inspiration avec filtres
- ✅ Moodboard personnel
- ✅ Gestion de playlist DJ
- ✅ Gestion du menu

---

### PHASE 3 : MODULES PARTENAIRE (3.5 semaines)
**Priorité :** 🟡 MOYENNE  
**Objectif :** Créer tous les modules pour les partenaires + Système de notation mutuelle

#### Semaine 3.1 : Dashboard Partenaire & Packages

**Backend :**
- [ ] Endpoints stats partenaire
- [ ] Gestion complète des packages
- [ ] Workflow d'approbation (pending → approved)

**Frontend :**
- [ ] Page `PartnerDashboard.tsx`
- [ ] Composant `PartnerStats.tsx`
- [ ] Page `PartnerMarketplace.tsx`
- [ ] Page `PartnerBundleCreation.tsx`
- [ ] Formulaire de création de packages

**Features :**
- ✅ Dashboard avec stats (events, rating, reviews)
- ✅ Création/édition de packages
- ✅ Gestion des prix et prestations
- ✅ Upload d'images
- ✅ Soumission pour validation

#### Semaine 3.2 : Calendrier & Galerie

**Backend :**
- [ ] Endpoint `GET /api/bookings/partner/:partnerId/calendar`
- [ ] Gestion des disponibilités

**Frontend :**
- [ ] Page `PartnerCalendar.tsx`
- [ ] Composant `BookingCalendar.tsx` (vue mois/semaine)
- [ ] Page `PartnerGallery.tsx`
- [ ] Upload de portfolio

**Features :**
- ✅ Calendrier des réservations
- ✅ Gestion des disponibilités
- ✅ Portfolio de photos/vidéos
- ✅ Upload de nouvelles photos

#### Semaine 3.3 : Gamification & Tâches

**Backend :**
- [ ] Tables `badges`, `partner_badges`
- [ ] Logique d'attribution automatique
- [ ] Table `tasks` + endpoints

**Frontend :**
- [ ] Page `PartnerGamification.tsx`
- [ ] Composant `BadgeDisplay.tsx`
- [ ] Page `PartnerTasks.tsx`
- [ ] Composant `TaskBoard.tsx` (Kanban)

**Features :**
- ✅ Affichage des badges obtenus
- ✅ Progression vers nouveaux badges
- ✅ Classement des partenaires
- ✅ Gestion des tâches (Kanban)

#### 🆕 Semaine 3.4 : Système de Notation Mutuelle ⭐

**Backend :**
- [ ] Table `partner_ratings` (notation Partner → Client & Partner → Partner)
- [ ] Endpoints POST `/api/partner-ratings`
- [ ] Endpoint GET `/api/partner-ratings/given` (notations données)
- [ ] Endpoint GET `/api/partner-ratings/received` (notations reçues)
- [ ] Endpoint GET `/api/partner-ratings/average/:userId`
- [ ] Endpoint GET `/api/partner-ratings/exists` (vérifier si déjà noté)
- [ ] Middleware `canRateUser` (validation participation + événement terminé)

**Frontend :**
- [ ] Page `PartnerRatings.tsx` (Reçues / Données)
- [ ] Composant `StarRating.tsx` (étoiles cliquables)
- [ ] Composant `RatingCard.tsx` (affichage notation)
- [ ] Composant `RatingModal.tsx` (formulaire notation)
- [ ] Widget notation sur profils clients
- [ ] Widget notation sur profils partenaires
- [ ] Badge notation sur cartes marketplace

**Features :**
- ✅ Partenaires notent clients après événement (1-5 étoiles + commentaire)
- ✅ Partenaires notent autres partenaires (collaboration même événement)
- ✅ Critères détaillés (professionnalisme, communication, ponctualité, qualité)
- ✅ Statistiques notations (moyenne, répartition étoiles)
- ✅ Badges "Client fiable", "Excellent collaborateur"
- ✅ Contrainte: 1 notation par combinaison (rater, rated, event)

**Validations :**
- ✅ Événement terminé (end_date < NOW())
- ✅ Booking confirmé (status IN ['confirmed', 'completed'])
- ✅ Pas d'auto-notation (rater_id != rated_id)
- ✅ Pas de notation en double (UNIQUE constraint)

**📄 Documentation détaillée :** `docs/ADDENDUM_NOTATION_MUTUELLE.md`

---

### PHASE 4 : MODULES ADMIN (2 semaines)
**Priorité :** 🟡 MOYENNE  
**Objectif :** Créer tous les modules pour les administrateurs

#### Semaine 4.1 : Gestion Principale

**Backend :**
- [ ] Endpoints agrégés pour stats globales
- [ ] Gestion des partenaires (validation)
- [ ] Gestion des packages (approbation)

**Frontend :**
- [ ] Page `AdminDashboard.tsx`
- [ ] Composant `PlatformStats.tsx`
- [ ] Page `AdminPartners.tsx`
- [ ] Page `AdminMarketplace.tsx`
- [ ] Workflows d'approbation

**Features :**
- ✅ Vue d'ensemble de la plateforme
- ✅ Stats globales (users, partners, events)
- ✅ Validation des partenaires
- ✅ Approbation des packages

#### Semaine 4.2 : Inspirations, Ambassadeurs & Paramètres

**Backend :**
- [ ] Table `ambassadors`
- [ ] Table `platform_config`
- [ ] Endpoints de gestion

**Frontend :**
- [ ] Page `AdminInspirations.tsx`
- [ ] Page `AdminAmbassadors.tsx`
- [ ] Page `AdminSettings.tsx`
- [ ] Composant `ConfigEditor.tsx`

**Features :**
- ✅ Gestion des inspirations
- ✅ Gestion des ambassadeurs
- ✅ Configuration de la plateforme
- ✅ Paramètres globaux

---

### PHASE 5 : MODULES AVANCÉS (2 semaines)
**Priorité :** 🟢 BASSE  
**Objectif :** Fonctionnalités avancées et intégrations

#### Semaine 5.1 : Facturation & Contrats

**Backend :**
- [ ] Tables `contracts` + `invoices`
- [ ] Intégration Stripe
- [ ] Génération de PDF (contrats/factures)
- [ ] Webhooks Stripe

**Frontend :**
- [ ] Page `ClientBilling.tsx`
- [ ] Page `ClientContracts.tsx`
- [ ] Composant `StripePayment.tsx`
- [ ] Composant `ContractViewer.tsx`
- [ ] Signature électronique

**Features :**
- ✅ Liste des factures
- ✅ Paiement Stripe
- ✅ Visualisation des contrats
- ✅ Signature électronique

#### Semaine 5.2 : Mini-sites & Documents

**Backend :**
- [ ] Table `event_sites`
- [ ] Génération de documents PDF
- [ ] Routes publiques pour mini-sites

**Frontend :**
- [ ] Page `ClientMiniSite.tsx`
- [ ] Page `ClientDocuments.tsx`
- [ ] Composant `MiniSiteBuilder.tsx`
- [ ] Composant `DocumentGenerator.tsx`
- [ ] Page publique `PublicMiniSite.tsx`

**Features :**
- ✅ Configuration du mini-site
- ✅ Modules activables
- ✅ Thèmes et couleurs
- ✅ Génération de documents
- ✅ Export PDF/Word

---

### PHASE 6 : TESTS & OPTIMISATIONS (1 semaine)
**Priorité :** 🔴 CRITIQUE  
**Objectif :** Assurer la qualité et les performances

#### Tests
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests d'intégration (API)
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Tests de charge (Artillery/k6)

#### Optimisations
- [ ] Lazy loading des pages
- [ ] Code splitting
- [ ] Optimisation des images
- [ ] Cache Redis (si nécessaire)
- [ ] CDN pour les assets statiques

#### Documentation
- [ ] Guide utilisateur (client, partenaire, admin)
- [ ] Documentation API complète
- [ ] Guide de déploiement
- [ ] Guide de contribution

---

## 📊 TABLEAU DE BORD DE PROGRESSION

### Par Priorité

| Priorité | Entités | Modules | % Estimé |
|----------|---------|---------|----------|
| 🔴 HAUTE | 7 entités | 18 modules | 60% |
| 🟡 MOYENNE | 15 entités | 15 modules | 30% |
| 🟢 BASSE | 10 entités | 10 modules | 10% |

### Par Type d'Utilisateur

| Utilisateur | Modules | Temps Estimé | Priorité |
|-------------|---------|--------------|----------|
| **Public** | 4 pages | 1 semaine | 🔴 HAUTE |
| **Client** | 15 pages (+1 widget notation) | 4 semaines | 🔴 HAUTE |
| **Partenaire** | 15 pages (+3 notation mutuelle) | 3.5 semaines (+0.5 semaine) | 🟡 MOYENNE |
| **Admin** | 10 pages (+1 modération) | 2 semaines | 🟡 MOYENNE |

**Total :** 44 pages + 5 nouvelles (notation mutuelle) = **49 modules**

---

## 🛠️ STACK TECHNIQUE DÉTAILLÉ

### Frontend
```json
{
  "framework": "React 19.1.1",
  "language": "TypeScript 5.8.3",
  "bundler": "Vite 7.1.2",
  "styling": "TailwindCSS 4.1.12",
  "state": {
    "global": "Redux Toolkit",
    "server": "React Query (TanStack Query)",
    "forms": "React Hook Form"
  },
  "ui": {
    "components": "Shadcn/UI",
    "icons": "Lucide React",
    "animations": "Framer Motion"
  },
  "routing": "React Router DOM 7",
  "http": "Axios",
  "realtime": "Socket.io Client",
  "file-upload": "React Dropzone",
  "pdf": "jsPDF + html2canvas",
  "charts": "Recharts",
  "calendar": "React Big Calendar",
  "editor": "React Quill",
  "markdown": "React Markdown"
}
```

### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "language": "JavaScript/TypeScript",
  "database": {
    "type": "PostgreSQL",
    "orm": "Prisma ou Sequelize",
    "migrations": "Knex.js ou Prisma Migrate"
  },
  "auth": "JWT + bcrypt",
  "file-storage": {
    "local": "Multer",
    "cloud": "AWS S3 (optionnel)"
  },
  "realtime": "Socket.io",
  "payments": "Stripe",
  "email": "Nodemailer + SendGrid/Mailgun",
  "pdf": "Puppeteer ou PDFKit",
  "validation": "Joi ou Yup",
  "logging": "Winston",
  "cron": "node-cron"
}
```

---

## 📝 CONVENTIONS DE DÉVELOPPEMENT

### Nommage
```typescript
// Entités (singulier, PascalCase)
interface Event { }
interface Partner { }

// Tables BD (pluriel, snake_case)
CREATE TABLE events ();
CREATE TABLE partners ();

// Fichiers de pages (PascalCase)
ClientDashboard.tsx
PartnerMarketplace.tsx

// Fichiers de composants (PascalCase)
EventCard.tsx
PackageGrid.tsx

// Fichiers utilitaires (camelCase)
apiClient.ts
dateUtils.ts

// Hooks personnalisés (camelCase, préfixe 'use')
useEvents.ts
useAuth.ts

// Constants (UPPER_SNAKE_CASE)
const API_BASE_URL = '...';
const MAX_FILE_SIZE = 5000000;
```

### Structure des Fichiers
```typescript
// Chaque entité a sa propre structure
src/
├── api/
│   └── endpoints/
│       ├── events.ts
│       ├── partners.ts
│       └── packages.ts
├── types/
│   └── entities/
│       ├── Event.ts
│       ├── Partner.ts
│       └── Package.ts
├── hooks/
│   ├── useEvents.ts
│   ├── usePartners.ts
│   └── usePackages.ts
└── components/
    ├── events/
    │   ├── EventCard.tsx
    │   ├── EventList.tsx
    │   └── EventForm.tsx
    ├── partners/
    └── packages/
```

### Code Style
- **TypeScript strict mode** activé
- **ESLint + Prettier** configurés
- **Imports organisés** (React → Libs → Components → Utils)
- **Commentaires** pour la logique complexe
- **JSDoc** pour les fonctions publiques

---

## 🔒 SÉCURITÉ

### Authentification
- JWT avec refresh tokens
- Expiration courte (15 min)
- Refresh token sécurisé (HttpOnly cookie)
- Rate limiting sur les endpoints d'auth

### Autorisation
- Vérification du rôle à chaque requête
- Middleware `requireRole(['admin', 'partner'])`
- Validation des permissions par ressource

### Données
- Validation côté client ET serveur
- Sanitization des inputs (XSS prevention)
- Parameterized queries (SQL injection prevention)
- CORS configuré correctement

### Fichiers
- Validation du type MIME
- Limite de taille (5MB par défaut)
- Scan antivirus (optionnel)
- URLs signées pour fichiers privés

---

## 🚀 DÉPLOIEMENT

### Environnements
```
Development (Local)
├── Frontend: http://localhost:5173
└── Backend: http://localhost:3000

Staging (Sandbox)
├── Frontend: https://5174-...-sandbox.novita.ai
└── Backend: https://api-staging.we-event.eu

Production
├── Frontend: https://app.we-event.eu (CloudFront + S3)
└── Backend: https://api.we-event.eu (EC2 Load Balanced)
```

### CI/CD
- GitHub Actions pour les tests automatiques
- Déploiement automatique sur staging (branche `develop`)
- Déploiement manuel sur production (branche `main`)

---

## 📞 SUPPORT & RESSOURCES

### Documentation
- **Cahier des charges :** `docs/cahier-des-charges-phases-5-6.docx`
- **Plan de développement :** `docs/PLAN_DEVELOPPEMENT_COMPLET.md` (ce fichier)
- **Guide de contribution :** `CONTRIBUTING.md` (à créer)

### Contacts
- **Product Owner :** À définir
- **Lead Developer :** À définir
- **Support technique :** support@we-event.eu

---

## ✅ CHECKLIST DE DÉBUT

Avant de commencer le développement, vérifiez que :

- [ ] Le cahier des charges a été lu et compris
- [ ] L'environnement de développement est configuré
- [ ] L'accès à la base de données staging est fonctionnel
- [ ] Les tokens d'API sont configurés (Stripe, etc.)
- [ ] La branche `we-event-test-robin` est à jour
- [ ] Les outils de développement sont installés (Node.js, PostgreSQL, etc.)
- [ ] La documentation de l'API actuelle est disponible
- [ ] Les accès GitHub sont configurés

---

## 🎯 CONCLUSION

Ce plan de développement couvre l'intégralité des Phases 5 & 6 du cahier des charges We Event.

**Durée totale estimée :** 8-12 semaines (selon l'équipe)

**Approche recommandée :**
1. Commencer par les fondations (PHASE 0 & 1)
2. Implémenter les modules Client (priorité haute)
3. Progresser vers les modules Partenaire et Admin
4. Terminer par les fonctionnalités avancées

**Rappel important :**
- Tous les développements se font sur la branche `we-event-test-robin`
- Aucun impact sur la production `app.we-event.eu`
- Tests rigoureux à chaque étape
- Documentation continue

---

**Document créé le :** 2026-02-13  
**Dernière mise à jour :** 2026-02-13  
**Version :** 1.0.0  
**Auteur :** Analyse du cahier des charges par IA

---

🚀 **Prêt à démarrer le développement !**
