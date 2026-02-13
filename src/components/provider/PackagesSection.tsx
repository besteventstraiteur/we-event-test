import React, { useState, useEffect } from 'react';
import { Package as PackageIcon, Filter, Search } from 'lucide-react';
import PackageCard from '../packages/PackageCard';
import { Package, PackageCategory } from '../../types/package';
import Button from '../ui/Button';

interface PackagesSectionProps {
  providerId: string;
  onSelectPackage?: (pkg: Package) => void;
  className?: string;
}

const PackagesSection: React.FC<PackagesSectionProps> = ({
  providerId,
  onSelectPackage,
  className = '',
}) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration (replace with real API call)
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockPackages: Package[] = [
          {
            id: '1',
            providerId,
            name: 'Package Mariage Premium',
            description: 'Formule complète pour un mariage inoubliable avec DJ, décoration et restauration',
            category: 'WEDDING',
            price: 5000,
            originalPrice: 6000,
            currency: 'EUR',
            duration: '8 heures',
            status: 'ACTIVE',
            featured: true,
            features: [
              'DJ professionnel',
              'Décoration florale complète',
              'Menu 3 services pour 100 personnes',
              'Coordination du jour J',
              'Photobooth inclus',
            ],
            minCapacity: 80,
            maxCapacity: 120,
            bookingsCount: 15,
            images: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            providerId,
            name: 'Package Anniversaire',
            description: 'Célébrez votre anniversaire avec style',
            category: 'BIRTHDAY',
            price: 1500,
            currency: 'EUR',
            duration: '4 heures',
            status: 'ACTIVE',
            featured: false,
            features: [
              'Décoration thématique',
              'Gâteau personnalisé',
              'Animations pour enfants',
              'Buffet pour 50 personnes',
            ],
            minCapacity: 30,
            maxCapacity: 60,
            bookingsCount: 28,
            images: [
              'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            providerId,
            name: 'Package Corporate',
            description: 'Solution professionnelle pour vos événements d\'entreprise',
            category: 'CORPORATE',
            price: 3500,
            currency: 'EUR',
            duration: '6 heures',
            status: 'ACTIVE',
            featured: false,
            features: [
              'Salle de conférence équipée',
              'Matériel audiovisuel',
              'Pause-café et déjeuner',
              'Service de traiteur professionnel',
            ],
            minCapacity: 20,
            maxCapacity: 100,
            bookingsCount: 12,
            images: [
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setPackages(mockPackages);
        setLoading(false);
      }, 1000);
    };

    fetchPackages();
  }, [providerId]);

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = selectedCategory === 'ALL' || pkg.category === selectedCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ value: PackageCategory | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tous' },
    { value: 'WEDDING', label: 'Mariages' },
    { value: 'BIRTHDAY', label: 'Anniversaires' },
    { value: 'CORPORATE', label: 'Entreprise' },
    { value: 'CONFERENCE', label: 'Conférences' },
    { value: 'PARTY', label: 'Soirées' },
    { value: 'OTHER', label: 'Autres' },
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <PackageIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nos Packages</h2>
            <p className="text-gray-600">
              {filteredPackages.length} {filteredPackages.length > 1 ? 'formules disponibles' : 'formule disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                selectedCategory === category.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-xl"></div>
              <div className="bg-white p-6 rounded-b-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packages grid */}
      {!loading && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSelect={onSelectPackage}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucun package trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            variant="outlined"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackagesSection;
