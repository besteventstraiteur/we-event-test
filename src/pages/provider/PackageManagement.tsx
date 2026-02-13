import React, { useState, useEffect } from 'react';
import { Package as PackageIcon, Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, Search, Filter } from 'lucide-react';
import { Package, PackageStatus } from '../../types/package';
import PackageCard from '../../components/packages/PackageCard';
import Button from '../../components/ui/Button';

const PackageManagementPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);

      setTimeout(() => {
        const mockPackages: Package[] = [
          {
            id: '1',
            providerId: 'provider-1',
            name: 'Package Mariage Premium',
            description: 'Formule complète pour un mariage inoubliable',
            category: 'WEDDING',
            price: 5000,
            originalPrice: 6000,
            currency: 'EUR',
            duration: '8 heures',
            status: 'ACTIVE',
            featured: true,
            features: ['DJ', 'Décoration', 'Menu 3 services', 'Coordination'],
            minCapacity: 80,
            maxCapacity: 120,
            bookingsCount: 15,
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            providerId: 'provider-1',
            name: 'Package Anniversaire',
            description: 'Célébrez votre anniversaire avec style',
            category: 'BIRTHDAY',
            price: 1500,
            currency: 'EUR',
            duration: '4 heures',
            status: 'ACTIVE',
            featured: false,
            features: ['Décoration thématique', 'Gâteau', 'Animations', 'Buffet'],
            minCapacity: 30,
            maxCapacity: 60,
            bookingsCount: 28,
            images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            providerId: 'provider-1',
            name: 'Package Corporate',
            description: 'Solution professionnelle pour événements d\'entreprise',
            category: 'CORPORATE',
            price: 3500,
            currency: 'EUR',
            duration: '6 heures',
            status: 'INACTIVE',
            featured: false,
            features: ['Salle équipée', 'Audiovisuel', 'Pause-café', 'Traiteur'],
            minCapacity: 20,
            maxCapacity: 100,
            bookingsCount: 12,
            images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setPackages(mockPackages);
        setLoading(false);
      }, 1000);
    };

    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesStatus = statusFilter === 'ALL' || pkg.status === statusFilter;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (id: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id
          ? { ...pkg, status: pkg.status === 'ACTIVE' ? 'INACTIVE' : ('ACTIVE' as PackageStatus) }
          : pkg
      )
    );
  };

  const handleToggleFeatured = (id: string) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, featured: !pkg.featured } : pkg)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  const stats = {
    total: packages.length,
    active: packages.filter((p) => p.status === 'ACTIVE').length,
    inactive: packages.filter((p) => p.status === 'INACTIVE').length,
    featured: packages.filter((p) => p.featured).length,
    totalBookings: packages.reduce((sum, p) => sum + (p.bookingsCount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Packages</h1>
            <p className="text-gray-600">Créez et gérez vos offres de services</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un package
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <PackageIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Actifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactifs</p>
                <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <EyeOff className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En vedette</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Réservations</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
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
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'Tous' : status === 'ACTIVE' ? 'Actifs' : 'Inactifs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="relative">
                <PackageCard package={pkg} showActions={false} />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => handleToggleFeatured(pkg.id)}
                    className={`p-2 rounded-lg shadow-lg transition ${
                      pkg.featured
                        ? 'bg-yellow-400 hover:bg-yellow-500'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    title={pkg.featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(pkg.id)}
                    className={`p-2 rounded-lg shadow-lg transition ${
                      pkg.status === 'ACTIVE'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={pkg.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                  >
                    {pkg.status === 'ACTIVE' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => console.log('Edit', pkg.id)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition"
                    title="Modifier"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun package trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier package'}
            </p>
            <Button
              onClick={() => {
                if (searchQuery || statusFilter !== 'ALL') {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                } else {
                  setShowCreateModal(true);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {searchQuery || statusFilter !== 'ALL' ? 'Réinitialiser les filtres' : 'Créer un package'}
            </Button>
          </div>
        )}

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Créer un Package</h2>
              <p className="text-gray-600 mb-6">
                Fonctionnalité de création de package à venir. Pour l'instant, vous pouvez gérer vos packages existants.
              </p>
              <Button onClick={() => setShowCreateModal(false)} className="w-full">
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageManagementPage;
