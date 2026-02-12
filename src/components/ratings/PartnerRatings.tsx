
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { Rating, RatingSummary } from "@/types/ratingTypes";
import { Button } from "@/components/ui/button";

interface PartnerRatingsProps {
  ratings: Rating[];
  summary: RatingSummary;
  onReportReview?: (reviewId: string) => void;
  onLikeReview?: (reviewId: string) => void;
  canReply?: boolean;
  onReplyToReview?: (reviewId: string, reply: string) => void;
}

const PartnerRatings: React.FC<PartnerRatingsProps> = ({
  ratings,
  summary,
  onReportReview,
  onLikeReview,
  canReply,
  onReplyToReview
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avis clients</CardTitle>
          <CardDescription>
            {summary.totalRatings} avis • Note moyenne {summary.averageScore.toFixed(1)}/5
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl font-bold">{summary.averageScore.toFixed(1)}</div>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(summary.averageScore)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-center text-gray-500">
                Basé sur {summary.totalRatings} avis clients
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <div className="w-8 text-sm text-gray-500">{star} ★</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-amber-500 rounded-full"
                      style={{
                        width: `${summary.totalRatings > 0 
                          ? (summary.distribution[star as keyof typeof summary.distribution] / summary.totalRatings) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                  <div className="w-8 text-xs text-right text-gray-500">
                    {summary.distribution[star as keyof typeof summary.distribution] || 0}
                  </div>
                </div>
              ))}
            </div>
            
            {summary.categoryAverages && (
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Détails par catégorie</div>
                {Object.entries(summary.categoryAverages).map(([category, score]) => (
                  <div key={category} className="flex items-center gap-2 mb-2">
                    <div className="w-32 text-sm capitalize">
                      {category === 'communication' ? 'Communication' :
                       category === 'quality' ? 'Qualité' :
                       category === 'value' ? 'Rapport qualité/prix' :
                       category === 'professionalism' ? 'Professionnalisme' :
                       'Fiabilité'}
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(score)
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {ratings.length > 0 ? (
          ratings
            .filter(rating => rating.status === 'approved')
            .map((rating) => (
              <Card key={rating.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="flex mr-2">
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
                        <span className="font-medium">Client VIP</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Posté le {formatDate(rating.date)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {onLikeReview && (
                        <Button variant="ghost" size="sm" onClick={() => onLikeReview(rating.id)}>
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">Utile</span>
                        </Button>
                      )}
                      {onReportReview && (
                        <Button variant="ghost" size="sm" onClick={() => onReportReview(rating.id)}>
                          <Flag className="h-4 w-4 mr-1" />
                          <span className="text-xs">Signaler</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="mb-4">{rating.comment}</p>
                  
                  {rating.categories && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(rating.categories).map(([category, score]) => (
                        <Badge key={category} variant="outline" className="bg-gray-100">
                          {category === 'communication' ? 'Communication' :
                           category === 'quality' ? 'Qualité' :
                           category === 'value' ? 'Rapport qualité/prix' :
                           category === 'professionalism' ? 'Professionnalisme' :
                           'Fiabilité'}: {score}/5
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rating.response && (
                    <div className="bg-gray-50 p-4 rounded-md mt-4">
                      <div className="font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Réponse du prestataire
                      </div>
                      <p className="text-sm">{rating.response}</p>
                    </div>
                  )}
                  
                  {canReply && !rating.response && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => onReplyToReview && onReplyToReview(rating.id, '')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Répondre à cet avis
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Aucun avis pour le moment</p>
            <p className="text-sm mt-1">Soyez le premier à partager votre expérience</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerRatings;
