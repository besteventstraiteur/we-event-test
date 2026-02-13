# 🌟 ADDENDUM - SYSTÈME DE NOTATION MUTUELLE

**Date d'ajout :** 2026-02-13  
**Phase associée :** Phase 1 (Fondations) & Phase 2 (Client)  
**Priorité :** HAUTE ⭐⭐⭐  
**Durée estimée :** +1 semaine

---

## 🎯 OBJECTIF

Permettre aux prestataires (Partners) de noter les clients après un événement, et aux prestataires de se noter entre eux lorsqu'ils ont collaboré sur un même événement.

---

## 📋 FONCTIONNALITÉS

### 1. Prestataire → Client (Partner rates Client)
Un partenaire peut noter un client après avoir terminé une prestation lors d'un événement.

**Cas d'usage :**
- Client difficile / agréable
- Respect des engagements (paiements, délais)
- Communication (clarté, réactivité)
- Respect des lieux / matériel

### 2. Prestataire → Prestataire (Partner rates Partner)
Deux prestataires ayant collaboré sur un même événement peuvent se noter mutuellement.

**Cas d'usage :**
- Professionnalisme
- Ponctualité
- Qualité du travail
- Collaboration / esprit d'équipe

---

## 🗄️ NOUVELLE ENTITÉ : `PartnerRating`

### Schema SQL
```sql
CREATE TABLE partner_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Qui note
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rater_type VARCHAR(20) NOT NULL CHECK (rater_type IN ('partner')),
    
    -- Qui est noté
    rated_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rated_type VARCHAR(20) NOT NULL CHECK (rated_type IN ('client', 'partner')),
    
    -- Contexte
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Notation (1-5 étoiles)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Critères détaillés (optionnel)
    criteria JSONB,
    -- Exemple: {
    --   "professionalism": 5,
    --   "communication": 4,
    --   "punctuality": 5,
    --   "quality": 4
    -- }
    
    -- Commentaire
    comment TEXT,
    
    -- Visibilité
    is_public BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Contrainte: un partenaire ne peut noter qu'une seule fois par combinaison
    UNIQUE(rater_id, rated_id, event_id)
);

-- Index pour performance
CREATE INDEX idx_partner_ratings_rater ON partner_ratings(rater_id);
CREATE INDEX idx_partner_ratings_rated ON partner_ratings(rated_id);
CREATE INDEX idx_partner_ratings_event ON partner_ratings(event_id);
CREATE INDEX idx_partner_ratings_type ON partner_ratings(rated_type);
```

---

## 🔧 ENDPOINTS API À CRÉER

### 1. Créer une notation
```http
POST /api/partner-ratings
Authorization: Bearer {token}

{
  "rated_id": "uuid-client-ou-partner",
  "rated_type": "client" | "partner",
  "event_id": "uuid-event",
  "booking_id": "uuid-booking" (optionnel),
  "rating": 4,
  "criteria": {
    "professionalism": 5,
    "communication": 4,
    "punctuality": 4,
    "quality": 5
  },
  "comment": "Très professionnel, bonne collaboration",
  "is_public": true,
  "is_anonymous": false
}

Response:
{
  "success": true,
  "data": { ...rating object }
}
```

### 2. Récupérer les notations données
```http
GET /api/partner-ratings/given
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rated_user": {
        "id": "uuid",
        "name": "Client Name",
        "type": "client"
      },
      "event": {
        "id": "uuid",
        "title": "Mariage Sophie & Marc"
      },
      "rating": 5,
      "comment": "...",
      "created_at": "2025-12-20"
    }
  ]
}
```

### 3. Récupérer les notations reçues
```http
GET /api/partner-ratings/received
Authorization: Bearer {token}

Response: (même structure que /given)
```

### 4. Moyenne des notations d'un utilisateur
```http
GET /api/partner-ratings/average/:userId
Query params:
  - type: "client" | "partner"
  - public_only: true/false

Response:
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "average_rating": 4.7,
    "total_ratings": 23,
    "breakdown": {
      "5_stars": 15,
      "4_stars": 6,
      "3_stars": 2,
      "2_stars": 0,
      "1_star": 0
    },
    "criteria_averages": {
      "professionalism": 4.8,
      "communication": 4.6,
      "punctuality": 4.7,
      "quality": 4.9
    }
  }
}
```

### 5. Notations d'un événement
```http
GET /api/partner-ratings/event/:eventId
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "event_id": "uuid",
    "ratings": [
      {
        "rater": { "id": "uuid", "name": "Traiteur Excellence", "type": "partner" },
        "rated": { "id": "uuid", "name": "Photographie Lumière", "type": "partner" },
        "rating": 5,
        "comment": "Excellente collaboration",
        "created_at": "..."
      }
    ]
  }
}
```

