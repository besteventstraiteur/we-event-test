
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import DocumentationPDF from './DocumentationPDF';

interface GenerateDocumentationButtonProps {
  className?: string;
}

const GenerateDocumentationButton: React.FC<GenerateDocumentationButtonProps> = ({ className = '' }) => {
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowPdfGenerator(true)}
        className={`flex items-center space-x-2 ${className}`}
      >
        <FileDown className="h-4 w-4" />
        <span>Télécharger la documentation</span>
      </Button>
      
      {showPdfGenerator && (
        <DocumentationPDF onClose={() => setShowPdfGenerator(false)} />
      )}
    </>
  );
};

export default GenerateDocumentationButton;
