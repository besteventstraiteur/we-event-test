
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Heart, CreditCard, DollarSign, Landmark, Globe, Euro, ThumbsUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StripeProvider from "@/components/payment/StripeProvider";
import PaymentService from "@/services/PaymentService";

const GiftFund = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("50");
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("donation");
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  
  // Mock data - in a real app, this would come from the API
  const totalGoal = 5000;
  const currentAmount = 2750;
  const progress = (currentAmount / totalGoal) * 100;
  
  const donationOptions = [
    { value: "20", label: "20 €" },
    { value: "50", label: "50 €" },
    { value: "100", label: "100 €" },
    { value: "custom", label: "Autre" },
  ];
  
  const handleDonate = () => {
    if (!name.trim()) {
      toast({
        title: "Information manquante",
        description: "Veuillez indiquer votre nom",
        variant: "destructive"
      });
      return;
    }
    setShowDialog(true);
  };
  
  const handleProcessPayment = async () => {
    setPaymentProcessing(true);
    
    try {
      // Convertir le montant en centimes
      const amountInCents = parseFloat(amount) * 100;
      
      // Appel au service de paiement
      await PaymentService.processGiftFundContribution(
        amountInCents,
        message,
        name
      );
      
      // Afficher le message de remerciement
      setShowDialog(false);
      setShowThankYou(true);
      
      // Reset form
      setAmount("50");
      setMessage("");
    } catch (error) {
      console.error("Erreur de paiement:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement de votre paiement.",
        variant: "destructive"
      });
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const closeThankYou = () => {
    setShowThankYou(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-500" />
          Cagnotte des mariés
        </CardTitle>
        <CardDescription>
          Participez à la cagnotte pour le voyage de noces ou un cadeau commun
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-amber-50 rounded-lg space-y-3 border border-amber-100">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-amber-800">Objectif: {totalGoal} €</span>
            <span className="text-sm font-medium text-amber-800">{currentAmount} € collectés</span>
          </div>
          <Progress value={progress} className="h-2 bg-amber-100" />
          <p className="text-xs text-amber-700 italic text-center">
            Aidez-nous à réaliser notre rêve de voyage de noces !
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="donation" className="flex items-center gap-1">
              <Heart className="h-4 w-4" /> Participation
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-1">
              <Gift className="h-4 w-4" /> Liste de cadeaux
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="donation" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Vos coordonnées</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email" 
                    placeholder="Votre email (optionnel)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Choisissez un montant</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {donationOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={amount === option.value ? "default" : "outline"}
                      className={amount === option.value ? "bg-amber-500 hover:bg-amber-600" : ""}
                      onClick={() => setAmount(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                
                {amount === "custom" && (
                  <div className="mt-3">
                    <div className="flex">
                      <Input
                        type="number"
                        placeholder="Montant"
                        min="1"
                        className="rounded-r-none"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <Button variant="outline" className="rounded-l-none" disabled>€</Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Message (optionnel)</h3>
                <Textarea 
                  placeholder="Ajoutez un message aux mariés..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600"
                onClick={handleDonate}
              >
                Participer
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gifts" className="p-4">
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Nous avons également créé une liste de cadeaux si vous préférez offrir quelque chose de spécifique.
              </p>
              
              <div className="grid gap-4">
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">Service à thé japonais</h4>
                    <p className="text-sm text-gray-500">120 €</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Offrir
                  </Button>
                </div>
                
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">Cours de cuisine pour 2</h4>
                    <p className="text-sm text-gray-500">80 €</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Offrir
                  </Button>
                </div>
                
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">Week-end détente en spa</h4>
                    <p className="text-sm text-gray-500">250 €</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Offrir
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finaliser votre participation</DialogTitle>
            <DialogDescription>
              Vous allez faire une participation de {amount} € pour la cagnotte des mariés.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <StripeProvider>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex flex-col items-center justify-center h-16 gap-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Carte bancaire</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-16 gap-1">
                    <Landmark className="h-5 w-5" />
                    <span className="text-xs">Virement</span>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Nom sur la carte</label>
                    <Input placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Numéro de carte</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Date d'expiration</label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CVC</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            </StripeProvider>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              disabled={paymentProcessing}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleProcessPayment}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>Payer {amount} €</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              Merci pour votre participation !
            </DialogTitle>
            <DialogDescription>
              Votre contribution de {amount} € a bien été enregistrée.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center space-y-3">
            <div className="mx-auto bg-green-50 w-16 h-16 flex items-center justify-center rounded-full">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-gray-600">
              {name}, votre participation est très appréciée ! Les mariés ont été notifiés de votre généreuse contribution.
            </p>
            {message && (
              <div className="bg-gray-50 p-3 rounded-md italic text-gray-600 text-sm">
                "{message}"
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={closeThankYou}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Composant manquant pour le badge CheckCircle
const CheckCircle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default GiftFund;
