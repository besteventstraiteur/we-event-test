# 🧪 GUIDE DE TEST - WE EVENT

## 🌐 URL Sandbox
**https://5175-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai**

---

## 📋 CHECKLIST DE TEST

### ✅ **1. TEST Dashboard Global** (Public)

**URL** : `/test/global-system`

**Actions** :
- [ ] Cliquer "Lancer les tests système"
- [ ] Vérifier que tous les tests passent au vert
- [ ] Cliquer sur chaque card de module (23 modules)
- [ ] Vérifier que chaque page module s'ouvre sans erreur
- [ ] Revenir au dashboard global

**Résultat attendu** :
- ✅ Tous les tests verts
- ✅ 23 modules accessibles
- ✅ Aucune erreur console
- ✅ Design responsive

---

### ✅ **2. TEST Provider Details V2** (Public)

**URL** : `/partners-v2/1`

#### **2.1 Section Hero**
- [ ] Vérifier affichage nom provider
- [ ] Vérifier affichage rating (étoiles + nombre)
- [ ] Vérifier affichage localisation
- [ ] Cliquer "Demander un devis" → Modal s'ouvre
- [ ] Cliquer "Partager" → Modal partage s'ouvre
- [ ] Tester bouton favoris

#### **2.2 Section À propos**
- [ ] Lire description complète
- [ ] Vérifier affichage services (tags)

#### **2.3 Section Packages** ⭐
- [ ] Voir liste des packages (au moins 3)
- [ ] Vérifier prix affiché sur chaque card
- [ ] Voir liste "Inclus" et "Non inclus"
- [ ] Cliquer "Réserver maintenant" sur un package
- [ ] **Modal Booking** s'ouvre :
  - [ ] Package pré-sélectionné
  - [ ] Formulaire avec champs requis
  - [ ] Sélectionner date événement
  - [ ] Entrer nombre participants (min/max respectés)
  - [ ] Prix total calculé automatiquement
  - [ ] Entrer notes optionnelles
  - [ ] Cliquer "Confirmer la réservation"
  - [ ] Toast success apparaît

#### **2.4 Section Ratings & Reviews** ⭐
- [ ] Voir overview ratings :
  - Note moyenne (ex: 4.8/5)
  - Nombre total avis
  - Distribution étoiles (graphique)
- [ ] Voir liste reviews :
  - Avatar utilisateur
  - Nom + date
  - Étoiles rating
  - Texte commentaire
- [ ] Filtrer par nombre étoiles (5★, 4★, etc.)
- [ ] Pagination reviews (si > 5)

#### **2.5 Section Galerie Photos** ⭐
- [ ] Voir grille photos (responsive)
- [ ] Cliquer sur une photo → Lightbox s'ouvre
- [ ] Naviguer dans lightbox (flèches)
- [ ] Fermer lightbox (X ou Esc)
- [ ] Cliquer "Voir toutes les photos"

#### **2.6 Section Vidéos**
- [ ] Voir vidéos YouTube intégrées
- [ ] Lire une vidéo

#### **2.7 Sidebar Contact**
- [ ] Voir infos contact (email, téléphone, adresse)
- [ ] Voir liens réseaux sociaux
- [ ] Cliquer "Demander un devis" → Modal s'ouvre

---

### ✅ **3. TEST Providers List** (Public)

**URL** : `/providers-list`

#### **3.1 Recherche & Filtres**
- [ ] Entrer texte recherche (ex: "Traiteur")
- [ ] Vérifier filtrage en temps réel
- [ ] Cliquer catégorie "Traiteur"
- [ ] Cliquer catégorie "DJ & Animation"
- [ ] Cliquer "Tous" → Voir tous providers
- [ ] Changer tri : "Mieux notés"
- [ ] Changer tri : "Plus d'avis"
- [ ] Changer tri : "Plus de packages"

#### **3.2 Provider Cards**
- [ ] Voir au moins 6 providers
- [ ] Vérifier affichage sur chaque card :
  - Logo/image
  - Nom provider
  - Localisation
  - Rating (étoiles + nombre)
  - Badge "Vérifié" (si applicable)
  - Tags services
  - Nombre packages
- [ ] Hover sur card → Effet animation
- [ ] Cliquer "Voir les détails" → Redirige vers `/partners-v2/:id`

#### **3.3 États**
- [ ] État loading (skeletons)
- [ ] État vide (recherche sans résultat)
- [ ] Cliquer "Réinitialiser filtres"

---

### ✅ **4. TEST My Bookings** (Client - Authentification requise)

**URL** : `/client/bookings`

#### **4.1 Dashboard Stats**
- [ ] Voir 4 cards métriques :
  - Total réservations
  - En attente
  - Confirmées
  - Complétées
- [ ] Vérifier icônes et couleurs

