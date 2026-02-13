/**
 * Event Types - Types pour la gestion des événements
 * 
 * Entité centrale de l'application We Event
 */

import { BaseEntity, EventStatus } from './api';

// ============================
// EVENT ENTITY
// ============================

/**
 * Event (Événement)
 * Représente un événement créé par un client
 */
export interface Event extends BaseEntity {
  // Informations de base
  title: string;
  description?: string;
  
  // Dates et localisation
  start_date: string; // ISO 8601 format
  end_date: string;   // ISO 8601 format
  location: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  
  // Détails de l'événement
  event_type: EventType;
  category_id?: string;
  guest_count?: number;
  estimated_budget?: number;
  actual_budget?: number;
  
  // Relations
  client_id: string;
  bookings?: Booking[]; // Réservations associées
  
  // Statut et métadonnées
  status: EventStatus;
  is_public?: boolean;
  cover_image_url?: string;
  
  // Préférences et notes
  preferences?: EventPreferences;
  notes?: string;
  tags?: string[];
}

/**
 * Event Type (Type d'événement)
 */
export enum EventType {
  WEDDING = 'wedding',              // Mariage
  BIRTHDAY = 'birthday',            // Anniversaire
  CORPORATE = 'corporate',          // Événement d'entreprise
  CONFERENCE = 'conference',        // Conférence
  PARTY = 'party',                  // Fête
  BABY_SHOWER = 'baby_shower',      // Baby shower
  BAPTISM = 'baptism',              // Baptême
  COMMUNION = 'communion',          // Communion
  BAR_MITZVAH = 'bar_mitzvah',     // Bar/Bat Mitzvah
  ENGAGEMENT = 'engagement',        // Fiançailles
  ANNIVERSARY = 'anniversary',      // Anniversaire de mariage
  GRADUATION = 'graduation',        // Remise de diplôme
  RETIREMENT = 'retirement',        // Retraite
  CHARITY = 'charity',              // Événement caritatif
  FESTIVAL = 'festival',            // Festival
  CONCERT = 'concert',              // Concert
  EXHIBITION = 'exhibition',        // Exposition
  SEMINAR = 'seminar',              // Séminaire
  WORKSHOP = 'workshop',            // Atelier
  NETWORKING = 'networking',        // Networking
  PRODUCT_LAUNCH = 'product_launch', // Lancement de produit
  OTHER = 'other',                  // Autre
}

/**
 * Event Preferences (Préférences de l'événement)
 */
export interface EventPreferences {
  theme?: string;
  color_scheme?: string[];
  music_genre?: string[];
  cuisine_type?: string[];
  dress_code?: string;
  special_requirements?: string[];
}

/**
 * Booking (Réservation - minimal pour relation)
 */
interface Booking {
  id: string;
  package_id: string;
  partner_id: string;
  status: string;
  price: number;
}

// ============================
// DTOs (Data Transfer Objects)
// ============================

/**
 * Create Event DTO
 */
export interface CreateEventDTO {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  event_type: EventType;
  category_id?: string;
  guest_count?: number;
  estimated_budget?: number;
  is_public?: boolean;
  cover_image_url?: string;
  preferences?: EventPreferences;
  notes?: string;
  tags?: string[];
}

/**
 * Update Event DTO (tous les champs optionnels sauf id)
 */
export interface UpdateEventDTO {
  id: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  event_type?: EventType;
  category_id?: string;
  guest_count?: number;
  estimated_budget?: number;
  actual_budget?: number;
  status?: EventStatus;
  is_public?: boolean;
  cover_image_url?: string;
  preferences?: EventPreferences;
  notes?: string;
  tags?: string[];
}

// ============================
// QUERY PARAMS
// ============================

/**
 * Event List Filters
 */
export interface EventFilters {
  status?: EventStatus;
  event_type?: EventType;
  date_from?: string;
  date_to?: string;
  min_budget?: number;
  max_budget?: number;
  city?: string;
  search?: string;
}

/**
 * Event List Params (filters + pagination)
 */
export interface EventListParams extends EventFilters {
  page?: number;
  limit?: number;
  sort?: 'start_date' | 'created_at' | 'title';
  order?: 'asc' | 'desc';
}

// ============================
// STATISTICS
// ============================

