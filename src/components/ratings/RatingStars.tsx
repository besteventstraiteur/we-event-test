import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const iconSize = sizeClasses[size];

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartiallyFilled = 
            starValue > displayRating && 
            starValue - 1 < displayRating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            >
              <Star
                className={`${iconSize} ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : isPartiallyFilled
                    ? 'text-yellow-400 fill-yellow-200'
                    : 'text-gray-300 fill-gray-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

// Component for displaying rating with count
interface RatingDisplayProps {
  rating: number;
  count?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  count,
  maxRating = 5,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RatingStars rating={rating} maxRating={maxRating} size={size} />
      <span className="text-sm font-semibold text-gray-900">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-gray-500">
          ({count} avis)
        </span>
      )}
    </div>
  );
};

// Component for rating form
interface RatingFormProps {
  value: number;
  onChange: (rating: number) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  value,
  onChange,
  label = 'Votre note',
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <RatingStars
        rating={value}
        interactive={true}
        onChange={onChange}
        showValue={true}
        size="xl"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RatingStars;
