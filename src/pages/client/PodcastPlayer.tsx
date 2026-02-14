import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const PodcastPlayer: React.FC = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('/api/podcasts');
      const data = await response.json();
      if (data.success) setPodcasts(data.data);
    } catch (error) {
      toast.error('Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Podcasts & Talk Shows</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {podcasts.map((podcast: any) => (
            <Card key={podcast.id} className="p-4">
              <div className="text-4xl mb-2">{podcast.coverEmoji || '🎙️'}</div>
              <h3 className="font-semibold">{podcast.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{podcast.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{podcast.duration}</span>
                <Button size="sm"><Play className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
