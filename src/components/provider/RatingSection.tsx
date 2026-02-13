import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, Plus } from 'lucide-react';
import { RatingDisplay, RatingForm } from '../ratings/RatingStars';
import { PartnerRating } from '../../types/partnerRating';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RatingSectionProps {
  providerId: string;
  currentUserId?: string;
  userRole?: 'CLIENT' | 'PARTNER';
  className?: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({
  providerId,
  currentUserId,
  userRole,
  className = '',
}) => {
  const [ratings, setRatings] = useState<PartnerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    recommend: true,
  });

  // Mock data (replace with real API)
  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockRatings: PartnerRating[] = [
          {
            id: '1',
            ratedPartnerId: providerId,
            rating: 5,
            comment: 'Service exceptionnel ! L\'équipe était très professionnelle et a su répondre à toutes nos attentes. Je recommande vivement !',
            recommend: true,
            badges: ['EXCELLENT_SERVICE', 'RECOMMENDED'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            ratedPartnerId: providerId,
            rating: 4,
            comment: 'Très bon prestataire, quelques petits détails à améliorer mais dans l\'ensemble très satisfait.',
            recommend: true,
            badges: ['GOOD_VALUE'],
            createdAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-10T14:30:00Z',
          },
          {
            id: '3',
            ratedPartnerId: providerId,
            rating: 5,
            comment: 'Parfait de A à Z ! Merci pour cette belle prestation.',
            recommend: true,
            badges: ['EXCELLENT_SERVICE', 'PUNCTUAL'],
            createdAt: '2024-01-05T09:15:00Z',
            updatedAt: '2024-01-05T09:15:00Z',
          },
        ];

        setRatings(mockRatings);
        setLoading(false);
      }, 800);
    };

    fetchRatings();
  }, [providerId]);

  // Calculate stats
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
    percentage: ratings.length > 0
      ? (ratings.filter((r) => r.rating === star).length / ratings.length) * 100
      : 0,
  }));

  const recommendPercentage = ratings.length > 0
    ? (ratings.filter((r) => r.recommend).length / ratings.length) * 100
    : 0;

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Submit to API
    console.log('Submitting rating:', formData);
    
    // Reset form
    setFormData({ rating: 5, comment: '', recommend: true });
    setShowForm(false);
    
    // Refresh ratings
    // fetchRatings();
  };

  const getBadgeLabel = (badge: string) => {
    const badges: Record<string, string> = {
      EXCELLENT_SERVICE: 'Service excellent',
      GOOD_VALUE: 'Bon rapport qualité/prix',
      PUNCTUAL: 'Ponctuel',
      PROFESSIONAL: 'Professionnel',
      RECOMMENDED: 'Recommandé',
    };
    return badges[badge] || badge;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Avis clients</h2>
          <p className="text-gray-600">
            {ratings.length} {ratings.length > 1 ? 'avis' : 'avis'}
          </p>
        </div>
        
        {currentUserId && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Laisser un avis
          </Button>
        )}
      </div>

      {/* Rating form */}
      {showForm && (
        <form onSubmit={handleSubmitRating} className="mb-8 bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Partagez votre expérience</h3>
          
          <div className="space-y-4">
            <RatingForm
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
              label="Votre note"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Partagez votre expérience avec ce prestataire..."
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recommend"
                checked={formData.recommend}
                onChange={(e) => setFormData({ ...formData, recommend: e.target.checked })}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="recommend" className="text-sm text-gray-700">
                Je recommande ce prestataire
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                Publier mon avis
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outlined"
              >
                Annuler
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Average rating */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <RatingDisplay rating={averageRating} count={ratings.length} className="text-white" />
          <p className="text-purple-100 text-sm mt-2">Note moyenne</p>
        </div>

        {/* Recommendation rate */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="text-5xl font-bold mb-2">{recommendPercentage.toFixed(0)}%</div>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            <span>Recommandations</span>
          </div>
        </div>

        {/* Total reviews */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
          <div className="text-5xl font-bold mb-2">{ratings.length}</div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Avis clients</span>
          </div>
        </div>
      </div>

      {/* Rating distribution */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Répartition des notes</h3>
        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.star} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-24">
                <span className="text-sm font-medium text-gray-700">{dist.star}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        <h3 className="font-bold text-gray-900">Avis récents</h3>
        
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && ratings.map((rating) => (
          <div key={rating.id} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {rating.raterName?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {rating.raterName || 'Client anonyme'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(rating.createdAt), 'PPP', { locale: fr })}
                  </p>
                </div>
              </div>
              <RatingDisplay rating={rating.rating} />
            </div>

            <p className="text-gray-700 mb-3">{rating.comment}</p>

            {rating.badges && rating.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {rating.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold"
                  >
                    {getBadgeLabel(badge)}
                  </span>
                ))}
              </div>
            )}

            {rating.recommend && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-semibold">Recommande ce prestataire</span>
              </div>
            )}
          </div>
        ))}

        {!loading && ratings.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Aucun avis pour le moment
            </h3>
            <p className="text-gray-600">
              Soyez le premier à laisser un avis sur ce prestataire
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSection;
