
import React from "react";
import { PackageService } from "@/models/weddingPackage";
import { Camera, Music, Utensils, Paintbrush, Video, Car, MapPin } from "lucide-react";

export const formatPrice = (price: number) => {
  return (price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

export const getServiceIcon = (type: string) => {
  switch (type) {
    case 'photography': return <Camera size={20} />;
    case 'videography': return <Video size={20} />;
    case 'dj': return <Music size={20} />;
    case 'catering': return <Utensils size={20} />;
    case 'decoration': return <Paintbrush size={20} />;
    case 'venue': return <MapPin size={20} />;
    case 'car': return <Car size={20} />;
    default: return null;
  }
};

export const calculateTotalPrice = (
  pkg: { services: PackageService[], originalPrice: number, discount: number },
  selectedServices: string[]
) => {
  const servicesTotal = pkg.services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);
  
  // Apply discount only if total is greater than or equal to original package price
  if (servicesTotal >= pkg.originalPrice) {
    return servicesTotal - (servicesTotal * (pkg.discount / 100));
  }
  
  return servicesTotal;
};
