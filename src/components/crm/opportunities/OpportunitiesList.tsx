
import React from 'react';
import { OpportunityTable } from './OpportunityTable';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from 'react-router-dom';

const OpportunitiesList: React.FC = () => {
  const { 
    opportunities, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm,
    sortColumn,
    sortOrder,
    setSortColumn,
    setSortOrder
  } = useOpportunities();

  if (loading) {
    return <div>Chargement des opportunités...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des opportunités: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Opportunités</h1>
        <Link to="/crm/opportunities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <OpportunityTable 
        opportunities={opportunities}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        setSortColumn={setSortColumn}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default OpportunitiesList;
