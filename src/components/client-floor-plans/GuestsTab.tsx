
import React, { useState } from 'react';
import GuestList from '@/components/guests/GuestList';
import type { Guest, Table } from '@/types/floorPlanTypes';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import ImportGuestsDialog from './guests/ImportGuestsDialog';
import GuestActionsToolbar from './guests/GuestActionsToolbar';
import { defaultMenuOptions } from './guests/menuOptions';

interface GuestsTabProps {
  guests: Guest[];
  onSave: (guests: Guest[]) => void;
  tables: Table[];
}

const GuestsTab: React.FC<GuestsTabProps> = ({ guests, onSave, tables }) => {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isNative] = useState(() => Capacitor.isNativePlatform());
  
  const { isOnline, currentGuests, handleSave } = useOfflineSync({
    guests,
    onSave
  });
  
  const importMobileContacts = () => {
    if (!isNative) {
      toast({
        title: "Non disponible",
        description: "Cette fonctionnalité n'est disponible que sur l'application mobile",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Accès aux contacts",
      description: "Importation des contacts en cours..."
    });
    
    setTimeout(() => {
      const mockContacts = [
        { id: `contact-${Date.now()}-1`, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@example.com', phone: '0612345678' },
        { id: `contact-${Date.now()}-2`, firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@example.com', phone: '0698765432' },
        { id: `contact-${Date.now()}-3`, firstName: 'Pierre', lastName: 'Bernard', email: 'pierre.bernard@example.com', phone: '0687654321' }
      ];
      
      const newGuests: Guest[] = mockContacts.map(contact => ({
        id: contact.id,
        nom: contact.lastName,
        prenom: contact.firstName,
        email: contact.email || '',
        telephone: contact.phone || '',
        ceremonie: true,
        vin: true,
        repas: true,
        brunch: false,
        conjoint: false,
        enfants: 0,
        table: '',
        notes: ''
      }));
      
      const updatedGuests = [...currentGuests, ...newGuests];
      handleSave(updatedGuests);
      
      toast({
        title: "Contacts importés",
        description: `${mockContacts.length} contacts ont été ajoutés à votre liste d'invités`
      });
      
      setImportDialogOpen(false);
    }, 1500);
  };
  
  const importCsvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const firstNameIdx = headers.findIndex(h => h.toLowerCase().includes('prénom') || h.toLowerCase().includes('firstname'));
        const lastNameIdx = headers.findIndex(h => h.toLowerCase().includes('nom') || h.toLowerCase().includes('lastname'));
        const emailIdx = headers.findIndex(h => h.toLowerCase().includes('email'));
        const phoneIdx = headers.findIndex(h => h.toLowerCase().includes('téléphone') || h.toLowerCase().includes('phone'));
        
        const newGuests: Guest[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          newGuests.push({
            id: `import-${Date.now()}-${i}`,
            prenom: firstNameIdx >= 0 ? values[firstNameIdx].trim() : '',
            nom: lastNameIdx >= 0 ? values[lastNameIdx].trim() : '',
            email: emailIdx >= 0 ? values[emailIdx].trim() : '',
            telephone: phoneIdx >= 0 ? values[phoneIdx].trim() : '',
            ceremonie: true,
            vin: true,
            repas: true,
            brunch: false,
            conjoint: false,
            enfants: 0,
            table: '',
            notes: ''
          });
        }
        
        const updatedGuests = [...currentGuests, ...newGuests];
        handleSave(updatedGuests);
        
        toast({
          title: "Fichier importé",
          description: `${newGuests.length} invités ont été ajoutés à votre liste`
        });
        
        setImportDialogOpen(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Erreur",
          description: "Le format du fichier n'est pas valide",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  
  const exportToCsv = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Cérémonie', 'Vin', 'Repas', 'Brunch', 'Table'];
    const rows = currentGuests.map(guest => [
      guest.prenom || '',
      guest.nom || '',
      guest.email || '',
      guest.telephone || '',
      guest.ceremonie ? 'Oui' : 'Non',
      guest.vin ? 'Oui' : 'Non',
      guest.repas ? 'Oui' : 'Non',
      guest.brunch ? 'Oui' : 'Non',
      guest.table || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invites_mariage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <GuestActionsToolbar
        onImportClick={() => setImportDialogOpen(true)}
        onExportClick={exportToCsv}
        isOnline={isOnline}
      />
      
      <ImportGuestsDialog
        isOpen={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImportContacts={importMobileContacts}
        onImportCsv={importCsvFile}
        isNative={isNative}
      />
      
      <GuestList 
        guests={currentGuests}
        onSave={handleSave}
        tables={tables.map(table => ({ id: table.id, name: table.name }))}
        menuOptions={defaultMenuOptions}
      />
    </div>
  );
};

export default GuestsTab;
