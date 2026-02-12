
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GoldButton from '@/components/GoldButton';

interface Venue {
  id: string;
  name: string;
  partner: string;
  location: string;
  capacity: number;
  description: string;
  floorPlan?: string;
}

interface VenueFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVenue: Venue | null;
  onSave: (data: Venue) => void;
}

const VenueFormDialog: React.FC<VenueFormDialogProps> = ({
  open,
  onOpenChange,
  selectedVenue,
  onSave
}) => {
  const form = useForm<Venue>({
    defaultValues: {
      id: '',
      name: '',
      partner: '',
      location: '',
      capacity: 0,
      description: '',
      floorPlan: undefined
    }
  });

  React.useEffect(() => {
    if (selectedVenue) {
      form.reset(selectedVenue);
    } else {
      form.reset({
        id: Date.now().toString(),
        name: '',
        partner: '',
        location: '',
        capacity: 0,
        description: '',
        floorPlan: undefined
      });
    }
  }, [selectedVenue, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vip-gray-900 border-vip-gray-800 text-vip-white">
        <DialogHeader>
          <DialogTitle>{selectedVenue ? 'Modifier une salle' : 'Ajouter une salle'}</DialogTitle>
          <DialogDescription className="text-vip-gray-400">
            {selectedVenue 
              ? 'Modifiez les informations de la salle de réception' 
              : 'Ajoutez une nouvelle salle de réception partenaire'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la salle</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-vip-gray-800 border-vip-gray-700 text-vip-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="partner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partenaire</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-vip-gray-800 border-vip-gray-700 text-vip-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-vip-gray-800 border-vip-gray-700 text-vip-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité (personnes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        className="bg-vip-gray-800 border-vip-gray-700 text-vip-white" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="bg-vip-gray-800 border-vip-gray-700 text-vip-white min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                className="border-vip-gray-700 text-vip-gray-400 hover:text-vip-white"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <GoldButton type="submit">
                {selectedVenue ? 'Mettre à jour' : 'Ajouter'}
              </GoldButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VenueFormDialog;
