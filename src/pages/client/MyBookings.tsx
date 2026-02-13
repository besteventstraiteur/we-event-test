import React, { useState, useEffect } from 'react';
import { Calendar, Package, TrendingUp, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import BookingCard from '../../components/bookings/BookingCard';
import { Booking, BookingStatus } from '../../types/booking';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data (replace with real API call)
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockBookings: Booking[] = [
          {
            id: '1',
            bookingNumber: 'BK-2024-001',
            clientId: 'client-1',
            providerId: 'provider-1',
            packageId: 'package-1',
            eventDate: '2024-06-15',
            eventTime: '14:00',
            location: 'Château de Versailles',
            guestCount: 150,
            status: 'CONFIRMED',
            totalAmount: 5000,
            deposit: 1500,
            specialRequests: 'Préférence pour menu végétarien',
            createdAt: '2024-01-10T10:00:00Z',
            updatedAt: '2024-01-10T10:00:00Z',
          },
          {
            id: '2',
            bookingNumber: 'BK-2024-002',
            clientId: 'client-1',
            providerId: 'provider-2',
            packageId: 'package-2',
            eventDate: '2024-07-20',
            eventTime: '18:00',
            location: 'Paris Convention Center',
            guestCount: 80,
            status: 'PENDING',
            totalAmount: 3500,
            specialRequests: '',
            createdAt: '2024-02-05T14:30:00Z',
            updatedAt: '2024-02-05T14:30:00Z',
          },
          {
            id: '3',
            bookingNumber: 'BK-2023-125',
            clientId: 'client-1',
            providerId: 'provider-3',
            packageId: 'package-3',
            eventDate: '2023-12-31',
            eventTime: '20:00',
            location: 'Le Grand Palais, Paris',
            guestCount: 200,
            status: 'COMPLETED',
            totalAmount: 8000,
            deposit: 3000,
            createdAt: '2023-11-01T09:00:00Z',
            updatedAt: '2024-01-02T10:00:00Z',
          },
        ];

        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  const handleViewDetails = (booking: Booking) => {
    console.log('View booking details:', booking);
    // TODO: Navigate to booking details page
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      // TODO: Call API to cancel booking
      console.log('Cancel booking:', booking);
      
      // Update local state
      setBookings(bookings.map((b) => 
        b.id === booking.id ? { ...b, status: 'CANCELLED' as BookingStatus } : b
      ));
    }
  };

  const statusOptions: Array<{ value: BookingStatus | 'ALL'; label: string; color: string }> = [
    { value: 'ALL', label: 'Toutes', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmées', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Terminées', color: 'bg-blue-100 text-blue-800' },
    { value: 'CANCELLED', label: 'Annulées', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
          <p className="text-gray-600">Gérez toutes vos réservations d'événements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmées</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminées</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    statusFilter === option.value
                      ? 'bg-purple-600 text-white'
                      : `${option.color} hover:opacity-80`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* New booking button */}
            <Button
              onClick={() => navigate('/partners')}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nouvelle réservation
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
                onCancel={handleCancelBooking}
                showActions={true}
              />
            ))}
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vous n\'avez pas encore de réservation'}
            </p>
            <Button
              onClick={() => {
                if (searchQuery || statusFilter !== 'ALL') {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                } else {
                  navigate('/partners');
                }
              }}
              variant="outlined"
            >
              {searchQuery || statusFilter !== 'ALL'
                ? 'Réinitialiser les filtres'
                : 'Explorer les prestataires'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
