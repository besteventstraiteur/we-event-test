import React from 'react';
import { Package as PackageType } from '../../types/package';
import { CheckCircle2, Clock, Users, Euro, Star, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

interface PackageCardProps {
  package: PackageType;
  onSelect?: (pkg: PackageType) => void;
  onViewDetails?: (pkg: PackageType) => void;
  showActions?: boolean;
  className?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onSelect,
  onViewDetails,
  showActions = true,
  className = '',
}) => {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (pkg.status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Header with image or gradient */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
        {pkg.images && pkg.images.length > 0 ? (
          <img
            src={pkg.images[0]}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-6xl">📦</div>
          </div>
        )}
        
        {/* Featured badge */}
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            En vedette
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-4 left-4 ${getStatusColor()} px-3 py-1 rounded-full text-xs font-semibold`}>
          {pkg.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {pkg.category && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
              {pkg.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {pkg.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">
              {formatPrice(pkg.price)}
            </span>
            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(pkg.originalPrice)}
              </span>
            )}
          </div>
          {pkg.duration && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Durée: {pkg.duration}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="font-semibold text-gray-900 text-sm mb-2">Inclus:</p>
            {pkg.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
            {pkg.features.length > 3 && (
              <p className="text-sm text-purple-600 font-semibold">
                +{pkg.features.length - 3} autres avantages
              </p>
            )}
          </div>
        )}

        {/* Capacity */}
        {pkg.minCapacity && pkg.maxCapacity && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Capacité: {pkg.minCapacity} - {pkg.maxCapacity} personnes</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          {pkg.bookingsCount !== undefined && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{pkg.bookingsCount} réservations</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {onSelect && (
              <Button
                onClick={() => onSelect(pkg)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Choisir ce package
              </Button>
            )}
            {onViewDetails && (
              <Button
                onClick={() => onViewDetails(pkg)}
                variant="outlined"
                className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 rounded-lg transition"
              >
                Détails
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
