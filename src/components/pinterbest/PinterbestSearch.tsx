
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PinterbestSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PinterbestSearch: React.FC<PinterbestSearchProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Rechercher une inspiration..."
        className="pl-10 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0" 
          onClick={() => setSearchQuery("")}
        >
          ×
        </Button>
      )}
    </div>
  );
};

export default PinterbestSearch;
