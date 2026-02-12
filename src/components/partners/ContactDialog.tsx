
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import GoldButton from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: any;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message vide",
        description: "Veuillez saisir un message avant d'envoyer.",
      });
      return;
    }

    toast({
      title: "Message envoyé!",
      description: `Votre demande a été envoyée à ${partner?.name}. Ils vous contacteront prochainement.`,
    });
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 sm:max-w-md max-w-[calc(100%-32px)]">
        <DialogHeader>
          <DialogTitle className="text-base">Contacter {partner?.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Envoyez votre demande directement au prestataire. Il recevra vos coordonnées et votre message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="bg-amber-50 p-3 rounded-md">
            <div className="font-medium text-gray-900 text-sm">Avantage Club VIP</div>
            <div className="text-amber-600 font-bold">Réduction de {partner?.discount}</div>
          </div>
          
          <Textarea
            placeholder="Décrivez votre projet, vos besoins et questions..."
            className="bg-white border-gray-200 min-h-[100px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <GoldButton variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Annuler
          </GoldButton>
          <GoldButton size="sm" onClick={handleSendMessage} className="w-full sm:w-auto">
            Envoyer la demande
          </GoldButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
