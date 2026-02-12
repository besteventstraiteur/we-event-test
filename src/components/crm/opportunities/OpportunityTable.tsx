
import React, { useState, useMemo } from 'react';
import OpportunityStatusBadge from './OpportunityStatusBadge';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

// Type pour les données d'opportunité
interface Opportunity {
  id: string;
  name: string;
  client_name: string;
  value: number;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  created_at: string;
  expected_close_date?: string;
  source?: string;
}

// Fonction pour formater les dates
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Fonction pour formater la valeur monétaire
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(value);
};

// Props pour le tableau d'opportunités
interface OpportunityTableProps {
  opportunities?: Opportunity[];
  searchQuery?: string;
  statusFilter?: string;
  className?: string;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  setSortColumn?: (column: string) => void;
  setSortOrder?: (order: 'asc' | 'desc') => void;
  partnerId?: string;
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities: providedOpportunities,
  partnerId,
  searchQuery = "",
  statusFilter,
  className,
  sortColumn,
  sortOrder,
  setSortColumn,
  setSortOrder
}) => {
  // Configuration de la pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Simuler une requête avec React Query si des opportunités ne sont pas fournies
  // Dans une véritable application, remplacez ceci par un appel à Supabase ou une autre API
  const fetchOpportunities = async () => {
    // Simulons un délai pour montrer le chargement
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Ici, nous simulons les données, mais en production, vous feriez:
    // return await supabase
    //   .from('opportunities')
    //   .select('*')
    //   .eq('partner_id', partnerId)
    //   .order('created_at', { ascending: false });
    
    // Données fictives pour l'exemple
    return Array(78).fill(0).map((_, i) => ({
      id: `opp-${i + 1}`,
      name: `Opportunité ${i + 1}`,
      client_name: `Client ${i % 20 + 1}`,
      value: Math.floor(Math.random() * 50000) + 1000,
      status: ['new', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'][Math.floor(Math.random() * 6)] as any,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      expected_close_date: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      source: ['Site Web', 'Recommandation', 'Salon', 'Contact direct'][Math.floor(Math.random() * 4)]
    }));
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ['opportunities', partnerId, searchQuery, statusFilter],
    queryFn: fetchOpportunities,
    enabled: !providedOpportunities
  });

  // Use provided opportunities or fetched data
  const allOpportunities = providedOpportunities || data;

  // Filtrer les données selon la recherche et le statut
  const filteredData = useMemo(() => {
    return allOpportunities.filter(opp => {
      const matchesSearch = !searchQuery || 
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        opp.client_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || opp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allOpportunities, searchQuery, statusFilter]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="w-full h-12 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunité</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="hidden md:table-cell">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Aucune opportunité ne correspond à vos critères
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">{opp.name}</TableCell>
                  <TableCell>{opp.client_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(opp.created_at)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(opp.value)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <OpportunityStatusBadge stage={opp.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="mt-2 text-sm text-center text-muted-foreground">
        Affichage des éléments {Math.min((page - 1) * itemsPerPage + 1, filteredData.length)} à {Math.min(page * itemsPerPage, filteredData.length)} sur {filteredData.length}
      </div>
    </div>
  );
};
