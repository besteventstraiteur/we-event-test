import React, { useState, useEffect } from 'react';
import { Globe, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

const MiniSiteEditor: React.FC = () => {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const eventId = 'demo-event-id';

  useEffect(() => {
    fetchSite();
  }, []);

  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/site`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setSite(data.data);
    } catch (error) {
      toast.error('Failed to load mini-site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event Mini-Site</h1>
          <Button><Edit className="w-4 h-4 mr-2" />Customize</Button>
        </div>
        <Card className="p-6">
          <Globe className="w-12 h-12 mb-4 text-indigo-600" />
          <h3 className="font-bold text-xl">{site?.title || 'Your Event Site'}</h3>
          <p className="text-gray-600 mt-2">{site?.welcomeMessage || 'Welcome to our event!'}</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm"><strong>Slug:</strong> {site?.slug || 'N/A'}</p>
            <p className="text-sm"><strong>Theme:</strong> {site?.theme || 'elegant'}</p>
            <p className="text-sm"><strong>Status:</strong> {site?.published ? 'Published' : 'Draft'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MiniSiteEditor;
