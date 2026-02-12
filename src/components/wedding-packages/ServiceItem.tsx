
import React from "react";
import { PackageService } from "@/models/weddingPackage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getServiceIcon, formatPrice } from "./utils/packageUtils";

interface ServiceItemProps {
  service: PackageService;
  isSelected: boolean;
  onToggle: (serviceId: string, checked: boolean) => void;
  packageId: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ 
  service, 
  isSelected, 
  onToggle,
  packageId
}) => {
  const { addServiceToCart } = useCart();

  return (
    <div 
      className={`p-4 rounded-lg border flex items-start gap-4 ${
        isSelected
          ? 'border-vip-gold bg-vip-black/20'
          : 'border-vip-gray-800 bg-vip-gray-900'
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {getServiceIcon(service.type)}
      </div>
      <div className="flex-grow space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{service.vendorName}</h4>
            <p className="text-sm text-vip-gray-400">{service.description}</p>
          </div>
          <div className="text-vip-gold font-bold">
            {formatPrice(service.price)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {service.canBeRemoved && (
            <div className="flex items-center">
              <Checkbox 
                id={`service-${service.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => 
                  onToggle(service.id, checked as boolean)
                }
                disabled={service.included && !service.canBeRemoved}
              />
              <Label 
                htmlFor={`service-${service.id}`}
                className="ml-2 cursor-pointer"
              >
                Inclure dans mon pack
              </Label>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="border-vip-gray-700 text-vip-gray-400 hover:bg-vip-gray-800"
            onClick={() => addServiceToCart(service, packageId)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter
          </Button>
        </div>
        {service.included && !service.canBeRemoved && (
          <div className="flex items-center text-sm text-vip-gray-400">
            <Info size={14} className="mr-1" />
            <span>Ce service est obligatoire dans ce pack</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceItem;
