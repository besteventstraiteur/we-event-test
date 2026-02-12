
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductsTabProps {
  urlPrefix: string;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ urlPrefix }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits et Services</CardTitle>
        <CardDescription>
          Gérez votre catalogue de produits et services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-8 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun produit pour l'instant</h3>
          <p className="text-muted-foreground mb-4">
            Commencez à ajouter des produits et services à votre catalogue
          </p>
          <Link 
            to={`${urlPrefix}/crm/products`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
            Ajouter un produit
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
