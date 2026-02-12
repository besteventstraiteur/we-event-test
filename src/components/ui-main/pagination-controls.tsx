
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  // Ne pas afficher la pagination s'il n'y a qu'une seule page
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Toujours afficher la première page
    pages.push(
      <Button
        key="1"
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange(1)}
        className="w-9 h-9 p-0"
      >
        1
      </Button>
    );

    // Ajouter l'ellipse après la page 1 si nécessaire
    if (currentPage > 3) {
      pages.push(
        <Button key="start-ellipsis" variant="ghost" size="sm" disabled className="w-9 h-9 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    }

    // Pages intermédiaires
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajustement pour afficher au moins 3 pages intermédiaires si possible
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, 4);
    }
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Générer les pages intermédiaires
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className="w-9 h-9 p-0"
        >
          {i}
        </Button>
      );
    }

    // Ajouter l'ellipse avant la dernière page si nécessaire
    if (currentPage < totalPages - 2) {
      pages.push(
        <Button key="end-ellipsis" variant="ghost" size="sm" disabled className="w-9 h-9 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    }

    // Toujours afficher la dernière page, sauf si elle est identique à la première
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="w-9 h-9 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center space-x-2">
        {renderPageButtons()}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
