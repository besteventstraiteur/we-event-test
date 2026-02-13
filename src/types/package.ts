/**
 * Package Types - Types pour la gestion des packages/prestations
 * 
 * Packages créés par les partenaires et réservables par les clients
 */

import { BaseEntity, EntityStatus } from './api';

// ============================
// PACKAGE ENTITY
// ============================

/**
 * Package (Prestation)
 * Représente une prestation offerte par un partenaire
 */
export interface Package extends BaseEntity {
  // Informations de base
  title: string;
  description: string;
  short_description?: string;
  
  // Partenaire
  partner_id: string;
  partner_name?: string;
  partner_logo_url?: string;
  
  // Catégorie et type
  category_id: string;
  category_name?: string;
  service_type: PackageServiceType;
  
  // Prix et disponibilité
  base_price: number;
  currency: string;
  pricing_type: PricingType;
  min_guests?: number;
  max_guests?: number;
  
  // Médias
  cover_image_url?: string;
  images: string[];
  videos?: string[];
  
  // Détails
  features: string[];
  included_services: string[];
  excluded_services?: string[];
  
  // Localisation
  available_locations: string[];
  city?: string;
  country?: string;
  
  // Statut et validation
  status: PackageStatus;
  approval_status: ApprovalStatus;
  is_featured?: boolean;
  is_available?: boolean;
  
  // Statistiques
  rating_average?: number;
  rating_count?: number;
  booking_count?: number;
  view_count?: number;
  
  // Métadonnées
  duration_hours?: number;
  preparation_time_hours?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

/**
 * Package Service Type (Type de prestation)
 */
export enum PackageServiceType {
  CATERING = 'catering',           // Traiteur
  VENUE = 'venue',                 // Lieu
  PHOTOGRAPHY = 'photography',     // Photographie
  VIDEOGRAPHY = 'videography',     // Vidéographie
  MUSIC = 'music',                 // Musique/DJ
  DECORATION = 'decoration',       // Décoration
  FLOWERS = 'flowers',             // Fleuriste
  ENTERTAINMENT = 'entertainment', // Animation
  CAKE = 'cake',                   // Pâtisserie
  MAKEUP = 'makeup',               // Maquillage
  HAIR = 'hair',                   // Coiffure
  DRESS = 'dress',                 // Robe/Costume
  INVITATIONS = 'invitations',     // Invitations
  TRANSPORT = 'transport',         // Transport
  ACCOMMODATION = 'accommodation', // Hébergement
  COORDINATOR = 'coordinator',     // Coordinateur
  OTHER = 'other',                 // Autre
}

/**
 * Package Status
 */
export enum PackageStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

/**
 * Approval Status (pour validation admin)
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CHANGES_REQUESTED = 'changes_requested',
}

/**
 * Pricing Type
 */
export enum PricingType {
  FIXED = 'fixed',           // Prix fixe
  PER_PERSON = 'per_person', // Par personne
  PER_HOUR = 'per_hour',     // Par heure
  CUSTOM = 'custom',         // Sur devis
}

// ============================
// DTOs
// ============================

/**
 * Create Package DTO
 */
export interface CreatePackageDTO {
  title: string;
  description: string;
  short_description?: string;
  category_id: string;
  service_type: PackageServiceType;
  base_price: number;
  currency?: string;
  pricing_type: PricingType;
  min_guests?: number;
  max_guests?: number;
  cover_image_url?: string;
  images?: string[];
  videos?: string[];
  features: string[];
  included_services: string[];
  excluded_services?: string[];
  available_locations: string[];
  city?: string;
  country?: string;
  duration_hours?: number;
  preparation_time_hours?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

/**
 * Update Package DTO
 */
export interface UpdatePackageDTO {
  id: string;
  title?: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  service_type?: PackageServiceType;
  base_price?: number;
  currency?: string;
  pricing_type?: PricingType;
  min_guests?: number;
  max_guests?: number;
  cover_image_url?: string;
  images?: string[];
  videos?: string[];
  features?: string[];
  included_services?: string[];
  excluded_services?: string[];
  available_locations?: string[];
  city?: string;
  country?: string;
  status?: PackageStatus;
  is_featured?: boolean;
  is_available?: boolean;
  duration_hours?: number;
  preparation_time_hours?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

// ============================
// QUERY PARAMS
// ============================

/**
 * Package Search Filters
 */
export interface PackageFilters {
  category_id?: string;
  service_type?: PackageServiceType;
  min_price?: number;
  max_price?: number;
  city?: string;
  status?: PackageStatus;
  approval_status?: ApprovalStatus;
  is_featured?: boolean;
  min_rating?: number;
  search?: string;
  tags?: string[];
}

/**
 * Package List Params
 */
export interface PackageListParams extends PackageFilters {
  page?: number;
  limit?: number;
  sort?: 'price' | 'rating' | 'popularity' | 'created_at';
  order?: 'asc' | 'desc';
}

// ============================
// STATISTICS
// ============================

/**
 * Package Statistics
 */
export interface PackageStats {
  total_packages: number;
  active_packages: number;
  pending_approval: number;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  packages_by_type: Record<PackageServiceType, number>;
}

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Get service type label
 */
export function getServiceTypeLabel(type: PackageServiceType): string {
  const labels: Record<PackageServiceType, string> = {
    [PackageServiceType.CATERING]: 'Traiteur',
    [PackageServiceType.VENUE]: 'Lieu',
    [PackageServiceType.PHOTOGRAPHY]: 'Photographie',
    [PackageServiceType.VIDEOGRAPHY]: 'Vidéographie',
    [PackageServiceType.MUSIC]: 'Musique/DJ',
    [PackageServiceType.DECORATION]: 'Décoration',
    [PackageServiceType.FLOWERS]: 'Fleuriste',
    [PackageServiceType.ENTERTAINMENT]: 'Animation',
    [PackageServiceType.CAKE]: 'Pâtisserie',
    [PackageServiceType.MAKEUP]: 'Maquillage',
    [PackageServiceType.HAIR]: 'Coiffure',
    [PackageServiceType.DRESS]: 'Robe/Costume',
    [PackageServiceType.INVITATIONS]: 'Invitations',
    [PackageServiceType.TRANSPORT]: 'Transport',
    [PackageServiceType.ACCOMMODATION]: 'Hébergement',
    [PackageServiceType.COORDINATOR]: 'Coordinateur',
    [PackageServiceType.OTHER]: 'Autre',
  };
  return labels[type];
}

/**
 * Get pricing type label
 */
export function getPricingTypeLabel(type: PricingType): string {
  const labels: Record<PricingType, string> = {
    [PricingType.FIXED]: 'Prix fixe',
    [PricingType.PER_PERSON]: 'Par personne',
    [PricingType.PER_HOUR]: 'Par heure',
    [PricingType.CUSTOM]: 'Sur devis',
  };
  return labels[type];
}

/**
 * Get approval status label
 */
export function getApprovalStatusLabel(status: ApprovalStatus): string {
  const labels: Record<ApprovalStatus, string> = {
    [ApprovalStatus.PENDING]: 'En attente',
    [ApprovalStatus.APPROVED]: 'Approuvé',
    [ApprovalStatus.REJECTED]: 'Rejeté',
    [ApprovalStatus.CHANGES_REQUESTED]: 'Modifications demandées',
  };
  return labels[status];
}

/**
 * Format price
 */
export function formatPackagePrice(pkg: Package, guestCount?: number): string {
  const price = guestCount && pkg.pricing_type === PricingType.PER_PERSON
    ? pkg.base_price * guestCount
    : pkg.base_price;
  
  const formatted = price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: pkg.currency || 'EUR',
  });
  
