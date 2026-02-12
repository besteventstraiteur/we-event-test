
import React from "react";
import CrmStatsCard from "./CrmStatsCard";
import { Users, Briefcase, FileText, ShoppingBag } from "lucide-react";

const CrmStatsSection: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CrmStatsCard
        title="Contacts"
        value="0"
        description="Aucun contact pour l'instant"
        icon={Users}
      />
      
      <CrmStatsCard
        title="Opportunités"
        value="0€"
        description="Aucune opportunité pour l'instant"
        icon={Briefcase}
      />
      
      <CrmStatsCard
        title="Devis/Factures"
        value="0€"
        description="Aucun document pour l'instant"
        icon={FileText}
      />
      
      <CrmStatsCard
        title="Produits/Services"
        value="0"
        description="Aucun produit pour l'instant"
        icon={ShoppingBag}
      />
    </div>
  );
};

export default CrmStatsSection;
