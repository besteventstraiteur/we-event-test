
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface VenueSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VenueSearch: React.FC<VenueSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative flex w-full max-w-sm mb-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-vip-gray-400" />
      <Input
        type="search"
        placeholder="Rechercher une salle..."
        className="pl-9 bg-vip-gray-800 border-vip-gray-700 text-vip-white"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default VenueSearch;
