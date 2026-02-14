import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const MenuPlanner: React.FC = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = 'demo-event-id';

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/menu-items`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setMenuItems(data.data);
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu & Table Planning</h1>
          <Button><Plus className="w-4 h-4 mr-2" />Add Item</Button>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item: any) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">Category: {item.category}</p>
                {item.allergens?.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">Allergens: {item.allergens.join(', ')}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPlanner;
