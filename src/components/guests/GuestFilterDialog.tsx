
import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GuestFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: GuestFilters) => void;
  initialFilters: GuestFilters;
}

export interface GuestFilters {
  ceremony: boolean;
  cocktail: boolean;
  dinner: boolean;
  brunch: boolean;
  responded: boolean;
  pending: boolean;
}

const GuestFilterDialog: React.FC<GuestFilterDialogProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<GuestFilters>(initialFilters);

  const handleCheckboxChange = (key: keyof GuestFilters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: GuestFilters = {
      ceremony: false,
      cocktail: false,
      dinner: false,
      brunch: false,
      responded: false,
      pending: false,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filtrer les invités
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Événements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ceremony"
                    checked={filters.ceremony}
                    onCheckedChange={() => handleCheckboxChange("ceremony")}
                  />
                  <Label htmlFor="ceremony">Cérémonie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cocktail"
                    checked={filters.cocktail}
                    onCheckedChange={() => handleCheckboxChange("cocktail")}
                  />
                  <Label htmlFor="cocktail">Vin d'honneur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dinner"
                    checked={filters.dinner}
                    onCheckedChange={() => handleCheckboxChange("dinner")}
                  />
                  <Label htmlFor="dinner">Repas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brunch"
                    checked={filters.brunch}
                    onCheckedChange={() => handleCheckboxChange("brunch")}
                  />
                  <Label htmlFor="brunch">Brunch</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Statut</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="responded"
                    checked={filters.responded}
                    onCheckedChange={() => handleCheckboxChange("responded")}
                  />
                  <Label htmlFor="responded">A répondu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pending"
                    checked={filters.pending}
                    onCheckedChange={() => handleCheckboxChange("pending")}
                  />
                  <Label htmlFor="pending">En attente</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          <Button
            type="button"
            className="bg-vip-gold hover:bg-vip-gold/90"
            onClick={handleApply}
          >
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestFilterDialog;
