
import React from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle } from "lucide-react";

interface EmptyOpportunitiesProps {
  onNewOpportunity: () => void;
  searchQuery: string;
}

const EmptyOpportunities = ({ onNewOpportunity, searchQuery }: EmptyOpportunitiesProps) => {
  return (
    <div className="border rounded-md p-8 text-center">
      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Aucune opportunité trouvée</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery 
          ? "Aucune opportunité ne correspond à votre recherche" 
          : "Commencez par ajouter des opportunités à votre pipeline"}
      </p>
      <Button onClick={onNewOpportunity}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Créer une opportunité
      </Button>
    </div>
  );
};

export default EmptyOpportunities;
