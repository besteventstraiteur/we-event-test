
import React from "react";
import { WeddingPackage, PackageService } from "@/models/weddingPackage";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, calculateTotalPrice } from "./utils/packageUtils";

interface PackageSummaryProps {
  pkg: WeddingPackage;
  selectedServices: string[];
}

const PackageSummary: React.FC<PackageSummaryProps> = ({ pkg, selectedServices }) => {
  const { addPackageToCart } = useCart();
  const totalPrice = calculateTotalPrice(pkg, selectedServices);
  
  const servicesSubtotal = pkg.services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);

  const handleAddCustomPackage = () => {
    // Create a custom package with selected services
    const customPkg = {
      ...pkg,
      services: pkg.services.filter(service => selectedServices.includes(service.id)),
      totalPrice: totalPrice,
    };
    addPackageToCart(customPkg);
  };

  return (
    <div className="bg-vip-gray-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-bold text-lg">Récapitulatif de votre pack</h3>
      
      <div className="space-y-2">
        {selectedServices.length === 0 ? (
          <p className="text-vip-gray-400">Aucun service sélectionné</p>
        ) : (
          pkg.services
            .filter(service => selectedServices.includes(service.id))
            .map(service => (
              <div key={service.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  <span>{service.vendorName}</span>
                </div>
                <span>{formatPrice(service.price)}</span>
              </div>
            ))
        )}
      </div>
      
      <div className="border-t border-vip-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-vip-gray-400">
          <span>Sous-total</span>
          <span>{formatPrice(servicesSubtotal)}</span>
        </div>
        
        {totalPrice < servicesSubtotal && (
          <div className="flex justify-between text-sm text-green-400">
            <span>Réduction pack</span>
            <span>-{pkg.discount}%</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>Total</span>
          <span className="text-vip-gold">{formatPrice(totalPrice)}</span>
        </div>
      </div>
      
      <GoldButton className="w-full" onClick={handleAddCustomPackage}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Ajouter ce pack au panier
      </GoldButton>
      
      <p className="text-sm text-vip-gray-400 text-center">
        Paiement sécurisé et facilité pour l'ensemble des prestataires
      </p>
    </div>
  );
};

export default PackageSummary;