#### **4.2 Filtres & Recherche**
- [ ] Filtrer par statut : "En attente"
- [ ] Filtrer par statut : "Confirmée"
- [ ] Filtrer par statut : "Complétée"
- [ ] Filtrer par statut : "Annulée"
- [ ] Filtrer "Tous"
- [ ] Entrer recherche (nom package ou provider)
- [ ] Changer tri : "Date événement"
- [ ] Changer tri : "Date création"
- [ ] Changer tri : "Prix"

#### **4.3 Booking Cards**
- [ ] Voir liste bookings (au moins 5 mock)
- [ ] Vérifier affichage sur chaque card :
  - Image package
  - Nom package
  - Nom provider
  - Dates événement + création
  - Prix
  - Participants
  - Badge statut (couleur)
- [ ] Hover card → Animation
- [ ] Cliquer "Voir détails"
- [ ] Cliquer "Annuler" sur booking pending
  - [ ] Confirmation modal
  - [ ] Toast success

#### **4.4 États**
- [ ] État loading (skeletons)
- [ ] État vide (aucune réservation)

---

### ✅ **5. TEST Provider Analytics** (Provider - Authentification requise)

**URL** : `/provider/analytics`

#### **5.1 Métriques Clés**
- [ ] Voir 4 cards KPIs :
  - Total revenus (€)
  - Nombre réservations
  - Taux conversion (%)
  - Note moyenne (/5)
- [ ] Vérifier icônes et couleurs
- [ ] Voir trend arrows (↑ ↓)

#### **5.2 Graphiques**
- [ ] **Revenus mensuels** :
  - Voir graphique ligne/bars 12 mois
  - Hover sur points → Tooltip
- [ ] **Réservations par mois** :
  - Voir graphique bars
  - Tooltip
- [ ] **Top 5 Packages** :
  - Voir graphique bars horizontales
  - Labels packages visibles
- [ ] **Distribution Ratings** :
  - Voir graphique circulaire
  - Légende étoiles

#### **5.3 Table Packages**
- [ ] Voir table statistiques packages
- [ ] Colonnes : Nom, Ventes, Revenus, Prix moyen
- [ ] Tri par colonne
- [ ] Pagination (si > 10)

#### **5.4 Navigation**
- [ ] Cliquer "← Retour au dashboard"

---

### ✅ **6. TEST Provider Package Management** (Provider - Auth requise)

**URL** : `/provider/packages`

#### **6.1 Liste Packages**
- [ ] Voir au moins 4 packages mock
- [ ] Vérifier affichage cards :
  - Nom package
  - Prix
  - Liste inclus
  - Badge "Actif" ou "Inactif"
- [ ] Hover card → Animation

#### **6.2 Actions Cards**
- [ ] Cliquer "Éditer" sur un package
  - [ ] Formulaire pré-rempli
  - [ ] Modifier nom, prix
  - [ ] Modifier inclus/exclus
  - [ ] Sauvegarder
  - [ ] Toast success
- [ ] Cliquer "Supprimer"
  - [ ] Modal confirmation
  - [ ] Confirmer suppression
  - [ ] Toast success
  - [ ] Card disparaît

#### **6.3 Créer Nouveau Package**
- [ ] Cliquer "Créer un nouveau package"
- [ ] Remplir formulaire :
  - [ ] Nom (requis)
  - [ ] Description (optionnel)
  - [ ] Prix (requis, nombre)
  - [ ] Inclus (multi-select ou tags)
  - [ ] Exclus (multi-select)
  - [ ] Capacité min (nombre)
  - [ ] Capacité max (nombre)
  - [ ] Toggle actif/inactif
- [ ] Cliquer "Créer le package"
- [ ] Toast success
- [ ] Nouveau package apparaît dans liste

#### **6.4 Validation**
- [ ] Tester validation champs requis
- [ ] Tester validation prix > 0
- [ ] Tester validation capacité max > min

---

### ✅ **7. TEST Messaging System** (Client/Provider - Auth requise)

**URL** : `/client/messages` ou `/provider/messages`

#### **7.1 Layout 3 Colonnes**
- [ ] Sidebar conversations (gauche)
- [ ] Zone chat (centre)
- [ ] Info contact (droite)

#### **7.2 Sidebar Conversations**
- [ ] Voir liste conversations (au moins 5)
- [ ] Affichage sur chaque item :
  - Avatar
  - Nom contact
  - Dernier message preview
  - Timestamp
  - Badge unread count (si non lu)
- [ ] Rechercher conversation (input search)
- [ ] Cliquer sur conversation → Active

#### **7.3 Zone Chat**
- [ ] Voir header avec nom contact actif
- [ ] Voir historique messages :
  - Bulles sender (droite, bleu)
  - Bulles receiver (gauche, gris)
  - Timestamps
  - Avatar
- [ ] Scroll auto vers dernier message
- [ ] Textarea "Écrire un message..."
- [ ] Taper message
- [ ] Cliquer "Envoyer" ou Enter
- [ ] Message apparaît immédiatement (mock)

