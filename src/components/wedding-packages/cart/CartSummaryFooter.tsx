
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import { formatPrice } from "../utils/cartUtils";

interface CartSummaryFooterProps {
  itemCount: number;
  totalAmount: number;
  onClearCart: () => void;
}

const CartSummaryFooter: React.FC<CartSummaryFooterProps> = ({ 
  itemCount, 
  totalAmount, 
  onClearCart 
}) => {
  return (
    <div className="mt-auto pt-4 border-t border-vip-gray-800">
      <div className="flex justify-between text-sm text-vip-gray-400 mb-2">
        <span>Nombre d'articles:</span>
        <span>{itemCount}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total estimé:</span>
        <span className="text-vip-gold">{formatPrice(totalAmount)}</span>
      </div>
      
      <div className="mt-4 space-y-2">
        <GoldButton className="w-full">
          Enregistrer cette simulation
        </GoldButton>
        <Button 
          variant="outline" 
          className="w-full border-vip-gray-700 text-vip-gray-400"
          onClick={onClearCart}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Vider le panier
        </Button>
      </div>
    </div>
  );
};

export default CartSummaryFooter;
