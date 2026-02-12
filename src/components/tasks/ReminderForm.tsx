
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Calendar as CalendarIcon, Bell, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReminderType, ReminderFrequency, NewReminderParams } from "@/models/taskReminder";

const reminderSchema = z.object({
  type: z.enum(['push', 'email', 'sms'] as const),
  message: z.string().optional(),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"),
  frequency: z.enum(['once', 'daily', 'weekly', 'custom'] as const),
  recipients: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  taskTitle: string;
  onSubmit: (data: NewReminderParams) => void;
  onCancel: () => void;
  initialData?: Partial<ReminderFormValues>;
}

const ReminderForm: React.FC<ReminderFormProps> = ({
  taskTitle,
  onSubmit,
  onCancel,
  initialData
}) => {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      type: initialData?.type || 'push',
      message: initialData?.message || '',
      date: initialData?.date || new Date(),
      time: initialData?.time || format(new Date(), 'HH:mm'),
      frequency: initialData?.frequency || 'once',
      recipients: initialData?.recipients || '',
    },
  });

  useEffect(() => {
    const date = form.getValues('date');
    const timeStr = form.getValues('time');
    
    if (date && timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes);
      setDateTime(newDateTime);
    }
  }, [form.watch('date'), form.watch('time')]);

  const handleSubmit = (values: ReminderFormValues) => {
    // Construire la date complète avec l'heure
    const [hours, minutes] = values.time.split(':').map(Number);
    const reminderDate = new Date(values.date);
    reminderDate.setHours(hours, minutes);
    
    // Préparer les données pour le rappel
    const reminderData: NewReminderParams = {
      type: values.type,
      message: values.message,
      date: reminderDate.toISOString(), // Convert Date to string here
      frequency: values.frequency,
      recipients: values.recipients ? values.recipients.split(',').map(r => r.trim()) : undefined,
    };
    
    onSubmit(reminderData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-lg font-semibold mb-4">
          Ajouter un rappel pour "{taskTitle}"
        </div>
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type de notification</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="push" id="push" />
                    <label htmlFor="push" className="flex items-center cursor-pointer">
                      <Bell className="h-4 w-4 mr-2" />
                      <span>Notification push</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <label htmlFor="email" className="flex items-center cursor-pointer">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Email</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms" />
                    <label htmlFor="sms" className="flex items-center cursor-pointer">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>SMS</span>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fréquence</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="once">Une seule fois</SelectItem>
                  <SelectItem value="daily">Tous les jours</SelectItem>
                  <SelectItem value="weekly">Chaque semaine</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message personnalisé (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Message pour le rappel..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('type') !== 'push' && (
          <FormField
            control={form.control}
            name="recipients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Destinataires ({form.watch('type') === 'email' ? 'emails' : 'téléphones'})
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.watch('type') === 'email' 
                      ? "Entrez les emails séparés par des virgules" 
                      : "Entrez les numéros séparés par des virgules"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter le rappel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReminderForm;
