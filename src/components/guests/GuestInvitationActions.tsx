
import React from 'react';
import { MailPlus, Download, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GuestInvitationActions: React.FC = () => {
  const { toast } = useToast();
  
  const handleSendInvitations = () => {
    toast({
      title: "Invitations envoyées",
      description: "Les invitations ont été envoyées avec succès à tous les invités sans réponse",
    });
  };
  
  const handleSendReminders = () => {
    toast({
      title: "Rappels envoyés",
      description: "Les rappels ont été envoyés avec succès à tous les invités sans réponse",
    });
  };
  
  const handleExportGuests = () => {
    toast({
      title: "Liste exportée",
      description: "La liste des invités a été exportée avec succès",
    });
  };
  
  const handleImportGuests = () => {
    // In a real app, we would open a file dialog
    toast({
      title: "Liste importée",
      description: "La liste des invités a été importée avec succès",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={handleSendInvitations}
            className="gap-2"
          >
            <MailPlus size={16} />
            Envoyer invitations
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSendReminders}
            className="gap-2"
          >
            <MailPlus size={16} />
            Envoyer rappels
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportGuests}
            className="gap-2"
          >
            <Download size={16} />
            Exporter liste
          </Button>
          <Button 
            variant="outline" 
            onClick={handleImportGuests}
            className="gap-2"
          >
            <Upload size={16} />
            Importer liste
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestInvitationActions;
