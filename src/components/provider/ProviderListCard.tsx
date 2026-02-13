import React from 'react';
import { MapPin, Star, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface ProviderCardData {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  address?: string;
  city?: string;
  averageRating?: number;
  totalReviews?: number;
  packageCount?: number;
  services?: { id: string; name: string }[];
  verified?: boolean;
}

interface ProviderListCardProps {
  provider: ProviderCardData;
  index: number;
}

const ProviderListCard: React.FC<ProviderListCardProps> = ({ provider, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/partners-v2/${provider.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 dark:border-gray-700"
    >
      <div className="grid grid-cols-[200px_1fr] md:grid-cols-[250px_1fr] gap-4 p-4">
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 h-[160px]">
          {provider.logo ? (
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/250x160/e2e8f0/64748b?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <Package size={48} />
            </div>
          )}

          {provider.verified && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span>✓</span> Vérifié
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                  {provider.name}
                </h3>

                {/* Location */}
                {(provider.address || provider.city) && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin size={14} />
                    <span className="line-clamp-1">
                      {provider.city || provider.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {provider.averageRating !== undefined && provider.averageRating > 0 && (
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full ml-2">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {provider.averageRating.toFixed(1)}
                  </span>
                  {provider.totalReviews !== undefined && provider.totalReviews > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({provider.totalReviews})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {provider.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {provider.description}
              </p>
            )}

            {/* Services Tags */}
            {provider.services && provider.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  >
                    {service.name}
                  </span>
                ))}
                {provider.services.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    +{provider.services.length - 3} autres
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            {/* Package Count */}
            {provider.packageCount !== undefined && provider.packageCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Package size={16} />
                <span>
                  {provider.packageCount} package{provider.packageCount > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group-hover:gap-2"
            >
              Voir les détails
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProviderListCard;
