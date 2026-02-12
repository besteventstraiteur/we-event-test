
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ReminderType, 
  ReminderFrequency, 
  TaskReminder, 
  NewReminderParams 
} from '@/models/taskReminder';

interface TaskReminderManagerProps {
  taskId: string;
  existingReminders?: TaskReminder[];
  onReminderCreated?: (reminder: TaskReminder) => void;
  onReminderDeleted?: (reminderId: string) => void;
}

const TaskReminderManager: React.FC<TaskReminderManagerProps> = ({
  taskId,
  existingReminders = [],
  onReminderCreated,
  onReminderDeleted
}) => {
  const [reminders, setReminders] = useState<TaskReminder[]>(existingReminders);
  const [type, setType] = useState<ReminderType>('push');
  const [message, setMessage] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('once');
  const [recipients, setRecipients] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddReminder = async () => {
    if (!date || !time) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez spécifier la date et l'heure du rappel",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Combine date and time into ISO string
      const reminderDateTime = new Date(`${date}T${time}`);
      
      if (isNaN(reminderDateTime.getTime())) {
        throw new Error("Date ou heure invalide");
      }

      // Create the reminder object
      const newReminderParams: NewReminderParams = {
        type,
        message: message || "Rappel de tâche",
        date: reminderDateTime.toISOString(), // Ensure we're using string format
        frequency,
        recipients: recipients ? recipients.split(',').map(r => r.trim()) : undefined
      };

      // In a real app, you would call an API here
      // For now, we'll simulate creating a reminder
      const newReminder: TaskReminder = {
        id: uuidv4(),
        taskId,
        type: newReminderParams.type,
        message: newReminderParams.message,
        date: newReminderParams.date, // This is now guaranteed to be a string
        frequency: newReminderParams.frequency,
        enabled: true,
        sent: false,
        recipients: newReminderParams.recipients
      };

      setReminders(prev => [...prev, newReminder]);
      
      // Call the callback if provided
      if (onReminderCreated) {
        onReminderCreated(newReminder);
      }

      // Reset form
      setMessage('');
      setDate('');
      setTime('');
      setRecipients('');
      
      toast({
        title: "Rappel créé",
        description: "Le rappel a été programmé avec succès",
      });
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rappel. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    
    if (onReminderDeleted) {
      onReminderDeleted(reminderId);
    }
    
    toast({
      title: "Rappel supprimé",
      description: "Le rappel a été supprimé avec succès",
    });
  };

  const toggleReminderEnabled = (reminderId: string) => {
    setReminders(prev => prev.map(r => 
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    ));
    
    // In a real app, you would update this via API
  };

  // Format the reminder date and time for display
  const formatReminderDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatReminderTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Programmation des rappels Jour J
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reminder-type">Type de notification</Label>
              <Select 
                value={type} 
                onValueChange={(value: ReminderType) => setType(value)}
              >
                <SelectTrigger id="reminder-type">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push">Notification Push</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reminder-frequency">Fréquence</Label>
              <Select 
                value={frequency} 
                onValueChange={(value: ReminderFrequency) => setFrequency(value)}
              >
                <SelectTrigger id="reminder-frequency">
                  <SelectValue placeholder="Choisir la fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Une seule fois</SelectItem>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reminder-date">Date</Label>
              <Input
                id="reminder-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reminder-time">Heure</Label>
              <Input
                id="reminder-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reminder-message">Message</Label>
            <Textarea
              id="reminder-message"
              placeholder="Message qui sera envoyé avec la notification"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {(type === 'email' || type === 'sms') && (
            <div>
              <Label htmlFor="reminder-recipients">
                Destinataires {type === 'email' ? '(emails)' : '(numéros de téléphone)'}
              </Label>
              <Input
                id="reminder-recipients"
                placeholder={type === 'email' ? "email1@example.com, email2@example.com" : "+33612345678, +33687654321"}
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez plusieurs destinataires par des virgules
              </p>
            </div>
          )}

          <Button 
            onClick={handleAddReminder} 
            disabled={isLoading}
            className="w-full bg-vip-gold hover:bg-vip-gold/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                Programmer le rappel
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {reminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rappels programmés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={reminder.enabled} 
                      onCheckedChange={() => toggleReminderEnabled(reminder.id)} 
                    />
                    <div>
                      <p className="font-medium">
                        {reminder.type === 'push' ? 'Notification Push' : 
                         reminder.type === 'email' ? 'Email' : 'SMS'}
                      </p>
                      <div className="text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatReminderDate(reminder.date)}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {formatReminderTime(reminder.date)}
                        </span>
                        {reminder.recipients && (
                          <span className="flex items-center mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            {reminder.recipients.length} destinataire(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskReminderManager;
