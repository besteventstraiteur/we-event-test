import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data pour la démonstration
const mockEvents = [
  {
    id: '1',
    title: 'Mariage d\'été',
    description: 'Grande célébration en plein air',
    eventType: 'WEDDING',
    status: 'CONFIRMED',
    startDate: '2026-07-15T14:00:00Z',
    endDate: '2026-07-15T23:00:00Z',
    location: 'Château de Versailles',
    guestCount: 150,
    budget: 25000
  },
  {
    id: '2',
    title: 'Séminaire d\'entreprise',
    description: 'Team building et conférences',
    eventType: 'CORPORATE',
    status: 'PENDING',
    startDate: '2026-08-20T09:00:00Z',
    endDate: '2026-08-20T18:00:00Z',
    location: 'Paris Convention Center',
    guestCount: 80,
    budget: 15000
  }
];

const EventModuleTestPage: React.FC = () => {
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'stats'>('list');

  // Simulations des actions (pas de vraies requêtes API)
  const handleCreateEvent = () => {
    setLoading(true);
    setTimeout(() => {
      const newEvent = {
        id: String(events.length + 1),
        title: 'Nouvel événement',
        description: 'Créé via le test',
        eventType: 'BIRTHDAY',
        status: 'DRAFT',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: 'À définir',
        guestCount: 50,
        budget: 5000
      };
      setEvents([...events, newEvent]);
      setLoading(false);
      setActiveTab('list');
    }, 500);
  };

  const handleDeleteEvent = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setEvents(events.filter(e => e.id !== id));
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📅 Event Module - Test Page
              </h1>
              <p className="text-gray-600">
                Module de gestion des événements (Version MOCK - Données simulées)
              </p>
            </div>
            <Link
              to="/test/global-system"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ← Retour au dashboard
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Liste des événements
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ Créer un événement
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'stats'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Statistiques
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📋 Liste des événements ({events.length})
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {event.eventType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          event.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          👥 {event.guestCount} invités
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          💰 {event.budget.toLocaleString()}€
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        📍 {event.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition font-semibold"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ➕ Créer un nouvel événement
            </h2>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">
                Cette action créera un événement simulé avec des données par défaut
              </p>
              <button
                onClick={handleCreateEvent}
                disabled={loading}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition font-bold text-lg"
              >
                {loading ? '⏳ Création...' : '✨ Créer un événement simulé'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Statistiques des événements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{events.length}</div>
                <div className="text-blue-100">Total événements</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">
                  {events.filter(e => e.status === 'CONFIRMED').length}
                </div>
                <div className="text-green-100">Confirmés</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">
                  {events.reduce((sum, e) => sum + e.guestCount, 0)}
                </div>
                <div className="text-purple-100">Total invités</div>
              </div>
            </div>
          </div>
        )}

        {/* Info banner */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-center">
            ⚠️ <strong>Mode MOCK</strong> - Ces données sont simulées localement. 
            Le backend API n'est pas encore connecté. Toutes les actions sont des simulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventModuleTestPage;
