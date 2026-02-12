import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Star, ShoppingCart } from "lucide-react";
import { WeddingPackage, ServiceType } from "@/models/weddingPackage";
import { Button } from "@/components/ui/button";
import GoldButton from "@/components/GoldButton";

interface PackageComparisonTableProps {
  packages: WeddingPackage[];
}

const PackageComparisonTable: React.FC<PackageComparisonTableProps> = ({ packages }) => {
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  };

  const allServiceTypes = Array.from(
    new Set(
      packages.flatMap(pkg => pkg.services.map(service => service.type))
    )
  ) as ServiceType[];

  const serviceTypeNames: Record<ServiceType, string> = {
    'photography': 'Photographe',
    'videography': 'Vidéaste',
    'dj': 'DJ / Musique',
    'catering': 'Traiteur',
    'decoration': 'Décoration',
    'venue': 'Lieu de réception',
    'car': 'Voiture'
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-vip-gray-400 text-lg">Aucun pack ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-vip-gray-200 overflow-x-auto bg-white">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-vip-gray-100">
              <TableHead className="w-[200px] sticky left-0 bg-vip-gray-100">Détails</TableHead>
              {packages.map(pkg => (
                <TableHead key={pkg.id} className="text-center">
                  <div className="font-bold truncate">{pkg.name}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="h-4 w-4 flex-shrink-0 fill-vip-gold text-vip-gold" />
                    <span className="truncate">{pkg.rating.toFixed(1)}</span>
                    <span className="text-xs text-vip-gray-400 truncate">({pkg.reviewCount})</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-white">Prix</TableCell>
              {packages.map(pkg => (
                <TableCell key={`${pkg.id}-price`} className="text-center">
                  <div className="text-xl font-bold text-vip-gold truncate">{formatPrice(pkg.totalPrice)}</div>
                  {pkg.discount > 0 && (
                    <div className="text-sm">
                      <span className="line-through text-vip-gray-400 truncate">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                      <span className="text-green-400 ml-2">
                        -{pkg.discount}%
                      </span>
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
            
            {allServiceTypes.map(serviceType => (
              <TableRow key={serviceType}>
                <TableCell className="font-medium sticky left-0 bg-white">{serviceTypeNames[serviceType]}</TableCell>
                {packages.map(pkg => {
                  const service = pkg.services.find(s => s.type === serviceType);
                  return (
                    <TableCell key={`${pkg.id}-${serviceType}`} className="text-center">
                      {service ? (
                        <div>
                          <div className="flex items-center justify-center text-green-400">
                            <CheckCircle className="h-5 w-5 mr-1 flex-shrink-0" />
                            <span className="truncate">Inclus</span>
                          </div>
                          <div className="text-sm truncate">{service.vendorName}</div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-vip-gray-400">
                          <XCircle className="h-5 w-5 mr-1 flex-shrink-0" />
                          <span className="truncate">Non inclus</span>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            
            <TableRow>
              <TableCell className="sticky left-0 bg-white"></TableCell>
              {packages.map(pkg => (
                <TableCell key={`${pkg.id}-action`} className="text-center">
                  <GoldButton className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Réserver
                  </GoldButton>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PackageComparisonTable;
