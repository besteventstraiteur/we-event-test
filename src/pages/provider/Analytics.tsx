import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Calendar,
  Users,
  Euro,
  Star,
  MessageCircle,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    growth: number;
  };
  packages: {
    total: number;
    active: number;
    mostBooked: string;
  };
  ratings: {
    average: number;
    total: number;
    distribution: { [key: number]: number };
  };
  profileViews: {
    total: number;
    thisMonth: number;
    growth: number;
  };
}

const ProviderAnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Mock data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          revenue: {
            total: 45000,
            monthly: 12500,
            growth: 15.5,
          },
          bookings: {
            total: 28,
            pending: 3,
            confirmed: 8,
            completed: 15,
            cancelled: 2,
            growth: 23.4,
          },
          packages: {
            total: 5,
            active: 4,
            mostBooked: 'Package Mariage Premium',
          },
          ratings: {
            average: 4.7,
            total: 24,
            distribution: {
              5: 18,
              4: 4,
              3: 2,
              2: 0,
              1: 0,
            },
          },
          profileViews: {
            total: 1250,
            thisMonth: 340,
            growth: 18.2,
          },
        };

        setAnalytics(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Analytique</h1>
            <p className="text-gray-600">Vue d'ensemble de vos performances</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Revenus du mois"
            value={formatCurrency(analytics.revenue.monthly)}
            growth={analytics.revenue.growth}
            icon={Euro}
            color="bg-green-500"
            subtitle={`Total: ${formatCurrency(analytics.revenue.total)}`}
          />
          <StatCard
            title="Réservations"
            value={analytics.bookings.total}
            growth={analytics.bookings.growth}
            icon={Calendar}
            color="bg-blue-500"
            subtitle={`${analytics.bookings.confirmed} confirmées`}
          />
          <StatCard
            title="Note moyenne"
            value={analytics.ratings.average.toFixed(1)}
            icon={Star}
            color="bg-yellow-500"
            subtitle={`${analytics.ratings.total} avis`}
          />
          <StatCard
            title="Vues du profil"
            value={analytics.profileViews.thisMonth}
            growth={analytics.profileViews.growth}
            icon={Eye}
            color="bg-purple-500"
            subtitle={`Total: ${analytics.profileViews.total}`}
          />
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            État des Réservations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {analytics.bookings.pending}
              </div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {analytics.bookings.confirmed}
              </div>
              <div className="text-sm text-gray-600">Confirmées</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {analytics.bookings.completed}
              </div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {analytics.bookings.cancelled}
              </div>
              <div className="text-sm text-gray-600">Annulées</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Packages Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              Mes Packages
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total packages</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.packages.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.packages.active}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Package le plus réservé</p>
                <p className="font-bold text-gray-900">{analytics.packages.mostBooked}</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Distribution des Notes
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = analytics.ratings.distribution[star] || 0;
                const percentage = (count / analytics.ratings.total) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition rounded-lg p-4 text-left">
              <Package className="w-6 h-6 mb-2" />
              <h3 className="font-bold mb-1">Gérer les Packages</h3>
              <p className="text-sm text-purple-100">Créer ou modifier vos packages</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition rounded-lg p-4 text-left">
              <Calendar className="w-6 h-6 mb-2" />
              <h3 className="font-bold mb-1">Voir les Réservations</h3>
              <p className="text-sm text-purple-100">Gérer vos réservations</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition rounded-lg p-4 text-left">
              <MessageCircle className="w-6 h-6 mb-2" />
              <h3 className="font-bold mb-1">Messages Clients</h3>
              <p className="text-sm text-purple-100">Répondre à vos messages</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalyticsDashboard;
