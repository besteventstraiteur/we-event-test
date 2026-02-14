import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges');
      const data = await response.json();
      if (data.success) setBadges(data.data);
    } catch (error) {
      toast.error('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Badges & Achievements</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {badges.map((badge: any) => (
            <Card key={badge.id} className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-bold">{badge.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
              <p className="text-xs text-gray-500 mt-2">{badge.requiredPoints} points</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesPage;
