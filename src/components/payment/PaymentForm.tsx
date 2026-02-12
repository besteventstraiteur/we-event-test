
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentService, { PaymentIntent } from '@/services/PaymentService';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onCancel?: () => void;
  buttonText?: string;
  isLoading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'eur',
  description = '',
  onSuccess,
  onCancel,
  buttonText = 'Payer',
  isLoading = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Erreur lors du chargement du formulaire de paiement.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent if we don't have one
      if (!clientSecret) {
        const intent = await PaymentService.createPaymentIntent(amount, currency, description);
        setClientSecret(intent.clientSecret);
      }

      if (!clientSecret) {
        throw new Error("Impossible de créer l'intention de paiement");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
            name: name,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Une erreur est survenue lors du paiement.");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "Paiement réussi",
          description: `Votre paiement de ${(amount / 100).toFixed(2)} ${currency.toUpperCase()} a été traité avec succès.`,
        });
        if (onSuccess) onSuccess(paymentIntent.id);
      }
    } catch (e) {
      console.error("Payment error:", e);
      setError("Une erreur est survenue lors du traitement du paiement.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
        <CardDescription>
          {description || `Paiement de ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom sur la carte</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votreemail@exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-element">Carte de crédit</Label>
            <div className="border rounded-md p-3" id="card-element">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading || isLoading}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading || isLoading || !stripe}>
            {loading || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
