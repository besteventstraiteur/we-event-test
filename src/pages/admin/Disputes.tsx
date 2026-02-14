import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

const DisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch('/api/disputes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setDisputes(data.data);
    } catch (error) {
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Disputes & Litigations</h1>
        <div className="space-y-4">
          {disputes.map((dispute: any) => (
            <Card key={dispute.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-bold">{dispute.reason}</h3>
                    <p className="text-sm text-gray-600 mt-1">{dispute.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Client: {dispute.clientEmail}</p>
                    <p className="text-xs text-gray-500">Partner: {dispute.partnerEmail}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  dispute.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                  dispute.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {dispute.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisputesPage;
