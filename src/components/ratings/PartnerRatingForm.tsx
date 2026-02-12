
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface PartnerRatingFormProps {
  partnerId: string;
  partnerName: string;
  onSubmit: (rating: {
    score: number;
    comment: string;
    categories: {
      communication: number;
      quality: number;
      value: number;
      professionalism: number;
      reliability: number;
    };
  }) => Promise<void>;
}

const PartnerRatingForm: React.FC<PartnerRatingFormProps> = ({
  partnerId,
  partnerName,
  onSubmit
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState({
    communication: 0,
    quality: 0,
    value: 0,
    professionalism: 0,
    reliability: 0
  });

  const handleCategoryRating = (category: keyof typeof categories, score: number) => {
    setCategories(prev => ({
      ...prev,
      [category]: score
    }));
  };

  const handleSubmit = async () => {
    if (overallScore === 0) {
      toast({
        variant: "destructive",
        title: "Note requise",
        description: "Veuillez attribuer une note globale à ce prestataire."
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Commentaire requis",
        description: "Veuillez saisir un commentaire pour votre avis."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        score: overallScore,
        comment,
        categories
      });
      
      setOverallScore(0);
      setComment("");
      setCategories({
        communication: 0,
        quality: 0,
        value: 0,
        professionalism: 0,
        reliability: 0
      });
      
      toast({
        title: "Avis envoyé !",
        description: "Votre avis a été soumis et sera visible après modération."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre avis."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void;
    label: string;
  }) => {
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= value
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Évaluer {partnerName}</CardTitle>
        <CardDescription>
          Partagez votre expérience pour aider d'autres couples dans leurs choix
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <StarRating 
            value={overallScore} 
            onChange={setOverallScore} 
            label="Note globale"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <StarRating 
              value={categories.communication} 
              onChange={(value) => handleCategoryRating("communication", value)} 
              label="Communication"
            />
            <StarRating 
              value={categories.quality} 
              onChange={(value) => handleCategoryRating("quality", value)} 
              label="Qualité"
            />
            <StarRating 
              value={categories.value} 
              onChange={(value) => handleCategoryRating("value", value)} 
              label="Rapport qualité/prix"
            />
            <StarRating 
              value={categories.professionalism} 
              onChange={(value) => handleCategoryRating("professionalism", value)} 
              label="Professionnalisme"
            />
            <StarRating 
              value={categories.reliability} 
              onChange={(value) => handleCategoryRating("reliability", value)} 
              label="Fiabilité"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Votre avis
          </label>
          <Textarea
            id="comment"
            placeholder="Partagez votre expérience avec ce prestataire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-600"
        >
          {isSubmitting ? "Envoi en cours..." : "Soumettre mon avis"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerRatingForm;