### 6. Vérifier si une notation existe
```http
GET /api/partner-ratings/exists
Query params:
  - rated_id: uuid
  - event_id: uuid

Response:
{
  "exists": true/false,
  "rating": { ...existing rating } (si exists=true)
}
```

---

## 🎨 INTERFACES FRONTEND

### 1. Page Partenaire - Section "Mes Notations"
**Route :** `/partner/ratings`

**Tabs :**
- **Reçues** (notations clients + autres partenaires)
- **Données** (mes notations clients + autres partenaires)

**Affichage :**
```tsx
<div className="ratings-section">
  <div className="tabs">
    <button onClick={() => setTab('received')}>
      Reçues ({receivedCount})
    </button>
    <button onClick={() => setTab('given')}>
      Données ({givenCount})
    </button>
  </div>

  {/* Statistiques en haut */}
  <div className="stats-cards">
    <StatCard 
      title="Note moyenne" 
      value={averageRating} 
      icon={<Star />}
    />
    <StatCard 
      title="Total notations" 
      value={totalRatings}
    />
  </div>

  {/* Liste des notations */}
  <div className="ratings-list">
    {ratings.map(rating => (
      <RatingCard 
        key={rating.id}
        rating={rating}
        type={tab}
      />
    ))}
  </div>
</div>
```

### 2. Modale "Noter un client/partenaire"
**Trigger :** Après un événement terminé

**Composant :**
```tsx
<Modal title="Noter votre client - Marie Dubois">
  <form onSubmit={handleSubmit}>
    {/* Note globale (étoiles) */}
    <StarRating 
      value={rating}
      onChange={setRating}
      size="large"
    />

    {/* Critères détaillés */}
    <div className="criteria">
      <CriterionSlider 
        label="Professionnalisme"
        value={criteria.professionalism}
        onChange={(v) => setCriteria({...criteria, professionalism: v})}
      />
      <CriterionSlider 
        label="Communication"
        value={criteria.communication}
        onChange={(v) => setCriteria({...criteria, communication: v})}
      />
      {/* ... autres critères */}
    </div>

    {/* Commentaire */}
    <Textarea 
      placeholder="Votre commentaire (optionnel)"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />

    {/* Options */}
    <Checkbox 
      checked={isPublic}
      onChange={setIsPublic}
      label="Rendre cette notation publique"
    />
    <Checkbox 
      checked={isAnonymous}
      onChange={setAnonymous}
      label="Notation anonyme"
    />

    <Button type="submit">Envoyer la notation</Button>
  </form>
</Modal>
```

### 3. Widget Notation (Profil Client / Partenaire)
**Affichage sur profils publics :**

```tsx
<div className="rating-widget">
  <div className="rating-header">
    <span className="average">{averageRating.toFixed(1)}</span>
    <Stars value={averageRating} />
    <span className="count">({totalRatings} avis)</span>
  </div>

  {/* Répartition étoiles */}
  <div className="breakdown">
    {[5,4,3,2,1].map(star => (
      <div key={star} className="bar-row">
        <span>{star} ⭐</span>
        <ProgressBar 
          value={breakdown[`${star}_stars`]} 
          max={totalRatings}
        />
        <span>{breakdown[`${star}_stars`]}</span>
      </div>
    ))}
  </div>

  {/* Critères moyens */}
  <div className="criteria-avg">
    {Object.entries(criteriaAverages).map(([key, value]) => (
      <div key={key} className="criterion">
        <span>{key}</span>
        <div className="value">{value.toFixed(1)}/5</div>
      </div>
    ))}
  </div>
</div>
```

---

## 🔐 RÈGLES DE VALIDATION & SÉCURITÉ

### Qui peut noter qui ?
| Notateur | Noté | Condition |
|----------|------|-----------|
| Partner | Client | Avoir travaillé ensemble (booking confirmé + event terminé) |
| Partner | Partner | Avoir collaboré sur le même événement |
| Client | Partner | ✅ Déjà existant (Review système actuel) |

### Contraintes
1. **Un seul rating par combinaison** : `UNIQUE(rater_id, rated_id, event_id)`
2. **Événement terminé** : `event.end_date < NOW()`
3. **Booking confirmé** : `booking.status IN ('confirmed', 'completed')`
4. **Authentification** : Seul le partenaire connecté peut noter
5. **Pas d'auto-notation** : `rater_id != rated_id`

