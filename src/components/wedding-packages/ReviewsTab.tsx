
import React from "react";

interface ReviewsTabProps {
  rating: number;
  reviewCount: number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ rating, reviewCount }) => {
  return (
    <div className="space-y-4">
      <p className="text-vip-gray-400">
        Ce pack a une note moyenne de {rating.toFixed(1)}/5 basée sur {reviewCount} avis.
      </p>
      <p>
        Les avis détaillés seront disponibles prochainement.
      </p>
    </div>
  );
};

export default ReviewsTab;
