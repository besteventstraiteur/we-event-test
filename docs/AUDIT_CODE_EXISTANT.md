# 🔍 AUDIT DU CODE EXISTANT - We Event

**Date :** 2026-02-13  
**Branche :** `we-event-test-robin`  
**Objectif :** Comprendre la structure actuelle avant développement des nouvelles fonctionnalités

---

## 📁 STRUCTURE DU PROJET

### Architecture globale

```
/home/user/webapp/
├── src/
│   ├── components/       # 52 sous-dossiers de composants React
│   ├── pages/            # Pages principales
│   ├── redux/            # État global Redux
│   ├── utils/            # Utilitaires (API, auth, helpers)
│   ├── data/             # Données mockées (fakePartnerDetails.ts)
│   ├── styles/           # Styles CSS
│   ├── routes/           # Configuration des routes
│   ├── module/           # Modules métier
│   └── locales/          # i18n (internationalisation)
├── docs/                 # Documentation complète (90 KB)
├── public/               # Assets statiques
├── .env                  # Variables d'environnement
└── package.json          # Dépendances
```

---

## 🏗️ ARCHITECTURE TECHNIQUE ACTUELLE

### 1. État Global (Redux)

**Localisation :** `src/redux/`

```
src/redux/
├── store/
│   └── index.tsx          # Configuration store + Redux Persist
├── reducers/
│   └── index.ts           # Root reducer
│   └── requestReducer.ts  # Gestion requêtes HTTP
├── CommonReducers/
│   └── ContentReducer.js  # Exemple de reducer
├── actions/               # Action creators
├── rootSaga/              # Redux Saga (side effects)
└── middleware/            # Middlewares custom
```

**Configuration actuelle :**
- ✅ Redux Toolkit (`configureStore`)
- ✅ Redux Saga (gestion des effets de bord)
- ✅ Redux Persist (persistence locale avec `secureStorage`)
- ✅ Whitelist : `['login']` (seul login persiste)

**Store existant :**
```typescript
// src/redux/store/index.tsx
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
```

---

### 2. Client HTTP (API)

**Localisation :** `src/utils/http-client/axiosClient.ts`

**Fonctions disponibles :**
```typescript
getRequest(URL)
postRequest(URL, payload, headers)
putRequest(URL, payload, headers)
patchRequest(URL, payload, headers)
deleteRequest(URL, payload, headers)
cancelRequest() // Abort controller
apiRequest(endPoint, data, method, headers)
```

**Caractéristiques :**
- ✅ Axios configuré
- ✅ Gestion automatique du token (`x-auth-token`)
- ✅ Support FormData (multipart/form-data)
- ✅ Headers par défaut : `Accept`, `Content-Type`, `x-lang`, `Accept-Language`
- ✅ Abort Controller (annulation requêtes)
- ⚠️ **Problème :** Header `x-auth-token` (non standard, devrait être `Authorization: Bearer {token}`)

---

### 3. Endpoints API

**Localisation :** `src/utils/endPoints/index.tsx`

**BASE_URL :** `VITE_API_URL` (actuellement `https://api-staging.we-event.eu/api`)

**Endpoints existants :**

| Module | Endpoints | Statut |
|--------|-----------|--------|
| **AUTH** | login, signup, verify, forgot-password, reset-password, MFA, social | ✅ Complet |
| **USERS** | me, update profile, favorites | ✅ Fonctionnel |
| **BUSINESS** | profile, ratings, request quote, nearby | ✅ Existant |
| **EVENTS** | create, list, detail, budget, expense, tasks, site | ✅ Existant |
| **GUESTS** | list, add, update | ✅ Existant |
| **SUBSCRIPTION** | plans, subscribe, cancel, upgrade | ✅ Existant |
| **AFFILIATE** | dashboard, referral code, network, payout | ✅ Existant |
| **CONTENT** | get, update web content | ✅ Existant |
| **UPLOAD** | file upload | ✅ Existant |

**Total :** ~90 endpoints déjà définis

---

### 4. Composants & Pages

**Localisation :** `src/components/` (52 dossiers) + `src/pages/`

**Composants clés identifiés :**

```
src/components/
├── auth/                  # LoginForm, SignupForm, PasswordReset, etc.
├── dashboard/             # Partner dashboard
├── client-dashboard/      # Client dashboard
├── crm/                   # CRM (contacts, invoices, quotes, opportunities)
├── calendar/              # Calendrier
├── guest/                 # Gestion invités
├── floor-planner/         # Plan de salle
├── mini-site/             # Mini-sites événements
├── contact/               # Formulaire contact
├── budget/                # Gestion budget
├── event-tasks/           # Tâches événement
└── ...
```

**Pages principales :**
- `Provider-details.tsx` (ancienne version)
- `ProviderDetailsV2.tsx` (nouvelle version avec design moderne)

---

### 5. Données Mockées

**Localisation :** `src/data/fakePartnerDetails.ts`

