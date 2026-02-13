# 🚀 PLAN DE DÉVELOPPEMENT PHASE PAR PHASE

**Branche :** `we-event-test-robin`  
**Méthode :** Développement itératif avec tests entre chaque phase  
**Date de début :** 2026-02-13

---

## 📋 MÉTHODOLOGIE

### Cycle de développement par phase
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ DÉVELOPPEMENT│ →   │   COMMIT     │ →   │    TESTS     │ →   │  VALIDATION  │
│   (Code)     │     │   (Git)      │     │  (Manuel+E2E)│     │   (Client)   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       ↓                    ↓                    ↓                    ↓
   Feature X          git commit            npm test            ✅ OK → Phase suivante
                      git push              playwright           ❌ KO → Fix bugs
```

### Règles strictes
1. ✅ **Une phase = un commit** (ou plusieurs petits commits atomiques)
2. ✅ **Pas de phase suivante sans validation de la précédente**
3. ✅ **Tests après chaque phase** (unitaires + intégration + E2E)
4. ✅ **Documentation immédiate** des fonctionnalités développées
5. ✅ **Revue de code** systématique avant merge

---

## 🎯 PHASES DE DÉVELOPPEMENT

### PHASE 0 : PRÉPARATION (1 semaine) ⏳

**Statut actuel :** 🟡 EN COURS (Documentation complète)

#### ✅ Tâches Terminées
- [x] Analyse du cahier des charges
- [x] Création du plan de développement complet
- [x] Création du plan de notation mutuelle
- [x] Documentation des entités
- [x] Documentation des modules
- [x] Estimation des durées

#### 🔲 Tâches Restantes
- [ ] Audit du code existant
  - [ ] Vérifier la structure Redux actuelle
  - [ ] Analyser les endpoints API existants
  - [ ] Identifier les composants réutilisables
  - [ ] Vérifier les types TypeScript existants
- [ ] Créer la couche d'abstraction API
  - [ ] Fichier `src/api/api-client.ts`
  - [ ] Types génériques `ApiResponse<T>`
  - [ ] Gestion d'erreurs centralisée
- [ ] Préparer les schémas de base de données
  - [ ] Créer les migrations SQL (folder `migrations/`)
  - [ ] Diagramme ERD (Entity-Relationship Diagram)
  - [ ] Documentation des relations
- [ ] Configurer l'environnement de tests
  - [ ] Jest + React Testing Library
  - [ ] Playwright pour E2E
  - [ ] Scripts de tests dans `package.json`

**Commit attendu :** 
```bash
git commit -m "chore: Setup development environment and API abstraction layer"
```

**Tests Phase 0 :**
- [ ] API client basique fonctionne (test connexion)
- [ ] Migrations SQL créées et validées
- [ ] Tests unitaires s'exécutent (npm test)

---

### PHASE 1 : FONDATIONS (2.5 semaines) 🔴

**Objectif :** Créer les entités et API critiques

#### Semaine 1.1 : Entités Core + API

**Backend (5 jours) :**
- [ ] **Jour 1-2 :** Entité `Event`
  - [ ] Migration SQL `001_create_events.sql`
  - [ ] Model `Event.ts` (Sequelize/Prisma)
  - [ ] Routes `/api/events/*` (CRUD)
  - [ ] Validation (Joi/Zod)
  - [ ] Tests unitaires

- [ ] **Jour 3 :** Entité `Package`
  - [ ] Migration SQL `002_create_packages.sql`
  - [ ] Model `Package.ts`
  - [ ] Routes `/api/packages/*`
  - [ ] Tests

- [ ] **Jour 4 :** Entité `Booking`
  - [ ] Migration SQL `003_create_bookings.sql`
  - [ ] Model `Booking.ts`
  - [ ] Routes `/api/bookings/*`
  - [ ] Tests

- [ ] **Jour 5 :** Entités `Message` + `Conversation`
  - [ ] Migrations SQL
  - [ ] Models
  - [ ] Routes `/api/conversations/*` et `/api/messages/*`
  - [ ] Tests

**Frontend (5 jours) :**
- [ ] **Jour 1-2 :** Services API
  - [ ] `src/services/eventService.ts`
  - [ ] `src/services/packageService.ts`
  - [ ] `src/services/bookingService.ts`
  - [ ] `src/services/messageService.ts`

- [ ] **Jour 3-4 :** Types TypeScript
  - [ ] `src/types/event.ts`
  - [ ] `src/types/package.ts`
  - [ ] `src/types/booking.ts`
  - [ ] `src/types/message.ts`

- [ ] **Jour 5 :** Intégration Redux
  - [ ] Slices Redux pour chaque entité
  - [ ] Thunks asynchrones

**Commit attendu :**
```bash
git commit -m "feat: Add core entities (Event, Package, Booking, Message, Conversation)

- Backend: 5 tables + CRUD endpoints
- Frontend: Services + Types + Redux slices
- Tests: Unit tests for all CRUD operations
- Coverage: >80%"
```

**Tests Phase 1.1 :**
- [ ] Backend : Tous les tests unitaires passent (Jest)
- [ ] Frontend : Services API testés (Mock axios)
- [ ] Intégration : Créer un événement via Postman
- [ ] E2E : Créer un événement via l'UI (Playwright)

---

#### Semaine 1.2 : Authentification & Permissions

**Backend (3 jours) :**
- [ ] **Jour 1 :** Middleware `auth.ts`
  - [ ] Vérification JWT
  - [ ] Extraction user_id depuis token
  - [ ] Tests middleware

- [ ] **Jour 2 :** Middleware `checkRole.ts`
  - [ ] Vérifier rôle (client/partner/admin)
  - [ ] Bloquer accès non autorisé
  - [ ] Tests permissions

- [ ] **Jour 3 :** Appliquer aux routes
  - [ ] Protéger `/api/events/` (auth required)
  - [ ] Protéger `/api/packages/` (partner only)
  - [ ] Tests de sécurité

**Frontend (2 jours) :**
- [ ] **Jour 1 :** ProtectedRoute amélioré
  - [ ] Redirection si non connecté
  - [ ] Vérification rôle côté client
  - [ ] Tests

- [ ] **Jour 2 :** Intercepteur Axios
  - [ ] Ajouter automatiquement Bearer token
  - [ ] Gérer 401 (logout auto)
  - [ ] Tests

**Commit attendu :**
```bash
git commit -m "feat: Add authentication middleware and role-based access control

- Backend: auth middleware + checkRole middleware
- Frontend: ProtectedRoute + Axios interceptor
- Security: All API routes protected
- Tests: Auth & permissions tests"
```

**Tests Phase 1.2 :**
- [ ] Accès non autorisé bloqué (401)
- [ ] Token expiré → logout automatique
- [ ] Rôles vérifiés (admin ne peut pas accéder à /partner/*)

---

#### Semaine 1.3 : Notation Mutuelle (Backend + Frontend)

**Backend (3 jours) :**
- [ ] **Jour 1 :** Table `partner_ratings`
  - [ ] Migration SQL `010_create_partner_ratings.sql`
  - [ ] Model `PartnerRating.ts`
  - [ ] Index (rater_id, rated_id, event_id)
  - [ ] Contrainte UNIQUE

- [ ] **Jour 2 :** Endpoints API
  - [ ] POST `/api/partner-ratings` (créer notation)
  - [ ] GET `/api/partner-ratings/given` (mes notations données)
  - [ ] GET `/api/partner-ratings/received` (mes notations reçues)
  - [ ] GET `/api/partner-ratings/average/:userId` (moyenne)
  - [ ] GET `/api/partner-ratings/exists?rated_id=X&event_id=Y`
  - [ ] Middleware `canRateUser.ts` (validation)

- [ ] **Jour 3 :** Validation & Tests
  - [ ] Vérifier événement terminé
  - [ ] Vérifier booking confirmé
  - [ ] Empêcher double notation
  - [ ] Tests unitaires

**Frontend (2 jours) :**
- [ ] **Jour 1 :** Composants de base
  - [ ] `StarRating.tsx` (composant étoiles)
  - [ ] `RatingCard.tsx` (carte affichage notation)
  - [ ] `RatingModal.tsx` (formulaire notation)
  - [ ] Service `src/services/partnerRatingService.ts`

- [ ] **Jour 2 :** Page Partenaire
  - [ ] Page `/partner/ratings` (Reçues / Données)
  - [ ] Tabs (Reçues / Données)
  - [ ] Liste des notations
  - [ ] Statistiques (moyenne, total)

**Commit attendu :**
```bash
git commit -m "feat: Add mutual rating system (Partner → Client/Partner)

- Backend: partner_ratings table + 6 endpoints
- Frontend: StarRating, RatingCard, RatingModal components
- Page: /partner/ratings (Received / Given tabs)
- Validation: Event finished, booking confirmed, no duplicates
- Tests: Full coverage (unit + integration + E2E)"
```

**Tests Phase 1.3 :**
- [ ] Backend : Créer notation via Postman
- [ ] Backend : Empêcher double notation (409 Conflict)
- [ ] Frontend : Afficher notations reçues
- [ ] Frontend : Formulaire notation fonctionnel
- [ ] E2E : Scénario complet "Noter un client après événement"

---

### PHASE 2 : MODULES CLIENT (4 semaines) 🔴

**Objectif :** Créer tous les modules pour les clients

#### Semaine 2.1 : Dashboard Client & Gestion Événements

**Backend (3 jours) :**
- [ ] Endpoint `/api/events/user/:userId` (mes événements)
- [ ] Endpoint `/api/bookings/event/:eventId` (réservations d'un événement)
- [ ] Stats agrégées (total events, total budget, etc.)

**Frontend (2 jours) :**
- [ ] Page `ClientDashboard.tsx`
  - [ ] Vue d'ensemble (événements à venir, notifications)
  - [ ] Stats (total events, budget, partenaires)
  - [ ] Quick actions (créer événement, voir marketplace)

- [ ] Page `ClientEvents.tsx`
  - [ ] Liste des événements
  - [ ] Filtres (date, statut)
  - [ ] Bouton "Créer un événement"

- [ ] Page `ClientEventCreation.tsx`
  - [ ] Formulaire multi-étapes (date, lieu, type, budget)
  - [ ] Validation
  - [ ] Soumission API

**Commit attendu :**
```bash
git commit -m "feat(client): Add dashboard and event management

- Dashboard: Stats + Quick actions + Upcoming events
- Events list: Filters + Create button
- Event creation: Multi-step form
- API: GET /api/events/user/:userId"
```

**Tests Phase 2.1 :**
- [ ] Créer un événement via l'UI
- [ ] Voir la liste de mes événements
- [ ] Dashboard affiche les bonnes stats
- [ ] E2E : Créer événement + vérifier dans liste

---

#### Semaine 2.2 : Marketplace & Réservations

**Backend (2 jours) :**
- [ ] Endpoint `/api/packages/search?category=X&budget=Y`
- [ ] Endpoint POST `/api/bookings` (créer réservation)
- [ ] Endpoint PUT `/api/bookings/:id/status` (confirmer/annuler)

**Frontend (3 jours) :**
- [ ] Page `ClientMarketplace.tsx`
  - [ ] Galerie de packages
  - [ ] Filtres (catégorie, budget, rating)
  - [ ] Tri (prix, popularité)

- [ ] Page `PackageDetails.tsx`
  - [ ] Détails du package
  - [ ] Photos, vidéos
  - [ ] Bouton "Réserver"

- [ ] Page `ClientBookings.tsx`
  - [ ] Liste des réservations
  - [ ] Statuts (pending, confirmed, cancelled)
  - [ ] Actions (confirmer, annuler)

**Commit attendu :**
```bash
git commit -m "feat(client): Add marketplace and booking system

- Marketplace: Search + Filters + Sorting
- Package details: Photos + Videos + Book button
- Bookings: List + Status management
- API: Search packages + Create/Update bookings"
```

**Tests Phase 2.2 :**
- [ ] Chercher un package (filtre catégorie + budget)
- [ ] Réserver un package
- [ ] Voir la réservation dans "Mes réservations"
- [ ] E2E : Marketplace → PackageDetails → Réserver → Voir dans Bookings

---

#### Semaine 2.3 : Messagerie Temps Réel

**Backend (3 jours) :**
- [ ] Intégration Socket.io (WebSocket)
- [ ] Événements `message:send`, `message:receive`, `conversation:typing`
- [ ] Sauvegarder messages en BD
- [ ] Notifications temps réel

**Frontend (2 jours) :**
- [ ] Page `ClientMessaging.tsx`
  - [ ] Liste conversations (sidebar)
  - [ ] Chat (zone centrale)
  - [ ] Indicateur "en train d'écrire..."

- [ ] Composant `ChatWindow.tsx`
  - [ ] Affichage messages
  - [ ] Input texte
  - [ ] Envoi message (Enter)

- [ ] Socket.io Client
  - [ ] Connexion WebSocket
  - [ ] Écoute événements
  - [ ] Envoi messages

**Commit attendu :**
```bash
git commit -m "feat(client): Add real-time messaging with Socket.io

- Backend: WebSocket events (send, receive, typing)
- Frontend: ChatWindow component + Socket.io client
- Features: Instant messaging + Typing indicator
- Tests: E2E messaging between client and partner"
```

**Tests Phase 2.3 :**
- [ ] Envoyer un message à un partenaire
- [ ] Recevoir une réponse en temps réel
- [ ] Indicateur "typing..." fonctionne
- [ ] E2E : Conversation complète client ↔ partenaire

---

#### Semaine 2.4 : Photos/Vidéos, Inspiration & Autres Modules

**Backend (2 jours) :**
- [ ] Table `photos`, `videos` (liées à events)
- [ ] Endpoint POST `/api/photos/upload` (multer + S3/local)
- [ ] Table `inspirations`, `categories`, `trends`
- [ ] Endpoints de gestion

**Frontend (3 jours) :**
- [ ] Page `ClientPhotos.tsx`
  - [ ] Galerie de photos de l'événement
  - [ ] Upload de photos
  - [ ] Lightbox (zoom)

- [ ] Page `ClientVideos.tsx`
  - [ ] Liste vidéos
  - [ ] Player vidéo
  - [ ] Commentaires horodatés

- [ ] Page `ClientInspiration.tsx`
  - [ ] Galerie d'inspirations
  - [ ] Filtres (catégorie, tendances)
  - [ ] Moodboard (inspirations sauvegardées)

- [ ] Pages basiques (placeholder)
  - [ ] `ClientPlaylist.tsx`
  - [ ] `ClientCatering.tsx`
  - [ ] `ClientFloorPlan.tsx`

**Commit attendu :**
```bash
git commit -m "feat(client): Add photos, videos, inspiration modules

- Photos: Gallery + Upload + Lightbox
- Videos: Player + Comments
- Inspiration: Gallery + Moodboard + Filters
- Placeholder pages: Playlist, Catering, FloorPlan"
```

**Tests Phase 2.4 :**
- [ ] Upload une photo pour un événement
- [ ] Voir la photo dans la galerie
- [ ] Chercher une inspiration (filtre catégorie)
- [ ] Sauvegarder une inspiration dans le moodboard

---

### PHASE 3 : MODULES PARTENAIRE (3.5 semaines) 🟡

**Objectif :** Créer tous les modules pour les partenaires

#### Semaine 3.1 : Dashboard Partenaire & Packages

**Backend (2 jours) :**
- [ ] Endpoint `/api/stats/partner/:partnerId`
- [ ] Endpoint `/api/packages/partner/:partnerId` (mes packages)
- [ ] Workflow d'approbation (pending → approved)

**Frontend (3 jours) :**
- [ ] Page `PartnerDashboard.tsx`
  - [ ] Stats (events, rating, reviews, revenue)
  - [ ] Événements à venir
  - [ ] Notifications

- [ ] Page `PartnerMarketplace.tsx`
  - [ ] Mes packages
  - [ ] Bouton "Créer un package"
  - [ ] Statuts (pending, approved, rejected)

- [ ] Page `PartnerBundleCreation.tsx`
  - [ ] Formulaire de création package
  - [ ] Upload d'images
  - [ ] Prix, prestations
  - [ ] Soumission pour validation

**Commit attendu :**
```bash
git commit -m "feat(partner): Add dashboard and package management

- Dashboard: Stats + Upcoming events + Notifications
- Marketplace: List packages + Create button
- Package creation: Form + Image upload + Approval workflow
- API: GET /api/stats/partner/:id + CRUD packages"
```

**Tests Phase 3.1 :**
- [ ] Dashboard affiche les bonnes stats
- [ ] Créer un package
- [ ] Voir le package en statut "pending"
- [ ] Admin approuve → statut "approved"

---

#### Semaine 3.2 : Calendrier & Galerie

**Backend (1 jour) :**
- [ ] Endpoint `/api/bookings/partner/:partnerId/calendar`
- [ ] Gestion des disponibilités

**Frontend (2 jours) :**
- [ ] Page `PartnerCalendar.tsx`
  - [ ] Calendrier (vue mois/semaine)
  - [ ] Réservations affichées
  - [ ] Gestion disponibilités

- [ ] Page `PartnerGallery.tsx`
  - [ ] Portfolio de photos/vidéos
  - [ ] Upload de nouvelles photos
  - [ ] Organisation par catégorie

**Commit attendu :**
```bash
git commit -m "feat(partner): Add calendar and gallery

- Calendar: Month/Week view + Bookings display + Availability
- Gallery: Portfolio + Upload + Categories
- API: GET /api/bookings/partner/:id/calendar"
```

**Tests Phase 3.2 :**
- [ ] Voir le calendrier avec mes réservations
- [ ] Bloquer une date (indisponible)
- [ ] Upload une photo dans la galerie
- [ ] Voir la photo dans le portfolio

---

#### Semaine 3.3 : Gamification & Tâches

**Backend (2 jours) :**
- [ ] Tables `badges`, `partner_badges`
- [ ] Logique d'attribution automatique
- [ ] Table `tasks` + endpoints

**Frontend (2 jours) :**
- [ ] Page `PartnerGamification.tsx`
  - [ ] Affichage badges obtenus
  - [ ] Progression vers nouveaux badges
  - [ ] Classement partenaires

- [ ] Page `PartnerTasks.tsx`
  - [ ] Kanban (To do, In progress, Done)
  - [ ] Drag & drop
  - [ ] Création de tâches

**Commit attendu :**
```bash
git commit -m "feat(partner): Add gamification and task board

- Gamification: Badges + Progress + Leaderboard
- Tasks: Kanban board + Drag & drop + CRUD
- API: Badges logic + Tasks endpoints"
```

**Tests Phase 3.3 :**
- [ ] Voir mes badges obtenus
- [ ] Voir ma progression (ex: 8/10 events pour "Organisateur Bronze")
- [ ] Créer une tâche
- [ ] Déplacer tâche (drag & drop)

---

#### Semaine 3.4 : Widgets Notation Mutuelle

**Frontend (2 jours) :**
- [ ] Widget notation sur profil client
  - [ ] Afficher moyenne des notations reçues
  - [ ] Répartition étoiles
  - [ ] Badge "Client fiable"

- [ ] Widget notation sur profil partenaire
  - [ ] Moyenne globale + critères
  - [ ] Badge "Excellent collaborateur"

- [ ] Badge notation sur cartes marketplace
  - [ ] Icône étoile + moyenne + nombre d'avis

**Commit attendu :**
```bash
git commit -m "feat(partner): Add rating widgets on profiles and marketplace

- Client profile: Average rating + Badge
- Partner profile: Average + Criteria + Badge
- Marketplace: Star icon + Average + Count
- Integration with partner_ratings table"
```

**Tests Phase 3.4 :**
- [ ] Widget notation visible sur profil client
- [ ] Badge "Client fiable" affiché si avg >= 4.5
- [ ] Carte marketplace affiche note moyenne partenaire
- [ ] Trier marketplace par note décroissante

---

### PHASE 4 : MODULES ADMIN (2 semaines) 🟡

**Objectif :** Créer tous les modules pour les administrateurs

#### Semaine 4.1 : Gestion Principale

**Backend (2 jours) :**
- [ ] Endpoints agrégés stats globales
- [ ] Gestion partenaires (validation)
- [ ] Gestion packages (approbation)

**Frontend (3 jours) :**
- [ ] Page `AdminDashboard.tsx`
- [ ] Page `AdminPartners.tsx`
- [ ] Page `AdminMarketplace.tsx`
- [ ] Workflows d'approbation

**Commit attendu :**
```bash
git commit -m "feat(admin): Add dashboard and main management pages

- Dashboard: Platform stats (users, partners, events, revenue)
- Partners: List + Validation + Details
- Marketplace: Packages approval workflow"
```

**Tests Phase 4.1 :**
- [ ] Dashboard affiche stats globales correctes
- [ ] Valider un nouveau partenaire
- [ ] Approuver un package
- [ ] Rejeter un package (avec raison)

---

#### Semaine 4.2 : Inspirations, Ambassadeurs & Paramètres + Modération Notations

**Backend (2 jours) :**
- [ ] Table `ambassadors`
- [ ] Table `platform_config`
- [ ] Endpoint modération notations

**Frontend (3 jours) :**
- [ ] Page `AdminInspirations.tsx`
- [ ] Page `AdminAmbassadors.tsx`
- [ ] Page `AdminSettings.tsx`
- [ ] Page `AdminRatings.tsx` (modération)
  - [ ] Liste notations signalées
  - [ ] Supprimer notation inappropriée
  - [ ] Stats notations globales

**Commit attendu :**
```bash
git commit -m "feat(admin): Add inspirations, ambassadors, settings, ratings moderation

- Inspirations: CRUD + Categories
- Ambassadors: CRUD + Stats
- Settings: Platform configuration
- Ratings: Moderation + Delete + Global stats"
```

**Tests Phase 4.2 :**
- [ ] Créer une inspiration
- [ ] Ajouter un ambassadeur
- [ ] Modifier config plateforme
- [ ] Supprimer une notation inappropriée

---

### PHASE 5 : MODULES AVANCÉS (2 semaines) 🟢

**Objectif :** Fonctionnalités avancées et intégrations

#### Semaine 5.1 : Facturation & Contrats

**Backend (3 jours) :**
- [ ] Tables `contracts` + `invoices`
- [ ] Intégration Stripe
- [ ] Génération PDF (contrats/factures)
- [ ] Webhooks Stripe

**Frontend (2 jours) :**
- [ ] Page `ClientBilling.tsx`
- [ ] Composant `StripeCheckout.tsx`
- [ ] Page `ClientContracts.tsx`
- [ ] Signature électronique

**Commit attendu :**
```bash
git commit -m "feat(advanced): Add billing and contracts

- Stripe: Payment integration + Webhooks
- Contracts: PDF generation + E-signature
- Invoices: List + Download + Payment status"
```

**Tests Phase 5.1 :**
- [ ] Créer une facture
- [ ] Payer via Stripe (test mode)
- [ ] Générer un contrat PDF
- [ ] Signer électroniquement

---

#### Semaine 5.2 : Mini-sites & Documents

**Backend (2 jours) :**
- [ ] Table `event_sites`
- [ ] Routes publiques `/public/event/:slug`
- [ ] Génération documents PDF

**Frontend (3 jours) :**
- [ ] Page `ClientMiniSite.tsx`
- [ ] Composant `MiniSiteBuilder.tsx`
- [ ] Page publique `PublicMiniSite.tsx`
- [ ] Page `ClientDocuments.tsx`

**Commit attendu :**
```bash
git commit -m "feat(advanced): Add mini-sites and document generation

- Mini-sites: Builder + Public page + Themes
- Documents: PDF/Word generation + Export"
```

**Tests Phase 5.2 :**
- [ ] Créer un mini-site pour un événement
- [ ] Personnaliser le thème
- [ ] Accéder au mini-site (URL publique)
- [ ] Générer un document PDF

---

### PHASE 6 : TESTS & OPTIMISATIONS (1 semaine) 🔴

**Objectif :** Assurer la qualité et les performances

#### Tests (3 jours)
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests d'intégration (API)
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Tests de charge (Artillery/k6)
- [ ] Coverage > 80%

#### Optimisations (2 jours)
- [ ] Lazy loading des pages
- [ ] Code splitting
- [ ] Optimisation des images (WebP, compression)
- [ ] Cache Redis (si nécessaire)
- [ ] CDN pour assets statiques

#### Documentation (2 jours)
- [ ] Guide utilisateur (client, partenaire, admin)
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Guide de déploiement
- [ ] Guide de contribution

**Commit attendu :**
```bash
git commit -m "chore: Add comprehensive tests, optimizations and documentation

- Tests: 80%+ coverage (unit + integration + E2E)
- Performance: Lazy loading + Code splitting + Image optimization
- Docs: User guides + API docs + Deployment guide"
```

**Tests Phase 6 :**
- [ ] Tous les tests passent (npm test)
- [ ] Coverage > 80%
- [ ] Performance Lighthouse > 90
- [ ] Aucun warning console

---

## 📊 RÉCAPITULATIF DES LIVRABLES

### Par Phase

| Phase | Durée | Commits | Tests | Statut |
|-------|-------|---------|-------|--------|
| Phase 0 | 1 sem | 1 | Setup | 🟡 En cours |
| Phase 1 | 2.5 sem | 3 | Unit + E2E | ⏳ À faire |
| Phase 2 | 4 sem | 4 | Unit + E2E | ⏳ À faire |
| Phase 3 | 3.5 sem | 4 | Unit + E2E | ⏳ À faire |
| Phase 4 | 2 sem | 2 | Unit + E2E | ⏳ À faire |
| Phase 5 | 2 sem | 2 | Unit + E2E | ⏳ À faire |
| Phase 6 | 1 sem | 1 | Full suite | ⏳ À faire |

**Total :** 17 commits, 9-13 semaines

### Par Type de Livrable

| Type | Quantité | Phase(s) |
|------|----------|----------|
| **Tables BD** | 33 | Phase 1-5 |
| **Endpoints API** | ~126 | Phase 1-5 |
| **Pages Frontend** | 49 | Phase 2-5 |
| **Composants** | ~80 | Phase 1-5 |
| **Tests E2E** | ~50 scénarios | Phase 6 |
| **Documentation** | 4 guides | Phase 6 |

---

## 🎯 PROCHAINES ÉTAPES IMMÉDIATES

### 1. Valider le plan ✅
- [x] Lire la documentation complète
- [x] Poser des questions sur les fonctionnalités
- [x] Valider les priorités
- [x] Confirmer les délais

### 2. Terminer Phase 0 ⏳
- [ ] Auditer le code existant
- [ ] Créer `src/api/api-client.ts`
- [ ] Préparer migrations SQL
- [ ] Setup tests

### 3. Démarrer Phase 1 🚀
- [ ] Backend : Entité `Event`
- [ ] Frontend : Service `eventService.ts`
- [ ] Tests : CRUD événements
- [ ] Commit : "feat: Add Event entity"

---

## ❓ QUESTIONS FRÉQUENTES

### Q: Peut-on sauter des phases ?
**R:** Non. Chaque phase dépend de la précédente. Ex: Phase 2 (Client) a besoin de Phase 1 (Event, Booking).

### Q: Combien de temps par phase ?
**R:** Variable selon priorité :
- Phases 1-2 : 🔴 HAUTE (6.5 semaines)
- Phases 3-4 : 🟡 MOYENNE (5.5 semaines)
- Phases 5-6 : 🟢 BASSE (3 semaines)

### Q: Que faire si un test échoue ?
**R:** 
1. Analyser le bug
2. Créer un commit de fix
3. Re-tester
4. Ne passer à la phase suivante QUE si ✅ OK

### Q: Puis-je travailler sur plusieurs phases en parallèle ?
**R:** Déconseillé. Respecter l'ordre séquentiel évite les blocages.

### Q: Puis-je aider au développement ?
**R:** Oui ! Je peux :
- Générer le code (backend + frontend)
- Créer les tests
- Écrire la documentation
- Débugger les erreurs

Il suffit de me dire :
> "Développe Phase 1, Semaine 1.1, Jour 1 : Entité Event"

Et je génère tout le code nécessaire.

---

## 🚀 COMMANDES UTILES

### Développement
```bash
# Démarrer le serveur de dev
npm run dev

# Lancer les tests
npm test

# Lancer les tests E2E
npx playwright test

# Vérifier le coverage
npm run test:coverage

# Linter
npm run lint

# Formater le code
npm run format
```

### Git
```bash
# Voir le statut
git status

# Ajouter les modifications
git add .

# Commit
git commit -m "feat: description"

# Push
git push origin we-event-test-robin

# Voir l'historique
git log --oneline
```

### Base de données
```bash
# Créer une migration
npm run migration:create -- add_partner_ratings

# Exécuter les migrations
npm run migration:up

# Rollback dernière migration
npm run migration:down
```

---

**Prêt à démarrer le développement ? 🚀**

Confirmez et nous commencerons Phase 0 (Audit + Setup) puis Phase 1 (Fondations).
