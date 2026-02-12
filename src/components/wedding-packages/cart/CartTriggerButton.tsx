
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface CartTriggerButtonProps {
  itemCount: number;
  className?: string;
  onClick?: () => void;
}

const CartTriggerButton: React.FC<CartTriggerButtonProps> = ({ 
  itemCount, 
  className,
  onClick 
}) => {
  return (
    <Button 
      variant="outline" 
      className={`relative ${className || ''}`}
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      <span>Panier</span>
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-vip-gold text-vip-black px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartTriggerButton;
