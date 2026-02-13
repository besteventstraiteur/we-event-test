# 🎯 Branch We-Event-Test-Robin

## 📋 Informations Générales

**Nom de la branche :** `we-event-test-robin`  
**Créée depuis :** `feature/contact-redesign-v2`  
**Date de création :** 2026-02-13  
**Pull Request :** [#3](https://github.com/besteventstraiteur/we-event-test/pull/3)

Cette branche est une copie complète de `feature/contact-redesign-v2` créée spécifiquement pour les tests de Robin.

---

## ✅ Contenu de la Branche

### 🎨 Design V2 - Pages Partenaires

#### Nouvelle Page ProviderDetailsV2
- **Design moderne et fluide** avec animations
- **Portfolio en première position** (galerie avec lightbox Fancybox)
- **Sections organisées** :
  1. Portfolio (galerie d'images)
  2. À propos (description complète)
  3. Services proposés (liste avec icônes)
  4. Vidéos (YouTube embeds responsive)

#### Sidebar Sticky (Colonne de Droite)
- **Informations de contact** (téléphone, email, adresse)
- **Réseaux sociaux** : Facebook, Instagram, Pinterest, X (Twitter), LinkedIn
- **Bouton "Demander un devis"** (ouvre un modal avec formulaire)
- **Documents téléchargeables** (PDF avec icônes)
- **Avis clients récents** (3 derniers avis avec étoiles)

#### Caractéristiques Visuelles
- **Titre en blanc** sur fond gradient
- **Bouton retour** sans texte (icône seulement)
- **Design responsive** : Desktop, Tablette, Mobile
- **Animations** : Entrées progressives, hover effects
- **Badge vérifié** pour les partenaires certifiés

---

### 🔐 Authentification & Dashboards

#### Corrections Importantes
- **Routes protégées corrigées** : `login.data.role` au lieu de `login.user.role`
- **Accès aux dashboards restauré** :
  - `/admin/dashboard` → Tableau de bord Admin
  - `/client/dashboard` → Tableau de bord Client
  - `/partner/dashboard` → Tableau de bord Partenaire
- **Redirection automatique** selon le rôle après connexion

#### Pages d'Authentification
- `/login` - Connexion
- `/register` - Inscription
- `/forgot-password` - Mot de passe oublié
- `/reset-password` - Réinitialisation du mot de passe

---

### 🌐 Configuration API Backend

#### API Staging
- **URL complète** : `https://api-staging.we-event.eu/api`
- **Domaine** : `api-staging.we-event.eu`
- **Protocole** : HTTPS (SSL Let's Encrypt)
- **Préfixe requis** : `/api` pour toutes les routes

#### Instance EC2
- **Nom** : we-event-backend
- **Instance ID** : i-0de22410724f834fd
- **IP Publique** : 54.154.49.156
- **DNS** : ec2-54-154-49-156.eu-west-1.compute.amazonaws.com
- **Région** : eu-west-1 (Ireland)

#### Ports Ouverts (Security Group)
- **80** - HTTP
- **443** - HTTPS (utilisé pour l'API)
- **22** - SSH
- **5432** - PostgreSQL

#### SSL Certificate
- **Émetteur** : Let's Encrypt (E7)
- **Common Name** : api-staging.we-event.eu
- **Validité** : 8 Feb 2026 → 9 May 2026

---

## 🧪 Tests

### URLs de Test

**Application principale :**  
https://5174-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai

### Pages Partenaires V2 (avec données fake)

1. **Élégance Florale** (Fleuriste - Paris)  
   https://5174-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai/partners-v2/1
   - 6 photos portfolio
   - 2 vidéos YouTube
   - 3 documents PDF
   - 5 avis clients
   - Rating : 4.9/5 (127 avis)

2. **Traiteur Excellence** (Traiteur - Paris)  
   https://5174-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai/partners-v2/2
   - 6 photos portfolio
   - 1 vidéo YouTube
   - 2 documents PDF
   - 4 avis clients
   - Rating : 4.8/5 (189 avis)

3. **Photographie Lumière** (Photographe - Lyon)  
   https://5174-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai/partners-v2/3
   - 7 photos portfolio
   - 2 vidéos YouTube
   - 3 documents PDF
   - 4 avis clients
   - Rating : 5.0/5 (98 avis)

### Pages d'Authentification

- **Login** : `/login`
- **Register** : `/register`
- **Forgot Password** : `/forgot-password`
- **Reset Password** : `/reset-password`

### Dashboards (Après Connexion)

- **Admin** : `/admin/dashboard`
- **Client** : `/client/dashboard`
- **Partenaire** : `/partner/dashboard`

---

## 📝 Données de Test

### Partenaire 1 : Élégance Florale

```javascript
{
  id: "1",
  name: "Élégance Florale",
  category: "Fleuriste",
  verified: true,
  location: "15 Rue de la Paix, 75002 Paris",
  email: "contact@elegance-florale.fr",
  phoneNumber: "+33 1 42 60 12 34",
  website: "https://elegance-florale.fr",
  
  // Portfolio (6 images)
  portfolio: [ /* URLs Unsplash */ ],
  
  // Vidéos YouTube (2)
  BusinessVideo: [
    { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Notre Atelier Floral" },
    { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Créations de Mariage" }
  ],
  
  // Documents (3)
  BusinessDocument: [
    { name: "Catalogue 2024", type: "PDF", url: "#" },
    { name: "Tarifs & Prestations", type: "PDF", url: "#" },
    { name: "Guide des Fleurs", type: "PDF", url: "#" }
  ],
  
  // Avis (5)
  BusinessReview: [ /* 5 reviews */ ],
  
  // Rating
  BusinessRating: {
    averageRating: 4.9,
    totalReviews: 127,
    ratingDistribution: { 5: 98, 4: 22, 3: 5, 2: 1, 1: 1 }
  }
}
```

### Partenaire 2 : Traiteur Excellence

```javascript
{
  id: "2",
  name: "Traiteur Excellence",
  category: "Traiteur",
  verified: true,
  location: "42 Avenue des Champs-Élysées, 75008 Paris",
  email: "contact@traiteur-excellence.fr",
  phoneNumber: "+33 1 45 62 89 45",
  website: "https://traiteur-excellence.fr",
  
  // Rating : 4.8/5 (189 avis)
  // 6 photos, 1 vidéo, 2 documents, 4 avis
}
```

### Partenaire 3 : Photographie Lumière

```javascript
{
  id: "3",
  name: "Photographie Lumière",
  category: "Photographe",
  verified: true,
  location: "8 Rue Saint-Honoré, 69001 Lyon",
  email: "contact@photographie-lumiere.fr",
  phoneNumber: "+33 4 78 92 45 67",
  website: "https://photographie-lumiere.fr",
  
  // Rating : 5.0/5 (98 avis)
  // 7 photos, 2 vidéos, 3 documents, 4 avis
}
```

---

## 🔧 Configuration Technique

### Variables d'Environnement (`.env`)

```bash
# API Backend
VITE_API_URL=https://api-staging.we-event.eu/api

# Google Maps API
VITE_PLACE_API=AIzaSyBUyl-cCBPqIYXFlPaQ6j_yozS0hVrTbZI

# Environment
VITE_ENVIRONMENT=development
```

### Endpoints API

Tous les endpoints utilisent le préfixe `/api` :

```javascript
// Authentication
LOGIN: https://api-staging.we-event.eu/api/auth/login
SIGNUP: https://api-staging.we-event.eu/api/auth/signup
FORGOT_PASSWORD: https://api-staging.we-event.eu/api/auth/forgot-password

// User
GET_USER_DETAILS: https://api-staging.we-event.eu/api/users/me
UPDATE_PROFILE: https://api-staging.we-event.eu/api/users

// Business
BUSINESS_PROFILE: https://api-staging.we-event.eu/api/business/profile
BUSINESS_RATING: https://api-staging.we-event.eu/api/business/ratings

// Et tous les autres endpoints...
```

---

## 📊 Commits Inclus

```
0154b87 - fix: Add /api prefix to VITE_API_URL for correct API routing
f12a10a - feat: Configure frontend to use correct staging API domain
ca63629 - feat: Connect frontend to EC2 backend instance
90753c9 - feat: Add Vite proxy configuration to solve API connection issues
13ff0b7 - fix: Correct user role path in ProtectedRoute for dashboard access
f58f043 - refactor: Swap About and Services sections in ProviderDetailsV2
52cc701 - refactor: Reorganize ProviderDetailsV2 layout - Portfolio first, Documents & Reviews in sidebar
e701afe - feat: Enhance ProviderDetailsV2 with white title, social media icons, videos & documents
abe8ec0 - fix: Fix Redux selector and modal close icons in ProviderDetailsV2
e7cd4c7 - feat: Create new ProviderDetailsV2 with modern fluid design
```

---

## 🚀 Comment Tester

### 1. Cloner et Installer

```bash
git clone https://github.com/besteventstraiteur/we-event-test.git
cd we-event-test
git checkout we-event-test-robin
npm install
```

### 2. Configuration

Créer un fichier `.env` à la racine :

```bash
VITE_API_URL=https://api-staging.we-event.eu/api
VITE_PLACE_API=AIzaSyBUyl-cCBPqIYXFlPaQ6j_yozS0hVrTbZI
VITE_ENVIRONMENT=development
```

### 3. Démarrer le Serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5173`

### 4. Tester les Fonctionnalités

#### a) Pages Partenaires V2
1. Aller sur `/partners-v2/1` (Élégance Florale)
2. Vérifier :
   - ✅ Portfolio avec lightbox
   - ✅ Sections dans le bon ordre
   - ✅ Sidebar avec documents et avis
   - ✅ Vidéos YouTube
   - ✅ Bouton "Demander un devis" (modal)

#### b) Authentification
1. Aller sur `/login`
2. Se connecter avec vos identifiants
3. Vérifier la redirection vers le dashboard approprié
4. Tester `/logout`

#### c) Dashboards
1. Se connecter en tant qu'admin/client/partenaire
2. Vérifier l'accès au dashboard correspondant
3. Tester les différentes sections

---

## 🐛 Bugs Connus & Corrections

### ✅ Bug 1 : Routes Protégées (RÉSOLU)
**Problème :** Les dashboards étaient inaccessibles après connexion  
**Cause :** Mauvais chemin Redux (`login.user.role` au lieu de `login.data.role`)  
**Correction :** Commit `13ff0b7`  
**Statut :** ✅ Résolu

### ✅ Bug 2 : Routes API non trouvées (RÉSOLU)
**Problème :** Erreur "Route POST:/auth/login not found"  
**Cause :** Manque du préfixe `/api` dans l'URL de base  
**Correction :** Commit `0154b87`  
**Statut :** ✅ Résolu

### ✅ Bug 3 : Connexion API (RÉSOLU)
**Problème :** "Network Error" lors de la connexion  
**Cause :** Mauvaise URL API (utilisait `https://api.we-event.com` au lieu de `https://api-staging.we-event.eu`)  
**Correction :** Commits `f12a10a`, `ca63629`  
**Statut :** ✅ Résolu

---

## 📚 Documentation Technique

### Structure des Fichiers Modifiés

```
src/
├── pages/
│   └── ProviderDetailsV2.tsx        # Nouvelle page partenaires
├── styles/
│   └── provider-details-v2.css      # Styles de la page V2
├── data/
│   └── fakePartnerDetails.ts        # Données fake pour 3 partenaires
├── routes/
│   └── ProtectedRoute.tsx           # Routes protégées (corrigé)
└── utils/
    └── endPoints/
        └── index.tsx                # Configuration des endpoints API
```

### Technologies Utilisées

- **React 19.1.1**
- **TypeScript 5.8.3**
- **Vite 7.1.2**
- **TailwindCSS 4.1.12**
- **Redux Toolkit** (pour l'état global)
- **Framer Motion** (animations)
- **Fancybox** (lightbox portfolio)
- **Swiper** (carousels)
- **Axios** (requêtes HTTP)
- **Lucide React** (icônes)

---

## 🔗 Liens Utiles

- **Pull Request :** https://github.com/besteventstraiteur/we-event-test/pull/3
- **Repository :** https://github.com/besteventstraiteur/we-event-test
- **Branche :** `we-event-test-robin`
- **Application de test :** https://5174-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai

---

## 👤 Pour Robin

### Checklist de Test

- [ ] Tester la page `/partners-v2/1` (Élégance Florale)
- [ ] Vérifier le portfolio avec lightbox
- [ ] Tester les vidéos YouTube
- [ ] Vérifier les documents téléchargeables
- [ ] Tester le bouton "Demander un devis"
- [ ] Vérifier les avis clients
- [ ] Tester la connexion avec ses identifiants
- [ ] Accéder au dashboard approprié (selon son rôle)
- [ ] Tester sur mobile/tablette (responsive)
- [ ] Rapporter tout bug ou suggestion

### Contact

Pour toute question ou problème, contactez l'équipe de développement via les issues GitHub ou la Pull Request #3.

---

**Dernière mise à jour :** 2026-02-13  
**Version :** 1.0.0  
**Statut :** ✅ Prêt pour les tests
