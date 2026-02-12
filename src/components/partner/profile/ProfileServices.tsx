
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, X, MoveUp, MoveDown } from "lucide-react";

interface ProfileServicesProps {
  services: string[];
  onUpdate: (services: string[]) => void;
}

const ProfileServices: React.FC<ProfileServicesProps> = ({ services, onUpdate }) => {
  const [newService, setNewService] = useState("");

  const handleAddService = () => {
    if (newService.trim() === "") return;
    onUpdate([...services, newService.trim()]);
    setNewService("");
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    onUpdate(updatedServices);
  };

  const handleMoveService = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === services.length - 1)
    ) {
      return;
    }

    const updatedServices = [...services];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const [movedService] = updatedServices.splice(index, 1);
    updatedServices.splice(newIndex, 0, movedService);
    onUpdate(updatedServices);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddService();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Vos services</h3>
        <p className="text-sm text-gray-600 mb-4">
          Listez les services que vous proposez à vos clients. Ces informations seront visibles sur votre profil.
        </p>

        <div className="flex gap-2 mb-6">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Menu personnalisé, Service à table..."
            className="flex-1"
            maxLength={100}
          />
          <Button 
            onClick={handleAddService} 
            className="gap-2"
            disabled={newService.trim() === ""}
          >
            <PlusCircle size={16} />
            Ajouter
          </Button>
        </div>

        <div className="border rounded-lg divide-y">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                <span>{service}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={index === 0}
                    onClick={() => handleMoveService(index, "up")}
                  >
                    <MoveUp size={16} />
                    <span className="sr-only">Monter</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={index === services.length - 1}
                    onClick={() => handleMoveService(index, "down")}
                  >
                    <MoveDown size={16} />
                    <span className="sr-only">Descendre</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveService(index)}
                  >
                    <X size={16} />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Aucun service ajouté. Utilisez le champ ci-dessus pour ajouter vos services.
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800 mb-2">Astuce</h4>
        <p className="text-sm text-amber-700">
          Soyez précis et concis dans la description de vos services. Mettez en avant ce qui vous différencie de vos concurrents.
        </p>
      </div>
    </div>
  );
};

export default ProfileServices;
