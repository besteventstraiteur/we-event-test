import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const FloorPlanPage: React.FC = () => {
  const [roomPlans, setRoomPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = 'demo-event-id';

  useEffect(() => {
    fetchRoomPlans();
  }, []);

  const fetchRoomPlans = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/room-plans`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setRoomPlans(data.data);
    } catch (error) {
      toast.error('Failed to load room plans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">2D Floor Plan Editor</h1>
          <Button><Plus className="w-4 h-4 mr-2" />New Plan</Button>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomPlans.map((plan: any) => (
              <Card key={plan.id} className="p-6">
                <LayoutGrid className="w-8 h-8 mb-2 text-blue-600" />
                <h3 className="font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-600">Size: {plan.width}m x {plan.length}m</p>
                <p className="text-sm text-gray-600">Capacity: {plan.capacity} guests</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlanPage;
