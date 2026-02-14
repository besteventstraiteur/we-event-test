import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const AmbassadorsPage: React.FC = () => {
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch('/api/ambassadors', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setAmbassadors(data.data);
    } catch (error) {
      toast.error('Failed to load ambassadors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ambassadors</h1>
          <Button><Plus className="w-4 h-4 mr-2" />Add Ambassador</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ambassadors.map((amb: any) => (
            <Card key={amb.id} className="p-6">
              <Users className="w-8 h-8 mb-2 text-purple-600" />
              <h3 className="font-bold">{amb.fullName}</h3>
              <p className="text-sm text-gray-600">{amb.email}</p>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">Code: {amb.referralCode}</p>
                <p className="text-xs text-gray-500">Commission: {amb.commissionRate}%</p>
                <p className="text-xs text-gray-500">Total: {amb.totalCommission || 0}€</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmbassadorsPage;