/**
 * Event Statistics (pour dashboard)
 */
export interface EventStats {
  total_events: number;
  upcoming_events: number;
  past_events: number;
  cancelled_events: number;
  total_budget_spent: number;
  average_budget: number;
  events_by_type: Record<EventType, number>;
  events_by_status: Record<EventStatus, number>;
}

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Check if event is upcoming
 */
export function isUpcomingEvent(event: Event): boolean {
  return new Date(event.start_date) > new Date();
}

/**
 * Check if event is past
 */
export function isPastEvent(event: Event): boolean {
  return new Date(event.end_date) < new Date();
}

/**
 * Check if event is ongoing
 */
export function isOngoingEvent(event: Event): boolean {
  const now = new Date();
  return new Date(event.start_date) <= now && new Date(event.end_date) >= now;
}

/**
 * Get event status label (for UI)
 */
export function getEventStatusLabel(status: EventStatus): string {
  const labels: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: 'Brouillon',
    [EventStatus.PLANNED]: 'Planifié',
    [EventStatus.ONGOING]: 'En cours',
    [EventStatus.COMPLETED]: 'Terminé',
    [EventStatus.CANCELLED]: 'Annulé',
  };
  return labels[status];
}

/**
 * Get event type label (for UI)
 */
export function getEventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    [EventType.WEDDING]: 'Mariage',
    [EventType.BIRTHDAY]: 'Anniversaire',
    [EventType.CORPORATE]: 'Événement d\'entreprise',
    [EventType.CONFERENCE]: 'Conférence',
    [EventType.PARTY]: 'Fête',
    [EventType.BABY_SHOWER]: 'Baby shower',
    [EventType.BAPTISM]: 'Baptême',
    [EventType.COMMUNION]: 'Communion',
    [EventType.BAR_MITZVAH]: 'Bar/Bat Mitzvah',
    [EventType.ENGAGEMENT]: 'Fiançailles',
    [EventType.ANNIVERSARY]: 'Anniversaire de mariage',
    [EventType.GRADUATION]: 'Remise de diplôme',
    [EventType.RETIREMENT]: 'Retraite',
    [EventType.CHARITY]: 'Événement caritatif',
    [EventType.FESTIVAL]: 'Festival',
    [EventType.CONCERT]: 'Concert',
    [EventType.EXHIBITION]: 'Exposition',
    [EventType.SEMINAR]: 'Séminaire',
    [EventType.WORKSHOP]: 'Atelier',
    [EventType.NETWORKING]: 'Networking',
    [EventType.PRODUCT_LAUNCH]: 'Lancement de produit',
    [EventType.OTHER]: 'Autre',
  };
  return labels[type];
}

/**
 * Format event date range
 */
export function formatEventDateRange(event: Event, locale: string = 'fr-FR'): string {
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const startStr = start.toLocaleDateString(locale, options);
  const endStr = end.toLocaleDateString(locale, options);
  
  if (startStr === endStr) {
    return startStr;
  }
  
  return `${startStr} - ${endStr}`;
}

// ============================
// VALIDATION
// ============================

/**
 * Validate event dates
 */
export function validateEventDates(start_date: string, end_date: string): { valid: boolean; error?: string } {
  const start = new Date(start_date);
  const end = new Date(end_date);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Date de début invalide' };
  }
  
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Date de fin invalide' };
  }
  
  if (start < now) {
    return { valid: false, error: 'La date de début doit être dans le futur' };
  }
  
  if (end < start) {
    return { valid: false, error: 'La date de fin doit être après la date de début' };
  }
  
  return { valid: true };
}

/**
 * Validate event budget
 */
export function validateEventBudget(budget: number): { valid: boolean; error?: string } {
  if (budget < 0) {
    return { valid: false, error: 'Le budget ne peut pas être négatif' };
  }
  
  if (budget > 10000000) { // 10M max
    return { valid: false, error: 'Le budget est trop élevé (max 10M)' };
  }
  
  return { valid: true };
}

// ============================
// EXPORT DEFAULT
// ============================

export default {
  isUpcomingEvent,
  isPastEvent,
  isOngoingEvent,
  getEventStatusLabel,
  getEventTypeLabel,
  formatEventDateRange,
  validateEventDates,
  validateEventBudget,
};
