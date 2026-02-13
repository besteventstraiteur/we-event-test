import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Loader2, SlidersHorizontal } from 'lucide-react';
import ProviderListCard, { ProviderCardData } from '../components/provider/ProviderListCard';
import InputGroup from '../components/ui-main/InputGroup';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

// Mock data for demonstration
const MOCK_PROVIDERS: ProviderCardData[] = [
  {
    id: '1',
    name: 'Traiteur Excellence Paris',
    logo: 'https://placehold.co/250x160/6366f1/white?text=Traiteur+1',
    description: 'Spécialisé dans les événements haut de gamme et les mariages. Cuisine française raffinée avec des produits locaux.',
    address: '15 Rue de la Paix',
    city: 'Paris 8ème',
    averageRating: 4.8,
    totalReviews: 127,
    packageCount: 8,
    services: [
      { id: 's1', name: 'Buffet' },
      { id: 's2', name: 'Service Traiteur' },
      { id: 's3', name: 'Cocktail' },
    ],
    verified: true,
  },
  {
    id: '2',
    name: 'Lumière & Ambiance',
    logo: 'https://placehold.co/250x160/8b5cf6/white?text=Eclairage',
    description: 'Solutions d\'éclairage professionnel pour tous types d\'événements. Effets spéciaux et décoration lumineuse.',
    address: '42 Avenue Victor Hugo',
    city: 'Lyon 6ème',
    averageRating: 4.9,
    totalReviews: 89,
    packageCount: 12,
    services: [
      { id: 's4', name: 'Éclairage' },
      { id: 's5', name: 'Décoration' },
    ],
    verified: true,
  },
  {
    id: '3',
    name: 'DJ Events Pro',
    logo: 'https://placehold.co/250x160/ec4899/white?text=DJ+Pro',
    description: 'DJ professionnel pour mariages, soirées d\'entreprise et événements privés. Large répertoire musical.',
    address: '28 Boulevard des Capucines',
    city: 'Paris 2ème',
    averageRating: 4.7,
    totalReviews: 156,
    packageCount: 6,
    services: [
      { id: 's6', name: 'DJ' },
      { id: 's7', name: 'Animation' },
      { id: 's8', name: 'Sonorisation' },
    ],
    verified: true,
  },
  {
    id: '4',
    name: 'Photo & Vidéo Moments',
    logo: 'https://placehold.co/250x160/f59e0b/white?text=Photo+Video',
    description: 'Photographe et vidéaste professionnel. Reportage photo et vidéo de mariage, événements d\'entreprise.',
    address: '10 Rue Lafayette',
    city: 'Marseille 1er',
    averageRating: 5.0,
    totalReviews: 203,
    packageCount: 10,
    services: [
      { id: 's9', name: 'Photographie' },
      { id: 's10', name: 'Vidéo' },
      { id: 's11', name: 'Drone' },
    ],
    verified: true,
  },
  {
    id: '5',
    name: 'Fleurs de Provence',
    logo: 'https://placehold.co/250x160/10b981/white?text=Fleurs',
    description: 'Création florale sur mesure pour vos événements. Bouquets, centres de table, arches florales.',
    address: '5 Place Bellecour',
    city: 'Lyon 2ème',
    averageRating: 4.6,
    totalReviews: 74,
    packageCount: 15,
    services: [
      { id: 's12', name: 'Fleuriste' },
      { id: 's13', name: 'Décoration florale' },
    ],
    verified: false,
  },
  {
    id: '6',
    name: 'Location Matériel Events',
    logo: 'https://placehold.co/250x160/3b82f6/white?text=Location',
    description: 'Location de matériel pour événements : tentes, tables, chaises, vaisselle, mobilier design.',
    address: '18 Rue du Commerce',
    city: 'Bordeaux',
    averageRating: 4.5,
    totalReviews: 92,
    packageCount: 20,
    services: [
      { id: 's14', name: 'Location mobilier' },
      { id: 's15', name: 'Tentes' },
      { id: 's16', name: 'Vaisselle' },
    ],
    verified: true,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Tous' },
  { id: 'traiteur', name: 'Traiteur' },
  { id: 'dj', name: 'DJ & Animation' },
  { id: 'photo', name: 'Photo & Vidéo' },
  { id: 'decoration', name: 'Décoration' },
  { id: 'location', name: 'Location' },
];

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ${className}`} />
);

const ProviderCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
    <div className="grid grid-cols-[200px_1fr] md:grid-cols-[250px_1fr] gap-4">
      <Skeleton className="h-[160px] rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  </div>
);

const ProvidersList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderCardData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'packages'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Simulate API call
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setProviders(MOCK_PROVIDERS);
      setLoading(false);
    };

    fetchProviders();
  }, []);

  // Filter and search
  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Search filter
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.city?.toLowerCase().includes(query) ||
          p.services?.some((s) => s.name.toLowerCase().includes(query))
      );
    }

    // Category filter (in a real app, this would filter by actual category)
    // For demo, we skip this or use service names

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === 'reviews') {
        return (b.totalReviews || 0) - (a.totalReviews || 0);
      }
      if (sortBy === 'packages') {
        return (b.packageCount || 0) - (a.packageCount || 0);
      }
      return 0;
    });

    return result;
  }, [providers, searchText, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trouvez votre prestataire idéal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez nos prestataires vérifiés et leurs packages pour votre événement
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <InputGroup
              placeholder="Rechercher par nom, service, ville..."
              className="pl-12"
              inputProps={{
                value: searchText,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value),
              }}
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <option value="rating">Mieux notés</option>
                <option value="reviews">Plus d'avis</option>
                <option value="packages">Plus de packages</option>
              </select>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              'Chargement...'
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredProviders.length}
                </span>{' '}
                prestataire{filteredProviders.length > 1 ? 's' : ''} trouvé
                {filteredProviders.length > 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Providers List */}
        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <ProviderCardSkeleton key={i} />
              ))}
            </>
          ) : filteredProviders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun prestataire trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    setSearchText('');
                    setSelectedCategory('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </motion.div>
          ) : (
            filteredProviders.map((provider, index) => (
              <ProviderListCard key={provider.id} provider={provider} index={index} />
            ))
          )}
        </div>

        {/* Load More (for pagination in real app) */}
        {!loading && filteredProviders.length > 0 && filteredProviders.length >= 6 && (
          <div className="mt-8 text-center">
            <Button variant="secondary" size="medium">
              Voir plus de prestataires
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersList;
