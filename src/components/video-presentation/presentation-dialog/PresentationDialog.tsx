
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PresentationDialogProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  title?: string;
  description?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

const PresentationDialog: React.FC<PresentationDialogProps> = ({
  open,
  setOpen,
  title = "Découvrez We Event",
  description = "Bienvenue sur notre plateforme d'organisation d'événements",
  onClose,
  children
}) => {
  const isMobile = useIsMobile();
  
  const handleOpenChange = (newOpen: boolean) => {
    if (setOpen) {
      setOpen(newOpen);
    }
    if (!newOpen && onClose) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px] p-0 overflow-hidden ${isMobile ? 'h-[90vh]' : 'max-h-[85vh]'}`}>
        <DialogHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl text-vip-gold">{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleOpenChange(false)} 
            className="h-8 w-8"
          >
            <X size={20} />
          </Button>
        </DialogHeader>
        
        {children || (
          <div className="p-6 text-center">
            <p>Contenu de présentation à venir</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PresentationDialog;
