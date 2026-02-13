/**
 * Partner Rating Types - Types pour la notation mutuelle
 * 
 * Système de notation Partner → Client et Partner → Partner
 */

import { BaseEntity } from './api';

// ============================
// PARTNER RATING ENTITY
// ============================

/**
 * PartnerRating
 * Notation donnée par un partenaire à un client ou un autre partenaire
 */
export interface PartnerRating extends BaseEntity {
  // Qui note
  rater_id: string;
  rater_name?: string;
  rater_type: 'partner'; // Toujours partner
  
  // Qui est noté
  rated_id: string;
  rated_name?: string;
  rated_type: RatedType;
  
  // Contexte
  event_id: string;
  event_title?: string;
  booking_id?: string;
  
  // Notation (1-5 étoiles)
  rating: number; // 1-5
  
  // Critères détaillés (optionnel)
  criteria?: RatingCriteria;
  
  // Commentaire
  comment?: string;
  
  // Visibilité
  is_public: boolean;
  is_anonymous: boolean;
  
  // Réponse (si noté veut répondre)
  response?: string;
  response_at?: string;
}

/**
 * Rated Type (Qui est noté)
 */
export enum RatedType {
  CLIENT = 'client',
  PARTNER = 'partner',
}

/**
 * Rating Criteria (Critères de notation)
 */
export interface RatingCriteria {
  professionalism?: number; // 1-5
  communication?: number; // 1-5
  punctuality?: number; // 1-5
  quality?: number; // 1-5
  collaboration?: number; // 1-5 (pour partner → partner)
  respect_contract?: number; // 1-5 (pour partner → client)
  [key: string]: number | undefined; // Allow custom criteria
}

// ============================
// DTOs
// ============================

/**
 * Create Partner Rating DTO
 */
export interface CreatePartnerRatingDTO {
  rated_id: string;
  rated_type: RatedType;
  event_id: string;
  booking_id?: string;
  rating: number; // 1-5
  criteria?: RatingCriteria;
  comment?: string;
  is_public?: boolean;
  is_anonymous?: boolean;
}

/**
 * Update Partner Rating DTO
 */
export interface UpdatePartnerRatingDTO {
  id: string;
  rating?: number;
  criteria?: RatingCriteria;
  comment?: string;
  is_public?: boolean;
  is_anonymous?: boolean;
}

/**
 * Add Response DTO (pour répondre à une notation)
 */
export interface AddRatingResponseDTO {
  rating_id: string;
  response: string;
}

// ============================
// QUERY PARAMS
// ============================

/**
 * Partner Rating Filters
 */
export interface PartnerRatingFilters {
  rated_type?: RatedType;
  event_id?: string;
  min_rating?: number;
  max_rating?: number;
  is_public?: boolean;
  search?: string;
}

/**
 * Partner Rating List Params
 */
export interface PartnerRatingListParams extends PartnerRatingFilters {
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'rating';
  order?: 'asc' | 'desc';
}

// ============================
// STATISTICS
// ============================

/**
 * Rating Statistics
 */
export interface RatingStats {
  // Général
  average_rating: number;
  total_ratings: number;
  
  // Répartition par étoiles
  breakdown: {
    '5_stars': number;
    '4_stars': number;
    '3_stars': number;
    '2_stars': number;
    '1_star': number;
  };
  
  // Critères moyens
  criteria_averages?: {
    professionalism?: number;
    communication?: number;
    punctuality?: number;
    quality?: number;
    collaboration?: number;
    respect_contract?: number;
  };
  
  // Par type
  ratings_by_type?: {
    client: number;
    partner: number;
  };
}

/**
 * Rating Summary (pour affichage profil)
 */
export interface RatingSummary {
  user_id: string;
  user_type: 'client' | 'partner';
  average_rating: number;
  total_ratings: number;
  badges: RatingBadge[];
}

/**
 * Rating Badge (badges automatiques)
 */
export interface RatingBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string; // ex: "average_rating >= 4.5"
}

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Get rated type label
 */
export function getRatedTypeLabel(type: RatedType): string {
  const labels: Record<RatedType, string> = {
    [RatedType.CLIENT]: 'Client',
    [RatedType.PARTNER]: 'Partenaire',
  };
  return labels[type];
}

/**
 * Get rating label (ex: "Excellent")
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 3.5) return 'Très bon';
  if (rating >= 2.5) return 'Bon';
  if (rating >= 1.5) return 'Moyen';
  return 'Médiocre';
}

/**
 * Get star emoji
 */
