import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const bookingId = 'demo-booking-id';

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/contracts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setContracts(data.data);
    } catch (error) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contracts & E-Signatures</h1>
        <div className="space-y-4">
          {contracts.map((contract: any) => (
            <Card key={contract.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <FileText className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-bold">{contract.contractNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1">Between: {contract.clientName} & {contract.partnerName}</p>
                    <p className="text-xs text-gray-500 mt-2">Created: {new Date(contract.createdAt).toLocaleDateString()}</p>
                    {contract.signedAt && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Signed on {new Date(contract.signedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {contract.status === 'DRAFT' && (
                  <Button size="sm">Sign Contract</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;
