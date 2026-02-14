import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const bookingId = 'demo-booking-id';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/invoices`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setInvoices(data.data);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Invoices & Payments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice: any) => (
            <Card key={invoice.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-6 h-6 text-green-600" />
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <h3 className="font-bold">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-gray-600 mt-1">{invoice.serviceDescription}</p>
              <p className="text-2xl font-bold text-green-600 mt-3">{invoice.amount}€</p>
              <p className="text-xs text-gray-500 mt-1">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <div className="mt-4 flex gap-2">
                {invoice.status !== 'PAID' && (
                  <Button size="sm" className="flex-1"><DollarSign className="w-4 h-4 mr-1" />Pay Now</Button>
                )}
                <Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
