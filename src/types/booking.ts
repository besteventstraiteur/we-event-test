/**
 * Booking Types - Types pour la gestion des réservations
 * 
 * Réservations faites par les clients pour des packages
 */

import { BaseEntity, BookingStatus } from './api';
import { Event } from './event';
import { Package } from './package';

// ============================
// BOOKING ENTITY
// ============================

/**
 * Booking (Réservation)
 * Représente une réservation d'un package pour un événement
 */
export interface Booking extends BaseEntity {
  // Relations
  event_id: string;
  event?: Event;
  
  package_id: string;
  package?: Package;
  
  client_id: string;
  client_name?: string;
  client_email?: string;
  
  partner_id: string;
  partner_name?: string;
  partner_email?: string;
  
  // Détails de la réservation
  booking_date: string; // Date de réservation
  service_date: string; // Date de la prestation
  
  // Prix et paiement
  base_price: number;
  guest_count?: number;
  total_price: number;
  currency: string;
  
  // Paiement
  deposit_amount?: number;
  deposit_paid?: boolean;
  deposit_date?: string;
  
  final_payment_amount?: number;
  final_payment_paid?: boolean;
  final_payment_date?: string;
  
  payment_status: PaymentStatus;
  
  // Statut
  status: BookingStatus;
  
  // Communication
  special_requests?: string;
  notes?: string;
  cancellation_reason?: string;
  
  // Métadonnées
  confirmation_code?: string;
  contract_url?: string;
  invoice_url?: string;
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  DEPOSIT_PAID = 'deposit_paid',
  FULLY_PAID = 'fully_paid',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

// ============================
// DTOs
// ============================

/**
 * Create Booking DTO
 */
export interface CreateBookingDTO {
  event_id: string;
  package_id: string;
  service_date: string;
  guest_count?: number;
  special_requests?: string;
  notes?: string;
}

/**
 * Update Booking DTO
 */
export interface UpdateBookingDTO {
  id: string;
  service_date?: string;
  guest_count?: number;
  status?: BookingStatus;
  special_requests?: string;
  notes?: string;
  cancellation_reason?: string;
}

/**
 * Booking Payment DTO
 */
export interface BookingPaymentDTO {
  booking_id: string;
  amount: number;
  payment_type: 'deposit' | 'final';
  payment_method: string;
  transaction_id?: string;
}

// ============================
// QUERY PARAMS
// ============================

/**
 * Booking Filters
 */
export interface BookingFilters {
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  event_id?: string;
  package_id?: string;
  partner_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

/**
 * Booking List Params
 */
export interface BookingListParams extends BookingFilters {
  page?: number;
  limit?: number;
  sort?: 'booking_date' | 'service_date' | 'total_price';
  order?: 'asc' | 'desc';
}

// ============================
// STATISTICS
// ============================

/**
 * Booking Statistics
 */
export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  pending_payments: number;
  bookings_by_status: Record<BookingStatus, number>;
  bookings_by_month: Array<{ month: string; count: number; revenue: number }>;
}

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Get booking status label
 */
export function getBookingStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'En attente',
    [BookingStatus.CONFIRMED]: 'Confirmé',
    [BookingStatus.CANCELLED]: 'Annulé',
    [BookingStatus.COMPLETED]: 'Terminé',
  };
  return labels[status];
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'En attente',
    [PaymentStatus.DEPOSIT_PAID]: 'Acompte payé',
    [PaymentStatus.FULLY_PAID]: 'Payé intégralement',
    [PaymentStatus.REFUNDED]: 'Remboursé',
    [PaymentStatus.PARTIALLY_REFUNDED]: 'Partiellement remboursé',
  };
  return labels[status];
}

/**
 * Format booking price
 */
export function formatBookingPrice(booking: Booking): string {
  return booking.total_price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: booking.currency || 'EUR',
  });
}

/**
 * Calculate remaining payment
 */
export function calculateRemainingPayment(booking: Booking): number {
  let paid = 0;
  
  if (booking.deposit_paid && booking.deposit_amount) {
    paid += booking.deposit_amount;
  }
  
  if (booking.final_payment_paid && booking.final_payment_amount) {
    paid += booking.final_payment_amount;
  }
  
  return Math.max(0, booking.total_price - paid);
}

/**
 * Check if booking can be cancelled
 */
export function canCancelBooking(booking: Booking): boolean {
  // Can't cancel if already cancelled or completed
  if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
    return false;
  }
  
  // Can't cancel if service date is in the past
  const serviceDate = new Date(booking.service_date);
  const now = new Date();
  
  if (serviceDate < now) {
    return false;
  }
  
  return true;
}

/**
 * Check if booking can be confirmed
 */
export function canConfirmBooking(booking: Booking): boolean {
  return booking.status === BookingStatus.PENDING;
}

/**
 * Check if deposit is required
 */
export function isDepositRequired(booking: Booking): boolean {
  return !!booking.deposit_amount && booking.deposit_amount > 0;
}

/**
 * Check if deposit is overdue
 */
export function isDepositOverdue(booking: Booking, daysBeforeEvent: number = 30): boolean {
  if (!isDepositRequired(booking) || booking.deposit_paid) {
    return false;
  }
  
  const serviceDate = new Date(booking.service_date);
  const depositDueDate = new Date(serviceDate);
  depositDueDate.setDate(depositDueDate.getDate() - daysBeforeEvent);
  
  return new Date() > depositDueDate;
}

/**
 * Get booking progress (0-100)
 */
export function getBookingProgress(booking: Booking): number {
  switch (booking.status) {
    case BookingStatus.PENDING:
      return 25;
    case BookingStatus.CONFIRMED:
      return booking.payment_status === PaymentStatus.FULLY_PAID ? 75 : 50;
    case BookingStatus.COMPLETED:
      return 100;
    case BookingStatus.CANCELLED:
      return 0;
    default:
      return 0;
  }
}

/**
 * Format booking confirmation code
 */
export function formatConfirmationCode(code?: string): string {
  if (!code) return 'N/A';
  
  // Format: XXXX-XXXX-XXXX
  if (code.length === 12) {
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
  }
  
  return code;
}

// ============================
// VALIDATION
// ============================

/**
 * Validate booking dates
 */
export function validateBookingDates(serviceDate: string): { valid: boolean; error?: string } {
  const date = new Date(serviceDate);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Date invalide' };
  }
  
  if (date < now) {
    return { valid: false, error: 'La date de service doit être dans le futur' };
  }
  
  return { valid: true };
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(
  amount: number,
  totalPrice: number
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Le montant doit être positif' };
  }
  
  if (amount > totalPrice) {
    return { valid: false, error: 'Le montant dépasse le prix total' };
  }
  
  return { valid: true };
}

// ============================
// EXPORT DEFAULT
// ============================

export default {
  getBookingStatusLabel,
  getPaymentStatusLabel,
  formatBookingPrice,
  calculateRemainingPayment,
  canCancelBooking,
  canConfirmBooking,
  isDepositRequired,
  isDepositOverdue,
  getBookingProgress,
  formatConfirmationCode,
  validateBookingDates,
  validatePaymentAmount,
};
