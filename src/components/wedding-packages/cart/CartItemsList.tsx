
import React from "react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { groupCartItemsByType } from "../utils/cartUtils";

interface CartItemsListProps {
  items: CartItemType[];
  onRemoveItem: (itemId: string) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return <EmptyCart />;
  }

  const { packages, services } = groupCartItemsByType(items);

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto flex-1 pr-2">
      {packages.length > 0 && (
        <div className="space-y-2">
          {packages.length > 0 && (
            <h3 className="text-sm font-medium text-vip-gray-400 mb-1">Packs</h3>
          )}
          {packages.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onRemove={onRemoveItem} 
            />
          ))}
        </div>
      )}
      
      {services.length > 0 && (
        <div className="space-y-2">
          {services.length > 0 && (
            <h3 className="text-sm font-medium text-vip-gray-400 mb-1">Services</h3>
          )}
          {services.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onRemove={onRemoveItem} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartItemsList;