### Validation Backend
```typescript
// middleware: canRateUser.ts
export const canRateUser = async (req, res, next) => {
  const { rated_id, event_id } = req.body;
  const rater_id = req.user.id;

  // 1. Vérifier que l'événement est terminé
  const event = await Event.findById(event_id);
  if (event.end_date > new Date()) {
    return res.status(403).json({ error: "Event not finished" });
  }

  // 2. Vérifier la participation (booking confirmé)
  const booking = await Booking.findOne({
    event_id,
    partner_id: rater_id,
    status: ['confirmed', 'completed']
  });
  
  if (!booking) {
    return res.status(403).json({ error: "No confirmed booking" });
  }

  // 3. Vérifier qu'il n'a pas déjà noté
  const existing = await PartnerRating.findOne({
    rater_id,
    rated_id,
    event_id
  });

  if (existing) {
    return res.status(409).json({ error: "Already rated" });
  }

  next();
};
```

---

## 🎯 INTÉGRATION DANS LE PLAN EXISTANT

### Phase 1 (Fondations) - Ajout
- Créer table `partner_ratings`
- Créer endpoints API `/api/partner-ratings/*`
- Créer service frontend `src/services/partnerRatingService.ts`
- Créer types TypeScript `src/types/partnerRating.ts`

### Phase 2 (Espace Client) - Ajout
- Widget notation sur profil client (visible par partenaires)
- Liste des notations reçues dans `/client/profile`

### Phase 3 (Espace Partenaire) - Ajout Principal ⭐
- Page `/partner/ratings` (Reçues / Données)
- Modale "Noter un client" (après événement)
- Modale "Noter un partenaire" (après événement)
- Widget notation sur profil partenaire public
- Badge notation moyenne sur carte partenaire (marketplace)

### Phase 4 (Espace Admin) - Ajout
- Modération des notations signalées
- Statistiques globales (moyenne plateforme)
- Export données notations

---

## 📦 COMPOSANTS RÉUTILISABLES

### 1. StarRating.tsx
```tsx
interface StarRatingProps {
  value: number; // 0-5
  onChange?: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ ... }) => {
  // Composant étoiles cliquable ou readonly
};
```

### 2. RatingCard.tsx
```tsx
interface RatingCardProps {
  rating: PartnerRating;
  type: 'given' | 'received';
  showEvent?: boolean;
}

export const RatingCard: React.FC<RatingCardProps> = ({ ... }) => {
  return (
    <div className="rating-card">
      <div className="header">
        <Avatar user={rating.user} />
        <div>
          <h4>{rating.user.name}</h4>
          <p>{rating.event.title}</p>
        </div>
        <StarRating value={rating.rating} readonly />
      </div>
      <p>{rating.comment}</p>
      <span>{formatDate(rating.created_at)}</span>
    </div>
  );
};
```

### 3. RatingModal.tsx
```tsx
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratedUser: User;
  event: Event;
  onSubmit: (data: CreateRatingData) => Promise<void>;
}

export const RatingModal: React.FC<RatingModalProps> = ({ ... }) => {
  // Modale complète avec formulaire
};
```

---

## 📊 STATISTIQUES À CALCULER

### Profil Client
- Note moyenne reçue (des partenaires)
- Total notations reçues
- Répartition étoiles
- Badge "Client fiable" si avg >= 4.5

### Profil Partenaire
- Note moyenne reçue (clients + partenaires)
- Total notations reçues
- Critères moyens (professionalism, communication, etc.)
- Badge "Partenaire recommandé" si avg >= 4.7
- Badge "Excellent collaborateur" si avg >= 4.8 (notations partenaires uniquement)

### Marketplace (Partenaires)
- Afficher note moyenne + nombre d'avis sur chaque carte
- Filtrer par note minimale
- Trier par note décroissante

---

## 🚀 PLAN D'IMPLÉMENTATION

### Sprint 1 (Backend) - 2 jours
1. ✅ Créer migration SQL `partner_ratings`
2. ✅ Créer modèle `PartnerRating.ts` (Sequelize ou Prisma)
3. ✅ Créer routes `/api/partner-ratings/*`
4. ✅ Implémenter middleware `canRateUser`
5. ✅ Tests unitaires API

### Sprint 2 (Frontend Services) - 1 jour
1. ✅ Créer types `src/types/partnerRating.ts`
2. ✅ Créer service `src/services/partnerRatingService.ts`
3. ✅ Créer composant `StarRating.tsx`
4. ✅ Créer composant `RatingCard.tsx`

### Sprint 3 (Espace Partenaire) - 2 jours
1. ✅ Page `/partner/ratings` (structure + tabs)
2. ✅ Fetch notations reçues/données
3. ✅ Composant `RatingModal.tsx`
4. ✅ Intégration dans dashboard partenaire (notifications)

### Sprint 4 (Widgets & Profils) - 1 jour
1. ✅ Widget notation sur profil client
2. ✅ Widget notation sur profil partenaire public
3. ✅ Badge notation sur carte marketplace

### Sprint 5 (Admin & Tests) - 1 jour
1. ✅ Page admin modération
2. ✅ Tests E2E (Playwright ou Cypress)
3. ✅ Documentation utilisateur