  switch (pkg.pricing_type) {
    case PricingType.PER_PERSON:
      return `${formatted} / personne`;
    case PricingType.PER_HOUR:
      return `${formatted} / heure`;
    case PricingType.CUSTOM:
      return 'Sur devis';
    default:
      return formatted;
  }
}

/**
 * Calculate total price for guest count
 */
export function calculateTotalPrice(pkg: Package, guestCount: number): number {
  switch (pkg.pricing_type) {
    case PricingType.PER_PERSON:
      return pkg.base_price * guestCount;
    case PricingType.PER_HOUR:
    case PricingType.FIXED:
      return pkg.base_price;
    case PricingType.CUSTOM:
      return 0; // À négocier
    default:
      return pkg.base_price;
  }
}

/**
 * Check if package is available for guest count
 */
export function isAvailableForGuestCount(pkg: Package, guestCount: number): boolean {
  if (pkg.min_guests && guestCount < pkg.min_guests) return false;
  if (pkg.max_guests && guestCount > pkg.max_guests) return false;
  return true;
}

/**
 * Format rating display
 */
export function formatRating(pkg: Package): string {
  if (!pkg.rating_average || !pkg.rating_count) {
    return 'Aucun avis';
  }
  return `${pkg.rating_average.toFixed(1)}/5 (${pkg.rating_count} avis)`;
}

// ============================
// VALIDATION
// ============================

/**
 * Validate package price
 */
export function validatePackagePrice(price: number): { valid: boolean; error?: string } {
  if (price < 0) {
    return { valid: false, error: 'Le prix ne peut pas être négatif' };
  }
  
  if (price > 1000000) {
    return { valid: false, error: 'Le prix est trop élevé (max 1M)' };
  }
  
  return { valid: true };
}

/**
 * Validate guest count range
 */
export function validateGuestRange(min?: number, max?: number): { valid: boolean; error?: string } {
  if (min && min < 0) {
    return { valid: false, error: 'Le nombre minimum ne peut pas être négatif' };
  }
  
  if (max && max < 0) {
    return { valid: false, error: 'Le nombre maximum ne peut pas être négatif' };
  }
  
  if (min && max && min > max) {
    return { valid: false, error: 'Le minimum doit être inférieur au maximum' };
  }
  
  return { valid: true };
}

// ============================
// EXPORT DEFAULT
// ============================

export default {
  getServiceTypeLabel,
  getPricingTypeLabel,
  getApprovalStatusLabel,
  formatPackagePrice,
  calculateTotalPrice,
  isAvailableForGuestCount,
  formatRating,
  validatePackagePrice,
  validateGuestRange,
};