#### **7.4 Info Contact**
- [ ] Voir avatar contact actif
- [ ] Voir nom, email, téléphone
- [ ] Boutons actions (Appeler, Email)

#### **7.5 États**
- [ ] État vide (aucune conversation)
- [ ] État loading
- [ ] Typing indicator (si implémenté)

---

### ✅ **8. TEST Responsive Mobile**

**Devices à tester** :
- iPhone SE (375px)
- iPhone 12/13 (390px)
- Samsung Galaxy (360px)
- iPad (768px)
- iPad Pro (1024px)

#### **8.1 Navigation Mobile**
- [ ] Menu burger visible sur mobile
- [ ] Cliquer burger → Menu ouvre
- [ ] Navigation fonctionne
- [ ] Fermer menu

#### **8.2 Composants Responsive**
- [ ] **Provider Cards** : 1 col mobile → 2-3 cols desktop
- [ ] **Package Cards** : Stack vertical mobile
- [ ] **Booking Cards** : Grid adaptatif
- [ ] **Analytics Graphs** : Scrollable horizontal si nécessaire
- [ ] **Messaging** : 1 col mobile (switch entre conversations/chat)
- [ ] **Modals** : Full screen mobile, centré desktop

#### **8.3 Touch Interactions**
- [ ] Tap buttons
- [ ] Swipe gallery photos
- [ ] Scroll smooth
- [ ] Forms utilisables

---

### ✅ **9. TEST Dark Mode**

**Comment activer** :
- Changer thème système OS
- Ou toggle dans settings site (si implémenté)

#### **9.1 Vérifications**
- [ ] Tous les composants switchent dark mode
- [ ] Contraste suffisant (texte lisible)
- [ ] Cards backgrounds dark
- [ ] Borders visible
- [ ] Icons adaptés
- [ ] Graphs lisibles

---

### ✅ **10. TEST Performance**

#### **10.1 Lighthouse Score**
- [ ] Ouvrir DevTools → Lighthouse
- [ ] Lancer audit
- [ ] Vérifier scores :
  - Performance > 80
  - Accessibility > 90
  - Best Practices > 85
  - SEO > 80

#### **10.2 Temps de Chargement**
- [ ] HomePage : < 2s
- [ ] Provider Details : < 3s
- [ ] Analytics Dashboard : < 3s
- [ ] Liste providers : < 2s

#### **10.3 Network**
- [ ] Pas de requêtes qui échouent
- [ ] Images optimisées
- [ ] Lazy loading fonctionne

---

## 🐛 **BUGS DÉTECTÉS**

### **Comment reporter un bug** :

**Template** :
```
**Titre** : [Page] Description courte
**URL** : /chemin/de/la/page
**Steps to reproduce** :
1. Action 1
2. Action 2
3. Résultat incorrect

**Expected** : Ce qui devrait se passer
**Actual** : Ce qui se passe réellement
**Browser** : Chrome 120 / Safari 17 / etc.
**Device** : Desktop / Mobile (préciser modèle)
**Screenshot** : (si possible)
```

---

## ✅ **CHECKLIST FINALE**

Avant de considérer le site "PRODUCTION READY" :

- [ ] Tous les tests ci-dessus PASSENT
- [ ] 0 erreurs console
- [ ] 0 warnings bloquants
- [ ] Performance > 80 sur Lighthouse
- [ ] Responsive testé sur 5 devices minimum
- [ ] Dark mode fonctionne partout
- [ ] Formulaires validés correctement
- [ ] Images chargent correctement
- [ ] Animations fluides (60 FPS)
- [ ] Backend API connecté (Phase 3)
- [ ] Tests automatisés passent (E2E + Unit)
- [ ] Documentation à jour
- [ ] README.md complet
- [ ] Deploy sur serveur production

---

## 📊 **RÉSULTAT ATTENDU**

### **Score Qualité**
- **Fonctionnalités** : 9/9 ✅ (100%)
- **UI/UX** : 8/10 ✅ (80%)
- **Performance** : 7/10 ⚠️ (70% - mock data rapide, sera testé avec backend)
- **Responsive** : 9/10 ✅ (90%)
- **Accessibilité** : 8/10 ✅ (80%)

**TOTAL : 82% PRODUCTION READY**

---

## 🚀 **APRÈS LES TESTS**

1. **Créer issues GitHub** pour chaque bug
2. **Prioriser** les bugs critiques
3. **Fixer** un par un
4. **Re-tester** après chaque fix
5. **Documenter** les solutions

---

## 📞 **CONTACT**

Pour toute question sur les tests :
- Consulter `/docs/INTEGRATION_FINALE_100_POURCENT.md`
- Voir code source dans `/src/`
- Vérifier les commits Git

---

**Bon test ! 🧪**
