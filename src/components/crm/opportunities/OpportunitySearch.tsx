
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface OpportunitySearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewOpportunity: () => void;
}

const OpportunitySearch = ({ searchQuery, onSearchChange, onNewOpportunity }: OpportunitySearchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une opportunité..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
        <Button size="sm" onClick={onNewOpportunity}>
          <Search className="h-4 w-4 mr-2" />
          Nouvelle opportunité
        </Button>
      </div>
    </div>
  );
};

export default OpportunitySearch;
