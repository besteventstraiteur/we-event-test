import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, MessageSquare, Package as PackageIcon, Euro } from 'lucide-react';
import { Package } from '../../types/package';
import Button from '../ui/Button';

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package | null;
  providerName?: string;
  onSubmit: (bookingData: BookingFormData) => void;
}

export interface BookingFormData {
  eventDate: string;
  eventTime: string;
  location: string;
  guestCount: number;
  specialRequests: string;
  packageId: string;
}

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
  isOpen,
  onClose,
  package: pkg,
  providerName = 'ce prestataire',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    eventDate: '',
    eventTime: '',
    location: '',
    guestCount: pkg?.minCapacity || 50,
    specialRequests: '',
    packageId: pkg?.id || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pkg) return null;

  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.eventDate) {
      newErrors.eventDate = 'La date est obligatoire';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'La date doit être dans le futur';
      }
    }

    if (!formData.eventTime) {
      newErrors.eventTime = 'L\'heure est obligatoire';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est obligatoire';
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = 'Le nombre d\'invités doit être supérieur à 0';
    } else if (pkg.minCapacity && formData.guestCount < pkg.minCapacity) {
      newErrors.guestCount = `Minimum ${pkg.minCapacity} invités pour ce package`;
    } else if (pkg.maxCapacity && formData.guestCount > pkg.maxCapacity) {
      newErrors.guestCount = `Maximum ${pkg.maxCapacity} invités pour ce package`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      onClose();
      
      // Reset form
      setFormData({
        eventDate: '',
        eventTime: '',
        location: '',
        guestCount: pkg?.minCapacity || 50,
        specialRequests: '',
        packageId: pkg?.id || '',
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Demande de Réservation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Package Info */}
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                <PackageIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                <p className="text-purple-100 text-sm mb-2">{providerName}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{formatPrice(pkg.price)}</span>
                  {pkg.duration && (
                    <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                      {pkg.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de l'événement *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Heure de début *
              </label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) => handleChange('eventTime', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.eventTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventTime && (
                <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Lieu de l'événement *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Ex: Château de Versailles, Paris"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Nombre d'invités *
            </label>
            <input
              type="number"
              value={formData.guestCount}
              onChange={(e) => handleChange('guestCount', parseInt(e.target.value) || 0)}
              min={pkg.minCapacity || 1}
              max={pkg.maxCapacity || 1000}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.guestCount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.guestCount && (
              <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>
            )}
            {pkg.minCapacity && pkg.maxCapacity && (
              <p className="text-gray-500 text-sm mt-1">
                Capacité: {pkg.minCapacity} - {pkg.maxCapacity} personnes
              </p>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Demandes spéciales (optionnel)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              rows={4}
              placeholder="Allergies alimentaires, préférences musicales, décoration spécifique..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Prix du package</span>
              <span className="font-bold text-lg text-purple-600">
                {formatPrice(pkg.price)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              * Prix indicatif. Le montant final sera confirmé par le prestataire.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Euro className="w-5 h-5 mr-2" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Votre demande sera envoyée au prestataire qui vous contactera dans les plus brefs délais.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;
