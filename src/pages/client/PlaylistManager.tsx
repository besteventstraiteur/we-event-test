import React, { useState, useEffect } from 'react';
import { Music, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

const PlaylistManager: React.FC = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = 'demo-event-id';

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/playlists`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setPlaylists(data.data);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (!name) return;
    try {
      await fetch(`/api/events/${eventId}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, songs: [], mood: 'Party' })
      });
      toast.success('Playlist created');
      fetchPlaylists();
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">DJ Playlists</h1>
          <Button onClick={createPlaylist}><Plus className="w-4 h-4 mr-2" />New Playlist</Button>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists.map((playlist: any) => (
              <Card key={playlist.id} className="p-6">
                <Music className="w-8 h-8 mb-2 text-purple-600" />
                <h3 className="font-bold">{playlist.name}</h3>
                <p className="text-sm text-gray-600">{playlist.songs?.length || 0} songs</p>
                <p className="text-xs text-gray-500 mt-1">Mood: {playlist.mood || 'N/A'}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;
