/**
 * EventList Component - Example usage of eventService
 * 
 * Composant de démonstration pour tester le service Event
 */

import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { Event } from '../../types/event';
import { getEventTypeLabel, getEventStatusLabel, formatEventDateRange } from '../../types/event';

export const EventListExample: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getMyEvents({
        page: 1,
        limit: 10,
        sort: 'start_date',
        order: 'desc',
      });

      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des événements');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      const response = await eventService.deleteEvent(eventId);
      
      if (response.success) {
        // Remove from state
        setEvents(events.filter(e => e.id !== eventId));
        alert('Événement supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (err: any) {
      alert('Erreur réseau');
      console.error('Error deleting event:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {error}</p>
          <button
            onClick={loadEvents}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Aucun événement trouvé</p>
          <p className="text-gray-500 text-sm mt-2">
            Créez votre premier événement pour commencer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Événements</h2>
        <button
          onClick={loadEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualiser
        </button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    📅 {formatEventDateRange(event)}
                  </p>
                  <p>
                    📍 {event.location}
                  </p>
                  <p>
                    🎉 {getEventTypeLabel(event.event_type)}
                  </p>
                  {event.guest_count && (
                    <p>
                      👥 {event.guest_count} invités
                    </p>
                  )}
                  {event.estimated_budget && (
                    <p>
                      💰 Budget estimé: {event.estimated_budget.toLocaleString('fr-FR')} €
                    </p>
                  )}
                </div>

                {event.description && (
                  <p className="mt-3 text-gray-700 text-sm">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                >
                  {getEventStatusLabel(event.status)}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Voir détails: ${event.id}`)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => alert(`Modifier: ${event.id}`)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to get status color
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-200 text-gray-800',
    planned: 'bg-blue-200 text-blue-800',
    ongoing: 'bg-green-200 text-green-800',
    completed: 'bg-purple-200 text-purple-800',
    cancelled: 'bg-red-200 text-red-800',
  };
  return colors[status] || 'bg-gray-200 text-gray-800';
}

export default EventListExample;
