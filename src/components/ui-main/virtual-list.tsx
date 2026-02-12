
import React from 'react';
import { FixedSizeList, FixedSizeListProps } from 'react-window';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemSize: number;
  width?: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemSize,
  width = '100%',
  renderItem,
  className,
  emptyMessage = "Aucun élément à afficher",
}: VirtualListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-auto", className)}>
      <FixedSizeList
        itemCount={items.length}
        itemSize={itemSize}
        height={height}
        width={width}
      >
        {({ index, style }) => (
          <div style={style}>
            {renderItem(items[index], index)}
          </div>
        )}
      </FixedSizeList>
    </div>
  );
}
