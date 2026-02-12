
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import GoldButton from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: any;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const { toast } = useToast();

  const handleConfirmAppointment = () => {
    if (!appointmentDate) {
      toast({
        variant: "destructive",
        title: "Date non sélectionnée",
        description: "Veuillez sélectionner une date pour le rendez-vous.",
      });
      return;
    }

    toast({
      title: "Rendez-vous programmé!",
      description: `Votre rendez-vous avec ${partner?.name} a été programmé pour le ${new Date(appointmentDate).toLocaleDateString('fr-FR')}.`,
    });
    setAppointmentDate("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 sm:max-w-md max-w-[calc(100%-32px)]">
        <DialogHeader>
          <DialogTitle className="text-base">Rendez-vous avec {partner?.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Programmez un rendez-vous pour discuter de votre projet et de vos besoins.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <label htmlFor="appointment-date" className="text-sm font-medium">
              Date et heure du rendez-vous
            </label>
            <Input
              id="appointment-date"
              type="datetime-local"
              className="bg-white border-gray-200"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            Le prestataire recevra votre demande de rendez-vous et vous confirmera sa disponibilité.
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <GoldButton variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Annuler
          </GoldButton>
          <GoldButton size="sm" onClick={handleConfirmAppointment} className="w-full sm:w-auto">
            Programmer
          </GoldButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
