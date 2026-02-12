
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PaymentForm from './PaymentForm';
import StripeProvider from './StripeProvider';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentService from '@/services/PaymentService';

// Interface pour les paiements de prestataires
interface VendorPaymentItem {
  id: string;
  vendor: string;
  amount: number; // en centimes
  dueDate: string;
  status: 'pending' | 'paid' | 'late';
  description: string;
}

// Mock vendor payment data
const vendorPayments: VendorPaymentItem[] = [
  {
    id: 'v1',
    vendor: 'DJ Mix Master',
    amount: 120000, // in cents (1200€)
    dueDate: '2024-06-15',
    status: 'pending',
    description: 'Acompte prestation DJ'
  },
  {
    id: 'v2',
    vendor: 'Fleurs Élégance',
    amount: 45000, // in cents (450€)
    dueDate: '2024-07-01',
    status: 'pending',
    description: 'Acompte décoration florale'
  },
  {
    id: 'v3',
    vendor: 'Traiteur Délice',
    amount: 250000, // in cents (2500€)
    dueDate: '2024-05-30',
    status: 'paid',
    description: 'Acompte menu et service'
  },
  {
    id: 'v4',
    vendor: 'Photographe Instant',
    amount: 80000, // in cents (800€)
    dueDate: '2024-04-30',
    status: 'late',
    description: 'Acompte reportage photo'
  }
];

const VendorPayment = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<VendorPaymentItem[]>(vendorPayments);
  const [selectedPayment, setSelectedPayment] = useState<VendorPaymentItem | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [usingExistingCard, setUsingExistingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mocked user ID for demonstration
  const userId = "user_123456";
  
  const handlePayClick = (payment: VendorPaymentItem) => {
    setSelectedPayment(payment);
    setPaymentOpen(true);
    setUsingExistingCard(false);
  };
  
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!selectedPayment) return;
    
    try {
      setIsProcessing(true);
      
      // Simulate processing the vendor payment
      await PaymentService.processVendorPayment(
        selectedPayment.id,
        selectedPayment.amount,
        `Paiement pour ${selectedPayment.vendor}: ${selectedPayment.description}`
      );
      
      // Update local state to reflect the payment
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === selectedPayment.id 
            ? { ...payment, status: 'paid' } 
            : payment
        )
      );
      
      toast({
        title: "Paiement réussi",
        description: `Votre paiement à ${selectedPayment.vendor} a été traité avec succès.`,
      });
      
      setPaymentOpen(false);
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePayWithSavedMethod = async () => {
    if (!selectedPayment) return;
    
    try {
      setIsProcessing(true);
      
      // Simulate processing the vendor payment with saved method
      await PaymentService.processVendorPayment(
        selectedPayment.id,
        selectedPayment.amount,
        `Paiement pour ${selectedPayment.vendor}: ${selectedPayment.description}`,
        'pm_simulated_payment'
      );
      
      // Update local state to reflect the payment
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === selectedPayment.id 
            ? { ...payment, status: 'paid' } 
            : payment
        )
      );
      
      toast({
        title: "Paiement réussi",
        description: `Votre paiement à ${selectedPayment.vendor} a été traité avec succès.`,
      });
      
      setPaymentOpen(false);
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };
  
  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payé</Badge>;
    } else if (status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">À payer</Badge>;
    } else if (status === 'late') {
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">En retard</Badge>;
    } else {
      return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const handleSelectSavedMethod = (method: any) => {
    setUsingExistingCard(true);
   
  };
  
  const handleSelectNewCard = () => {
    setUsingExistingCard(false);
  };

  // Calculer le total des paiements en attente
  const pendingPaymentsTotal = payments
    .filter(payment => payment.status === 'pending' || payment.status === 'late')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Paiements prestataires</CardTitle>
              <CardDescription>Gérez les paiements pour vos prestataires de mariage</CardDescription>
            </div>
            <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-md border border-amber-200">
              <span className="font-medium">Total à payer:</span> {formatAmount(pendingPaymentsTotal)} €
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prestataire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead className="hidden md:table-cell">Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.vendor}</TableCell>
                  <TableCell>{formatAmount(payment.amount)} €</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    {(payment.status === 'pending' || payment.status === 'late') && (
                      <Button onClick={() => handlePayClick(payment)} className="hidden sm:inline-flex">
                        Payer <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {(payment.status === 'pending' || payment.status === 'late') && (
                      <Button onClick={() => handlePayClick(payment)} size="icon" className="sm:hidden">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                    {payment.status === 'paid' && (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" /> Payé
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Paiement - {selectedPayment?.vendor}</DialogTitle>
            <DialogDescription>
              {selectedPayment?.description} - {selectedPayment ? formatAmount(selectedPayment.amount) : ''} €
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <PaymentMethodSelector 
              userId={userId}
              onSelectSaved={handleSelectSavedMethod}
              onSelectNew={handleSelectNewCard}
            />
            
            {!usingExistingCard && selectedPayment && (
              <StripeProvider>
                <PaymentForm 
                  amount={selectedPayment.amount}
                  description={`Paiement pour ${selectedPayment.vendor}: ${selectedPayment.description}`}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setPaymentOpen(false)}
                  buttonText="Payer maintenant"
                  isLoading={isProcessing}
                />
              </StripeProvider>
            )}
            
            {usingExistingCard && selectedPayment && (
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  onClick={handlePayWithSavedMethod}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payer {formatAmount(selectedPayment.amount)} € avec la carte sélectionnée
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPayment;
