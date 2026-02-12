
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserType, PermissionLevel, NewSharingParams } from "@/models/sharedTask";

const sharingSchema = z.object({
  userName: z.string().min(1, "Le nom est requis"),
  userEmail: z.string().email("Email invalide"),
  userType: z.enum(['client', 'partner', 'witness', 'family', 'friend', 'vendor'] as const),
  permission: z.enum(['view', 'edit', 'manage'] as const),
});

type SharingFormValues = z.infer<typeof sharingSchema>;

interface SharingFormProps {
  taskTitle: string;
  onSubmit: (data: NewSharingParams) => void;
  onCancel: () => void;
  userId: string;
}

const SharingForm: React.FC<SharingFormProps> = ({
  taskTitle,
  onSubmit,
  onCancel,
  userId
}) => {
  const form = useForm<SharingFormValues>({
    resolver: zodResolver(sharingSchema),
    defaultValues: {
      userName: '',
      userEmail: '',
      userType: 'witness',
      permission: 'view',
    },
  });

  const handleSubmit = (values: SharingFormValues) => {
    const sharingData: NewSharingParams = {
      userId: `user-${Date.now()}`, // Dans une vraie application, ce serait l'ID de l'utilisateur réel
      userName: values.userName,     // Ensure userName is explicitly passed
      userEmail: values.userEmail,   // Ensure userEmail is explicitly passed
      userType: values.userType,     // Ensure userType is explicitly passed
      permission: values.permission  // Ensure permission is explicitly passed
    };
    
    onSubmit(sharingData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-lg font-semibold mb-4">
          Partager la tâche "{taskTitle}"
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de la personne" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email de la personne" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="witness">Témoin</SelectItem>
                    <SelectItem value="family">Famille</SelectItem>
                    <SelectItem value="friend">Ami(e)</SelectItem>
                    <SelectItem value="vendor">Prestataire</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="partner">Partenaire</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permissions</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des permissions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="view">Lecture seule</SelectItem>
                    <SelectItem value="edit">Modification</SelectItem>
                    <SelectItem value="manage">Gestion complète</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Définit ce que cette personne pourra faire avec la tâche
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SharingForm;