**Contenu :**
- 3 partenaires fictifs (Élégance Florale, Traiteur Excellence, Photographie Lumière)
- Utilisé pour `/partners-v2/:id` en attendant l'API complète

---

### 6. Utilitaires

**Localisation :** `src/utils/`

```
src/utils/
├── Auth/                  # getToken(), setToken(), isAuthenticated()
├── Errors/                # Gestion erreurs
├── common/                # Fonctions utilitaires
├── constants/             # Constantes globales
├── endPoints/             # Endpoints API (déjà vu)
├── firebase.ts            # Configuration Firebase
├── helpers/               # Helpers divers
├── http-client/           # Axios client (déjà vu)
├── localStorage/          # Gestion localStorage
├── middleWare/            # Middlewares
├── notifications.ts       # Système de notifications
├── pagination.ts          # Pagination
├── toast/                 # Toasts (messages)
├── uploadfile/            # Upload fichiers
├── validationsMessages/   # Messages de validation
└── validationsRules/      # Règles de validation
```

---

## ✅ POINTS FORTS IDENTIFIÉS

1. **Architecture Redux bien structurée**
   - Redux Toolkit moderne
   - Redux Saga pour les side effects
   - Redux Persist pour la persistance

2. **Client HTTP fonctionnel**
   - Axios configuré
   - Gestion automatique du token
   - Support multipart/form-data

3. **Composants riches**
   - 52 dossiers de composants
   - CRM complet
   - Dashboard client et partenaire
   - Mini-sites, floor planner, calendrier

4. **Endpoints API nombreux**
   - ~90 endpoints déjà définis
   - Modules : Auth, Events, Business, Guests, Subscription, etc.

5. **Internationalisation**
   - i18n configuré
   - Support multi-langues

---

## ⚠️ POINTS À AMÉLIORER

### 1. Structure des services

**Problème :** Pas de dossier `src/services/`

**Solution :** Créer une couche d'abstraction entre composants et API

```
src/services/
├── eventService.ts        # CRUD événements
├── packageService.ts      # CRUD packages
├── bookingService.ts      # CRUD réservations
├── messageService.ts      # Messagerie
├── partnerRatingService.ts # Notation mutuelle
└── ...
```

**Bénéfices :**
- Séparation des responsabilités
- Réutilisabilité
- Testabilité
- Documentation centralisée

---

### 2. Types TypeScript

**Problème :** Pas de dossier `src/types/` centralisé

**Solution :** Créer des types pour toutes les entités

```
src/types/
├── api.ts                 # Types API génériques
├── event.ts               # Type Event
├── package.ts             # Type Package
├── booking.ts             # Type Booking
├── message.ts             # Type Message
├── partnerRating.ts       # Type PartnerRating
└── ...
```

---

### 3. Header Authorization non standard

**Problème :** Utilise `x-auth-token` au lieu de `Authorization: Bearer`

**Solution :** Modifier `axiosClient.ts` pour utiliser le standard

```typescript
// Avant
headers["x-auth-token"] = token;

// Après
headers["Authorization"] = `Bearer ${token}`;
```

⚠️ **Attention :** Nécessite modification backend aussi

---

### 4. Tests

**Problème :** Pas de tests configurés

**Solution :** Ajouter Jest + React Testing Library + Playwright

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test
```

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### MODULE 1 : Infrastructure de base (Jour 1-2)

#### ✅ Tâche 1.1 : Créer la couche Services

**Fichier :** `src/services/api-client.ts`

```typescript
// Wrapper autour d'axiosClient avec types TypeScript
import { getRequest, postRequest, putRequest, deleteRequest } from '../utils/http-client/axiosClient';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await getRequest(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await postRequest(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await putRequest(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await deleteRequest(url, {});
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

#### ✅ Tâche 1.2 : Créer les types de base

**Fichier :** `src/types/api.ts`

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

#### ✅ Tâche 1.3 : Setup tests

```bash
# Installer dépendances
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test

# Créer jest.config.js
# Créer playwright.config.ts
# Ajouter scripts dans package.json
```

---

## 🚀 PRÊT À DÉMARRER LE MODULE 1 ?

**Voulez-vous que je crée :**

1. ✅ **La couche Services** (`src/services/api-client.ts`)
2. ✅ **Les types de base** (`src/types/api.ts`)
3. ✅ **Configuration tests** (Jest + Playwright)

**Dites simplement : "OK, crée le Module 1 Infrastructure"**

Ou si vous préférez une autre approche, je m'adapte !

---

**Résumé de l'audit :**
- ✅ Redux configuré et fonctionnel
- ✅ Client HTTP Axios fonctionnel
- ✅ ~90 endpoints API déjà définis
- ✅ 52 dossiers de composants
- ⚠️ Besoin de Services layer
- ⚠️ Besoin de Types centralisés
- ⚠️ Besoin de Tests

**Prochaine étape :** Module 1 - Infrastructure de base
