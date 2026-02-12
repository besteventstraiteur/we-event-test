
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Video, Users, CreditCard } from "lucide-react";

interface LiveTraining {
  id: string;
  title: string;
  description: string;
  type: 'live' | 'physical';
  date: string;
  time: string;
  duration: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  instructor: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  registered: boolean;
}

interface TrainingRegistrationFormProps {
  training: LiveTraining;
  onClose: () => void;
  onSubmit: (trainingId: string) => void;
}

const TrainingRegistrationForm: React.FC<TrainingRegistrationFormProps> = ({ 
  training, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    motivation: '',
    experience: '',
    paymentMethod: 'card'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une inscription
    setTimeout(() => {
      onSubmit(training.id);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Inscription à la formation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Training Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{training.title}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={getLevelColor(training.level)}>
                    {training.level}
                  </Badge>
                  <Badge variant="outline">
                    {training.type === 'live' ? (
                      <><Video className="h-3 w-3 mr-1" /> En ligne</>
                    ) : (
                      <><MapPin className="h-3 w-3 mr-1" /> Présentiel</>
                    )}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{training.price}€</p>
                <p className="text-sm text-gray-600">TTC</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(training.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{training.time} ({training.duration})</span>
              </div>
              {training.location && (
                <div className="flex items-center space-x-2 col-span-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{training.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 col-span-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{training.maxParticipants - training.currentParticipants} places disponibles</span>
              </div>
            </div>

            <Separator />
            <p className="text-sm text-gray-600">{training.description}</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Niveau d'expérience dans le domaine</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Décrivez brièvement votre expérience..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation pour cette formation</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Qu'attendez-vous de cette formation ?"
                rows={3}
              />
            </div>

            <Separator />

            {/* Payment Section */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Paiement
              </h4>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total à payer</span>
                  <span className="text-xl font-bold text-blue-600">{training.price}€ TTC</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Le paiement sera traité de manière sécurisée
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? "Inscription..." : `S'inscrire - ${training.price}€`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingRegistrationForm;
