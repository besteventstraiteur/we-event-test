import React from 'react';
import { Booking, BookingStatus } from '../../types/booking';
import { Calendar, Clock, MapPin, Euro, User, Package, CheckCircle, XCircle, AlertCircle, Hourglass } from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  onViewDetails?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onConfirm?: (booking: Booking) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onCancel,
  onConfirm,
  showActions = true,
  variant = 'default',
  className = '',
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch {
      return '';
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Get status config
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Hourglass,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'En attente',
        };
      case 'CONFIRMED':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Confirmé',
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Annulé',
        };
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Terminé',
        };
      case 'PAYMENT_PENDING':
        return {
          icon: AlertCircle,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Paiement en attente',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-gray-900">Réservation #{booking.bookingNumber}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.color} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(booking.eventDate)}
              </div>
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                {formatPrice(booking.totalAmount)}
              </div>
            </div>
          </div>
          {showActions && onViewDetails && (
            <Button
              onClick={() => onViewDetails(booking)}
              variant="outlined"
              className="text-sm"
            >
              Détails
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                Réservation #{booking.bookingNumber}
              </h3>
              <p className="text-purple-100 text-sm">
                Créé le {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.color} bg-white flex items-center gap-1.5`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Event details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Date de l'événement</p>
              <p className="font-semibold text-gray-900">{formatDate(booking.eventDate)}</p>
            </div>
          </div>
          
          {booking.eventTime && (
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Heure</p>
                <p className="font-semibold text-gray-900">{booking.eventTime}</p>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {booking.location && (
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Lieu</p>
              <p className="font-semibold text-gray-900">{booking.location}</p>
            </div>
          </div>
        )}

        {/* Guest count */}
        {booking.guestCount && (
          <div className="flex items-start gap-2">
            <User className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nombre d'invités</p>
              <p className="font-semibold text-gray-900">{booking.guestCount} personnes</p>
            </div>
          </div>
        )}

        {/* Special requests */}
        {booking.specialRequests && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">Demandes spéciales</p>
            <p className="text-sm text-gray-700">{booking.specialRequests}</p>
          </div>
        )}

        {/* Pricing */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Prix du package</span>
            <span className="font-semibold">{formatPrice(booking.totalAmount)}</span>
          </div>
          {booking.deposit && (
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Acompte versé</span>
              <span>{formatPrice(booking.deposit)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button
                onClick={() => onViewDetails(booking)}
                variant="outlined"
                className="flex-1"
              >
                Voir les détails
              </Button>
            )}
            {onConfirm && booking.status === 'PENDING' && (
              <Button
                onClick={() => onConfirm(booking)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Confirmer
              </Button>
            )}
            {onCancel && (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
              <Button
                onClick={() => onCancel(booking)}
                variant="outlined"
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
              >
                Annuler
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
