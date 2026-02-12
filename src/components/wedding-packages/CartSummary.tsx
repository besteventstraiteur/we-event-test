
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemsList from "./cart/CartItemsList";
import CartSummaryFooter from "./cart/CartSummaryFooter";
import CartTriggerButton from "./cart/CartTriggerButton";
import { ShoppingCart } from "lucide-react";

const CartSummary = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <CartTriggerButton itemCount={cart.items.length} />
      </SheetTrigger>
      <SheetContent className="bg-vip-gray-900 border-vip-gray-800 w-[350px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Simulation de budget
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          <CartItemsList 
            items={cart.items} 
            onRemoveItem={removeFromCart}
          />
          
          {cart.items.length > 0 && (
            <CartSummaryFooter 
              itemCount={cart.items.length} 
              totalAmount={cart.total} 
              onClearCart={clearCart}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSummary;
