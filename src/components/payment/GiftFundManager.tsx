
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank } from 'lucide-react';
import { useGiftFundManager } from '@/hooks/useGiftFundManager';
import GiftFundOverview from './gift-fund/GiftFundOverview';
import GiftFundSettings from './gift-fund/GiftFundSettings';
import GiftFundContributions from './gift-fund/GiftFundContributions';

const GiftFundManager = () => {
  const {
    isEnabled,
    setIsEnabled,
    showPaymentForm,
    setShowPaymentForm,
    giftFundLink,
    linkCopied,
    amount,
    customAmount,
    isSubmitting,
    fundTitle,
    setFundTitle,
    fundDescription,
    setFundDescription,
    contributions,
    totalContributions,
    handleCopyLink,
    handleAmountSelection,
    handleCustomAmount,
    handlePaymentSuccess,
    handleSaveSettings,
    handleDeleteContribution
  } = useGiftFundManager();
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PiggyBank className="mr-2" /> Cagnotte des mariés
        </CardTitle>
        <CardDescription>
          Gérez votre cagnotte en ligne et consultez les contributions de vos invités
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="contributions">Contributions ({contributions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <GiftFundOverview
              totalContributions={totalContributions}
              giftFundLink={giftFundLink}
              linkCopied={linkCopied}
              handleCopyLink={handleCopyLink}
              showPaymentForm={showPaymentForm}
              setShowPaymentForm={setShowPaymentForm}
              amount={amount}
              customAmount={customAmount}
              handleAmountSelection={handleAmountSelection}
              handleCustomAmount={handleCustomAmount}
              handlePaymentSuccess={handlePaymentSuccess}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <GiftFundSettings
              isEnabled={isEnabled}
              setIsEnabled={setIsEnabled}
              fundTitle={fundTitle}
              setFundTitle={setFundTitle}
              fundDescription={fundDescription}
              setFundDescription={setFundDescription}
              handleSaveSettings={handleSaveSettings}
            />
          </TabsContent>
          
          <TabsContent value="contributions">
            <GiftFundContributions 
              contributions={contributions}
              handleDeleteContribution={handleDeleteContribution}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GiftFundManager;