**Total estimé : 1 semaine (5 jours ouvrés)**

---

## 🎨 MOCKUPS VISUELS (Descriptions)

### 1. Modal Noter un Client
```
┌─────────────────────────────────────────┐
│  Noter votre client - Marie Dubois      │
├─────────────────────────────────────────┤
│                                         │
│  Note globale:                          │
│  ⭐⭐⭐⭐☆  (4/5)                         │
│                                         │
│  Critères détaillés:                    │
│  Professionnalisme:  ●●●●● (5)          │
│  Communication:      ●●●●○ (4)          │
│  Ponctualité:        ●●●●● (5)          │
│  Respect contrat:    ●●●●○ (4)          │
│                                         │
│  Commentaire (optionnel):               │
│  ┌─────────────────────────────────┐   │
│  │ Client très professionnel...     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☑ Rendre publique                      │
│  ☐ Anonyme                              │
│                                         │
│  [Annuler]  [Envoyer ✓]                │
└─────────────────────────────────────────┘
```

### 2. Page Partenaire - Notations
```
┌─────────────────────────────────────────┐
│  Mes Notations                          │
│  [Reçues (12)] [Données (8)]            │
├─────────────────────────────────────────┤
│                                         │
│  📊 Statistiques                        │
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ 4.8 │ │  12 │ │ 98% │              │
│  │ ⭐  │ │ avis│ │fiab.│              │
│  └─────┘ └─────┘ └─────┘              │
│                                         │
│  🔹 Marie Dubois (Client)               │
│     Mariage Sophie & Marc               │
│     ⭐⭐⭐⭐⭐ (5/5)                       │
│     "Excellente collaboration..."       │
│     12/01/2025                          │
│                                         │
│  🔹 Traiteur Excellence (Partenaire)    │
│     Anniversaire Julie                  │
│     ⭐⭐⭐⭐☆ (4/5)                       │
│     "Professionnel, recommandé."        │
│     05/01/2025                          │
└─────────────────────────────────────────┘
```

---

## 🔄 IMPACT SUR LE PLAN EXISTANT

### Modifications de durée
| Phase | Durée Originale | Nouvelle Durée | Ajout |
|-------|-----------------|----------------|-------|
| Phase 1 (Fondations) | 2 semaines | 2.5 semaines | +3 jours |
| Phase 2 (Client) | 4 semaines | 4 semaines | (Widget léger) |
| Phase 3 (Partenaire) | 3 semaines | 3.5 semaines | +2 jours |
| Phase 4 (Admin) | 2 semaines | 2 semaines | +0.5 jour |

**Total ajout : +1 semaine**

### Nouvelles tâches prioritaires
1. **Haute priorité ⭐⭐⭐** (Sprint 1-3)
   - Backend + API
   - Page partenaire notations
   - Modale notation

2. **Moyenne priorité ⭐⭐** (Sprint 4)
   - Widgets profils
   - Marketplace badge

3. **Basse priorité ⭐** (Sprint 5)
   - Admin modération
   - Export données

---

## ✅ CHECKLIST DE VALIDATION

### Backend
- [ ] Table `partner_ratings` créée avec contraintes
- [ ] Index de performance ajoutés
- [ ] Endpoints API testés (Postman/Jest)
- [ ] Middleware validation fonctionnel
- [ ] Calculs moyennes optimisés

### Frontend
- [ ] Page `/partner/ratings` fonctionnelle
- [ ] Modale notation testée (UX fluide)
- [ ] Widgets profils affichent données correctes
- [ ] Badge marketplace visible
- [ ] Responsive (mobile + desktop)

### Tests
- [ ] Tests unitaires API (>80% coverage)
- [ ] Tests E2E scénarios principaux
- [ ] Performance (< 200ms requêtes API)
- [ ] Accessibilité (WCAG AA)

### Documentation
- [ ] README mis à jour
- [ ] API documentation (Swagger)
- [ ] Guide utilisateur (tutoriel notation)

---

## 🎯 PROCHAINES ÉTAPES

1. **Validation du plan** avec vous ✋
2. **Création de la branche** `feature/partner-mutual-ratings`
3. **Sprint 1** : Backend + API (2 jours)
4. **Test intermédiaire** : Validation endpoints
5. **Sprint 2-3** : Frontend (3 jours)
6. **Test final** : E2E complet
7. **Merge** vers `we-event-test-robin`

---

**Questions ?**
- Quelle visibilité par défaut pour les notations ? (public/privé)
- Faut-il un délai après événement pour noter ? (ex: 7 jours max)
- Les clients peuvent-ils voir les notations que les partenaires leur ont données ?
- Modération automatique ou manuelle des commentaires ?

---

**Document créé le :** 2026-02-13  
**Auteur :** Assistant IA  
**Dernière mise à jour :** 2026-02-13
