
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  categories, 
  onCategoryClick 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Catégories populaires</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.id} className="md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <div 
                  className="relative h-32 rounded-md overflow-hidden cursor-pointer"
                  onClick={() => onCategoryClick(category.name)}
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">{category.name}</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
