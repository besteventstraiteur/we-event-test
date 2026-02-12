
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { formatPrice } from "../utils/cartUtils";

interface CartItemProps {
  item: CartItemType;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <div className="bg-vip-gray-800/50 rounded-lg p-3 flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center">
          {item.type === "package" ? (
            <Badge className="bg-vip-gold text-vip-black mr-2">Pack</Badge>
          ) : (
            <Badge className="bg-vip-gray-700 mr-2">Service</Badge>
          )}
          <h4 className="font-medium line-clamp-1">{item.name}</h4>
        </div>
        {item.vendorName && (
          <p className="text-sm text-vip-gray-400 mt-1">{item.vendorName}</p>
        )}
        <p className="text-vip-gold font-bold mt-1">{formatPrice(item.price)}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-vip-gray-400 hover:text-white hover:bg-vip-gray-700"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
