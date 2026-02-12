
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Contribution } from '@/hooks/useGiftFundManager';

interface GiftFundContributionsProps {
  contributions: Contribution[];
  handleDeleteContribution: (id: string) => void;
}

const GiftFundContributions: React.FC<GiftFundContributionsProps> = ({
  contributions,
  handleDeleteContribution
}) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell>{contribution.date}</TableCell>
                <TableCell className="font-medium">{contribution.name}</TableCell>
                <TableCell>{(contribution.amount / 100).toFixed(2)} €</TableCell>
                <TableCell className="max-w-xs truncate">
                  {contribution.message}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Modifier</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteContribution(contribution.id)}
                    >
                      <span className="sr-only">Supprimer</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {contributions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune contribution n'a encore été reçue
        </div>
      )}
    </div>
  );
};

export default GiftFundContributions;
