
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Link, Share2, Copy, Check } from 'lucide-react';
import StripeProvider from '../StripeProvider';
import PaymentForm from '../PaymentForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contribution } from '@/hooks/useGiftFundManager';

interface GiftFundOverviewProps {
  totalContributions: number;
  giftFundLink: string;
  linkCopied: boolean;
  handleCopyLink: () => void;
  showPaymentForm: boolean;
  setShowPaymentForm: (show: boolean) => void;
  amount: number;
  customAmount: string;
  handleAmountSelection: (amount: number) => void;
  handleCustomAmount: (value: string) => void;
  handlePaymentSuccess: (paymentIntentId: string) => void;
  isSubmitting: boolean;
}

const GiftFundOverview: React.FC<GiftFundOverviewProps> = ({
  totalContributions,
  giftFundLink,
  linkCopied,
  handleCopyLink,
  showPaymentForm,
  setShowPaymentForm,
  amount,
  customAmount,
  handleAmountSelection,
  handleCustomAmount,
  handlePaymentSuccess,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <h3 className="text-2xl font-bold">{totalContributions.toFixed(2)} €</h3>
        <p className="text-gray-500">Total des contributions reçues</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Lien de votre cagnotte</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {linkCopied ? <Check size={16} /> : <Copy size={16} />}
              {linkCopied ? ' Copié' : ' Copier'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-1" /> Partager
            </Button>
          </div>
        </div>
        <div className="flex items-center rounded-md border px-3 py-2 text-sm">
          <Link size={16} className="mr-2 text-gray-400" />
          <span className="flex-1 truncate">{giftFundLink}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Partagez ce lien avec vos invités pour qu'ils puissent contribuer à votre cagnotte
        </p>
      </div>
      
      <div className="pt-2">
        <Button
          onClick={() => setShowPaymentForm(true)}
          className="w-full"
        >
          <Gift className="mr-2" /> Tester une contribution
        </Button>
      </div>
      
      {showPaymentForm && (
        <div className="mt-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Choisissez un montant</h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button
                variant={amount === 2000 ? "default" : "outline"}
                onClick={() => handleAmountSelection(2000)}
              >
                20 €
              </Button>
              <Button
                variant={amount === 5000 ? "default" : "outline"}
                onClick={() => handleAmountSelection(5000)}
              >
                50 €
              </Button>
              <Button
                variant={amount === 10000 ? "default" : "outline"}
                onClick={() => handleAmountSelection(10000)}
              >
                100 €
              </Button>
            </div>
            <div className="mt-2">
              <Label htmlFor="custom-amount">Montant personnalisé (€)</Label>
              <Input
                id="custom-amount"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="Autre montant"
              />
            </div>
          </div>
          
          <StripeProvider>
            <PaymentForm
              amount={amount}
              description="Contribution à la cagnotte de mariage"
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentForm(false)}
              buttonText={isSubmitting ? "Traitement en cours..." : "Contribuer"}
              isLoading={isSubmitting}
            />
          </StripeProvider>
        </div>
      )}
    </div>
  );
};

export default GiftFundOverview;