export function getStarEmoji(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  let result = '⭐'.repeat(fullStars);
  if (hasHalfStar && fullStars < 5) {
    result += '✨';
  }
  
  return result;
}

/**
 * Format rating display
 */
export function formatRatingDisplay(stats: RatingStats): string {
  if (stats.total_ratings === 0) {
    return 'Aucune notation';
  }
  
  return `${stats.average_rating.toFixed(1)}/5 (${stats.total_ratings} avis)`;
}

/**
 * Calculate average of criteria
 */
export function calculateCriteriaAverage(criteria?: RatingCriteria): number {
  if (!criteria) return 0;
  
  const values = Object.values(criteria).filter(v => typeof v === 'number') as number[];
  
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Get badge for rating
 */
export function getBadgeForRating(stats: RatingStats, ratedType: RatedType): RatingBadge | null {
  if (stats.total_ratings < 5) {
    return null; // Pas assez de notations
  }
  
  if (stats.average_rating >= 4.8) {
    return ratedType === RatedType.CLIENT
      ? {
          id: 'reliable-client',
          name: 'Client Fiable',
          description: 'Client avec une excellente réputation',
          icon: '🌟',
          criteria: 'average_rating >= 4.8',
        }
      : {
          id: 'excellent-collaborator',
          name: 'Excellent Collaborateur',
          description: 'Partenaire hautement recommandé',
          icon: '🏆',
          criteria: 'average_rating >= 4.8',
        };
  }
  
  if (stats.average_rating >= 4.5) {
    return ratedType === RatedType.CLIENT
      ? {
          id: 'good-client',
          name: 'Bon Client',
          description: 'Client professionnel',
          icon: '✅',
          criteria: 'average_rating >= 4.5',
        }
      : {
          id: 'recommended-partner',
          name: 'Partenaire Recommandé',
          description: 'Bon professionnel',
          icon: '👍',
          criteria: 'average_rating >= 4.5',
        };
  }
  
  return null;
}

/**
 * Check if can rate (event finished + booking confirmed)
 */
export function canRate(eventEndDate: string, bookingStatus: string): boolean {
  const eventEnded = new Date(eventEndDate) < new Date();
  const bookingConfirmed = ['confirmed', 'completed'].includes(bookingStatus);
  
  return eventEnded && bookingConfirmed;
}

/**
 * Format criteria label
 */
export function getCriteriaLabel(key: string): string {
  const labels: Record<string, string> = {
    professionalism: 'Professionnalisme',
    communication: 'Communication',
    punctuality: 'Ponctualité',
    quality: 'Qualité',
    collaboration: 'Collaboration',
    respect_contract: 'Respect du contrat',
  };
  return labels[key] || key;
}

/**
 * Get percentage for star rating
 */
export function getStarPercentage(breakdown: RatingStats['breakdown'], stars: number, total: number): number {
  if (total === 0) return 0;
  
  const key = `${stars}_star${stars > 1 ? 's' : ''}` as keyof typeof breakdown;
  const count = breakdown[key] || 0;
  
  return Math.round((count / total) * 100);
}

// ============================
// VALIDATION
// ============================

/**
 * Validate rating value
 */
export function validateRating(rating: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(rating)) {
    return { valid: false, error: 'La note doit être un nombre entier' };
  }
  
  if (rating < 1 || rating > 5) {
    return { valid: false, error: 'La note doit être entre 1 et 5' };
  }
  
  return { valid: true };
}

/**
 * Validate criteria
 */
export function validateCriteria(criteria?: RatingCriteria): { valid: boolean; error?: string } {
  if (!criteria) return { valid: true };
  
  for (const [key, value] of Object.entries(criteria)) {
    if (typeof value !== 'number') continue;
    
    if (value < 1 || value > 5) {
      return { valid: false, error: `Le critère "${key}" doit être entre 1 et 5` };
    }
  }
  
  return { valid: true };
}

/**
 * Validate comment length
 */
export function validateComment(comment?: string): { valid: boolean; error?: string } {
  if (!comment) return { valid: true };
  
  if (comment.length > 2000) {
    return { valid: false, error: 'Le commentaire est trop long (max 2000 caractères)' };
  }
  
  return { valid: true };
}

// ============================
// EXPORT DEFAULT
// ============================

export default {
  getRatedTypeLabel,
  getRatingLabel,
  getStarEmoji,
  formatRatingDisplay,
  calculateCriteriaAverage,
  getBadgeForRating,
  canRate,
  getCriteriaLabel,
  getStarPercentage,
  validateRating,
  validateCriteria,
  validateComment,
};
