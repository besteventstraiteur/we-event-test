
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, FileText, ShoppingBag, BarChart3 } from "lucide-react";
import ContactsTab from "./ContactsTab";
import OpportunitiesTab from "./OpportunitiesTab";
import QuotesInvoicesTab from "./QuotesInvoicesTab";
import ProductsTab from "./ProductsTab";
import ReportsTab from "./ReportsTab";

interface CrmTabsSectionProps {
  urlPrefix: string;
}

const CrmTabsSection: React.FC<CrmTabsSectionProps> = ({ urlPrefix }) => {
  return (
    <Tabs defaultValue="contacts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="contacts" className="flex items-center gap-2">
          <Users className="h-4 w-4" /> Contacts
        </TabsTrigger>
        <TabsTrigger value="opportunities" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> Opportunités
        </TabsTrigger>
        <TabsTrigger value="quotes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Devis/Factures
        </TabsTrigger>
        <TabsTrigger value="products" className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" /> Produits
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Rapports
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="contacts" className="space-y-4">
        <ContactsTab urlPrefix={urlPrefix} />
      </TabsContent>
      
      <TabsContent value="opportunities" className="space-y-4">
        <OpportunitiesTab urlPrefix={urlPrefix} />
      </TabsContent>
      
      <TabsContent value="quotes" className="space-y-4">
        <QuotesInvoicesTab urlPrefix={urlPrefix} />
      </TabsContent>
      
      <TabsContent value="products" className="space-y-4">
        <ProductsTab urlPrefix={urlPrefix} />
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4">
        <ReportsTab urlPrefix={urlPrefix} />
      </TabsContent>
    </Tabs>
  );
};

export default CrmTabsSection;
