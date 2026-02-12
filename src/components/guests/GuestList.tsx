
import React from 'react';
import { VirtualList } from '@/components/ui/virtual-list';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import { Guest } from '@/types/floorPlanTypes';

interface GuestListProps {
  guests: Guest[];
  onSave?: (updatedGuests: Guest[]) => void;
  tables?: { id: string; name: string }[];
  menuOptions?: { id: string; name: string; menuName: string }[];
}

const ITEMS_PER_PAGE = 50;
const ITEM_HEIGHT = 60;
const LIST_HEIGHT = 400;

const GuestList: React.FC<GuestListProps> = ({ 
  guests, 
  onSave,
  tables = [],
  menuOptions = []
}) => {
  const {
    currentPage,
    totalPages,
    pageItems,
    goToPage,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: guests.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const currentGuests = guests.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <VirtualList
        items={currentGuests}
        height={LIST_HEIGHT}
        itemSize={ITEM_HEIGHT}
        renderItem={(guest: Guest) => (
          <div className="p-4 border-b last:border-b-0 hover:bg-muted/50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{guest.prenom} {guest.nom}</p>
                <p className="text-sm text-muted-foreground">{guest.email}</p>
              </div>
              {guest.telephone && (
                <p className="text-sm">{guest.telephone}</p>
              )}
            </div>
          </div>
        )}
      />
      
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default GuestList;
