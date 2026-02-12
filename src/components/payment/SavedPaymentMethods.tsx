
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard } from 'lucide-react';
import PaymentService, { PaymentMethod } from '@/services/PaymentService';

interface SavedPaymentMethodsProps {
  userId: string;
  onSelect: (paymentMethod: PaymentMethod | null) => void;
  selectedId?: string;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({ 
  userId, 
  onSelect,
  selectedId 
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await PaymentService.getSavedPaymentMethods(userId);
        setPaymentMethods(methods);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Impossible de récupérer vos méthodes de paiement enregistrées');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [userId]);

  const handleChange = (paymentMethodId: string) => {
    const method = paymentMethods.find(m => m.id === paymentMethodId);
    onSelect(method || null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm py-4">{error}</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">
        Aucune méthode de paiement enregistrée
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Méthodes de paiement enregistrées</CardTitle>
        <CardDescription>
          Sélectionnez une carte pour l'utiliser pour ce paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedId}
          onValueChange={handleChange}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50"
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1 flex items-center cursor-pointer">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {method.card?.brand.charAt(0).toUpperCase() + method.card?.brand.slice(1)}
                  </span>
                  <span className="ml-2 text-gray-600">•••• {method.card?.last4}</span>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  Expire {method.card?.expMonth}/{method.card?.expYear}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SavedPaymentMethods;
