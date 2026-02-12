
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { Rating } from "@/types/ratingTypes";

interface RatingModerationProps {
  ratings: Rating[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onViewPartnerDetails: (partnerId: string) => void;
}

const RatingModeration: React.FC<RatingModerationProps> = ({
  ratings,
  onApprove,
  onReject,
  onViewPartnerDetails
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleApprove = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onApprove(id);
      toast({
        title: "Avis approuvé",
        description: "L'avis a été publié avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'approbation de l'avis."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = (rating: Rating) => {
    setSelectedRating(rating);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRating) return;
    
    if (!rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Motif requis",
        description: "Veuillez indiquer le motif du rejet."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onReject(selectedRating.id, rejectReason);
      setRejectDialogOpen(false);
      toast({
        title: "Avis rejeté",
        description: "L'avis a été rejeté avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors du rejet de l'avis."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const pendingRatings = ratings.filter(r => r.status === 'pending');
  const approvedRatings = ratings.filter(r => r.status === 'approved');
  const rejectedRatings = ratings.filter(r => r.status === 'rejected');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            En attente ({pendingRatings.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approuvés ({approvedRatings.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejetés ({rejectedRatings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingRatings.length > 0 ? (
            <div className="space-y-4">
              {pendingRatings.map((rating) => (
                <Card key={rating.id} className="overflow-hidden border-amber-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            Avis pour: <Button variant="link" className="p-0 h-auto font-medium" onClick={() => onViewPartnerDetails(rating.partnerId)}>
                              Prestataire #{rating.partnerId}
                            </Button>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            En attente
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.score
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm ml-2">
                            Posté le {formatDate(rating.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 hover:border-red-400 hover:bg-red-50 text-red-600"
                          onClick={() => handleRejectClick(rating)}
                          disabled={isSubmitting}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(rating.id)}
                          disabled={isSubmitting}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md mb-4">
                      <p className="mb-2">{rating.comment}</p>
                      
                      {rating.categories && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(rating.categories).map(([category, score]) => (
                            <Badge key={category} variant="outline" className="bg-white">
                              {category === 'communication' ? 'Communication' :
                               category === 'quality' ? 'Qualité' :
                               category === 'value' ? 'Rapport qualité/prix' :
                               category === 'professionalism' ? 'Professionnalisme' :
                               'Fiabilité'}: {score}/5
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPartnerDetails(rating.partnerId)}
                      >
                        Voir le profil du prestataire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Aucun avis en attente</p>
              <p className="text-sm mt-1">Tous les avis ont été traités</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          {approvedRatings.length > 0 ? (
            <div className="space-y-4">
              {approvedRatings.map((rating) => (
                <Card key={rating.id} className="overflow-hidden border-green-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            Avis pour: <Button variant="link" className="p-0 h-auto font-medium" onClick={() => onViewPartnerDetails(rating.partnerId)}>
                              Prestataire #{rating.partnerId}
                            </Button>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Approuvé
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.score
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm ml-2">
                            Posté le {formatDate(rating.date)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectClick(rating)}
                        >
                          Annuler l'approbation
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="mb-2">{rating.comment}</p>
                      
                      {rating.categories && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(rating.categories).map(([category, score]) => (
                            <Badge key={category} variant="outline" className="bg-white">
                              {category === 'communication' ? 'Communication' :
                               category === 'quality' ? 'Qualité' :
                               category === 'value' ? 'Rapport qualité/prix' :
                               category === 'professionalism' ? 'Professionnalisme' :
                               'Fiabilité'}: {score}/5
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {rating.response && (
                      <div className="bg-blue-50 p-4 rounded-md mt-4">
                        <div className="font-medium mb-2 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Réponse du prestataire
                        </div>
                        <p className="text-sm">{rating.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Aucun avis approuvé</p>
              <p className="text-sm mt-1">Les avis approuvés apparaîtront ici</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected">
          {rejectedRatings.length > 0 ? (
            <div className="space-y-4">
              {rejectedRatings.map((rating) => (
                <Card key={rating.id} className="overflow-hidden border-red-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            Avis pour: <Button variant="link" className="p-0 h-auto font-medium" onClick={() => onViewPartnerDetails(rating.partnerId)}>
                              Prestataire #{rating.partnerId}
                            </Button>
                          </div>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Rejeté
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.score
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm ml-2">
                            Posté le {formatDate(rating.date)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 border-green-300 hover:border-green-400 text-green-600"
                        onClick={() => handleApprove(rating.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="mb-2">{rating.comment}</p>
                      
                      {rating.categories && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(rating.categories).map(([category, score]) => (
                            <Badge key={category} variant="outline" className="bg-white">
                              {category === 'communication' ? 'Communication' :
                               category === 'quality' ? 'Qualité' :
                               category === 'value' ? 'Rapport qualité/prix' :
                               category === 'professionalism' ? 'Professionnalisme' :
                               'Fiabilité'}: {score}/5
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Aucun avis rejeté</p>
              <p className="text-sm mt-1">Les avis rejetés apparaîtront ici</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'avis</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du rejet. Cette information sera utilisée
              en interne uniquement et ne sera pas partagée avec le client.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Motif du rejet (langage inapproprié, contenu non pertinent, etc.)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRejectConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement..." : "Confirmer le rejet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RatingModeration;
