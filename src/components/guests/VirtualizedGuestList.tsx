
import React from 'react';
import { VirtualList } from '../ui/virtual-list';
import { Guest } from '@/types/guestTypes';

interface VirtualizedGuestListProps {
  guests: Guest[];
  eventId?: string;
  searchQuery?: string;
  statusFilter?: string;
  className?: string;
  width?: number;
}

const VirtualizedGuestList: React.FC<VirtualizedGuestListProps> = ({ 
  guests,
  eventId,
  searchQuery,
  statusFilter,
  className,
  width = 800
}) => {
  const renderItem = (guest: Guest) => (
    <div key={guest.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50">
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
  );

  return (
    <VirtualList
      items={guests}
      itemSize={60}
      height={400}
      width={width}
      renderItem={renderItem}
      emptyMessage="No guests found"
    />
  );
};

export default VirtualizedGuestList;
