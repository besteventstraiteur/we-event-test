
import React from "react";
import { WeddingPackage } from "@/models/weddingPackage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Star, ChevronRight, Calendar, Clock, Camera, Music, Utensils, Paintbrush, Video, Car, MapPin } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import PackageDetail from "./PackageDetail";
import { useCart } from "@/contexts/CartContext";

interface PackagesListProps {
  packages: WeddingPackage[];
}

const PackagesList: React.FC<PackagesListProps> = ({ packages }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<WeddingPackage | null>(null);
  const { addPackageToCart } = useCart();

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'photography':
        return <Camera size={16} />;
      case 'videography':
        return <Video size={16} />;
      case 'dj':
        return <Music size={16} />;
      case 'catering':
        return <Utensils size={16} />;
      case 'decoration':
        return <Paintbrush size={16} />;
      case 'venue':
        return <MapPin size={16} />;
      case 'car':
        return <Car size={16} />;
      default:
        return <ChevronRight size={16} />;
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-vip-gray-400 text-lg">Aucun pack ne correspond à vos critères</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:border-vip-gold transition-colors bg-white border-vip-gray-200">
              <div className="relative">
                <img 
                  src={pkg.imageUrl} 
                  alt={pkg.name}
                  className="w-full h-48 object-cover"
                />
                {pkg.featured && (
                  <Badge className="absolute top-2 right-2 bg-vip-gold text-vip-black">
                    Recommandé
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{pkg.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-vip-gold text-vip-gold" />
                    <span>{pkg.rating.toFixed(1)}</span>
                    <span className="text-sm text-vip-gray-400">({pkg.reviewCount})</span>
                  </div>
                </CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.services.slice(0, 4).map((service) => (
                      <div key={service.id} className="flex items-center gap-2 text-sm">
                        {getServiceIcon(service.type)}
                        <span>{service.vendorName}</span>
                      </div>
                    ))}
                    {pkg.services.length > 4 && (
                      <div className="flex items-center gap-2 text-sm text-vip-gray-400">
                        <ChevronRight size={16} />
                        <span>+{pkg.services.length - 4} autres</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold text-vip-gold">
                        {formatPrice(pkg.totalPrice)}
                      </div>
                      {pkg.discount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-vip-gray-400">
                            {formatPrice(pkg.originalPrice)}
                          </span>
                          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                            -{pkg.discount}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  className="border-vip-gray-300"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  Détails
                </Button>
                <GoldButton onClick={() => addPackageToCart(pkg)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ajouter
                </GoldButton>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        {selectedPackage && (
          <DialogContent className="max-w-4xl bg-white border-vip-gray-200">
            <DialogHeader>
              <DialogTitle>Détails du pack - {selectedPackage.name}</DialogTitle>
            </DialogHeader>
            <PackageDetail package={selectedPackage} />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default PackagesList;
