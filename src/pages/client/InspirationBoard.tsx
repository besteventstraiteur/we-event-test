import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

interface Inspiration {
  id: string;
  title: string;
  imageUrl: string;
  category: { name: string };
  theme: string;
  tags: string[];
  likes: number;
  views: number;
}

const InspirationBoardPage: React.FC = () => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInspirations();
  }, [search]);

  const fetchInspirations = async () => {
    try {
      const query = search ? `?search=${search}` : '';
      const response = await fetch(`/api/inspirations${query}`);
      const data = await response.json();
      if (data.success) setInspirations(data.data);
    } catch (error) {
      toast.error('Failed to load inspirations');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await fetch(`/api/inspirations/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: 'current-user-id' })
      });
      fetchInspirations();
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Inspiration Board (Pinterest Style)</h1>
        
        <div className="flex gap-4 mb-6">
          <Input 
            placeholder="Search inspirations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filters</Button>
        </div>

        {loading ? (
          <div className="columns-1 md:columns-3 lg:columns-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="mb-4 h-64 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-3 lg:columns-4 gap-4">
            {inspirations.map((item) => (
              <Card key={item.id} className="mb-4 break-inside-avoid overflow-hidden group relative">
                <img src={item.imageUrl} alt={item.title} className="w-full" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <div className="text-white">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm">{item.theme}</p>
                    <Button size="sm" variant="ghost" className="text-white mt-2" onClick={() => handleLike(item.id)}>
                      <Heart className="w-4 h-4 mr-1" />{item.likes}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InspirationBoardPage;
