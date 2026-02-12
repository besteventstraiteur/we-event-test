
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { sendEmail } from '@/utils/edgeFunctions';
import { useToast } from "@/hooks/use-toast";

const EmailSender: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
    replyTo: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await sendEmail({
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
        replyTo: formData.replyTo || undefined
      });
      
      toast({
        title: "Email envoyé",
        description: "L'email a été envoyé avec succès.",
      });
      
      // Reset form
      setFormData({
        to: '',
        subject: '',
        body: '',
        replyTo: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Échec de l'envoi de l'email: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envoyer un email</CardTitle>
        <CardDescription>
          Exemple d'utilisation d'une Edge Function pour envoyer des emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="to">Destinataire</Label>
            <Input 
              id="to" 
              name="to"
              type="email" 
              placeholder="client@example.com" 
              value={formData.to}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="subject">Sujet</Label>
            <Input 
              id="subject" 
              name="subject"
              placeholder="Mise à jour de votre événement" 
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="body">Message</Label>
            <Textarea 
              id="body" 
              name="body"
              placeholder="Contenu de l'email..." 
              value={formData.body}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="replyTo">Répondre à (optionnel)</Label>
            <Input 
              id="replyTo" 
              name="replyTo"
              type="email" 
              placeholder="support@weevent.app" 
              value={formData.replyTo}
              onChange={handleChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Envoi en cours..." : "Envoyer l'email"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSender;
