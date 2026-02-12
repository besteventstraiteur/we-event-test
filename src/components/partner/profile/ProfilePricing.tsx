
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import { PricingPackage } from "@/models/partnerProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

interface ProfilePricingProps {
  pricing?: {
    basePrice?: string;
    packages?: PricingPackage[];
  };
  onUpdate: (pricing: {
    basePrice?: string;
    packages?: PricingPackage[];
  }) => void;
}

interface PackageFeature {
  value: string;
}

const ProfilePricing: React.FC<ProfilePricingProps> = ({ pricing, onUpdate }) => {
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      basePrice: pricing?.basePrice || "",
      packages: pricing?.packages || [],
    },
  });

  const { register, handleSubmit, reset, control, watch, setValue } = form;
  
  const onSubmit = (data: any) => {
    onUpdate(data);
  };

  const handleAddPackage = () => {
    setShowNewPackage(true);
  };

  const handleEditPackage = (packageId: string) => {
    setEditingPackageId(packageId);
  };

  const handleCancelEdit = () => {
    setShowNewPackage(false);
    setEditingPackageId(null);
  };

  const handleSavePackage = (packageData: PricingPackage) => {
    const currentPackages = form.getValues("packages") || [];
    
    if (editingPackageId) {
      const updatedPackages = currentPackages.map(pkg => 
        pkg.id === editingPackageId ? { ...packageData, id: editingPackageId } : pkg
      );
      setValue("packages", updatedPackages);
    } else {
      const newPackage = {
        ...packageData,
        id: `pkg_${Date.now()}`,
      };
      setValue("packages", [...currentPackages, newPackage]);
    }
    
    setShowNewPackage(false);
    setEditingPackageId(null);
    
    // Save changes
    onUpdate({
      basePrice: form.getValues("basePrice"),
      packages: form.getValues("packages"),
    });
  };

  const handleDeletePackage = (packageId: string) => {
    const currentPackages = form.getValues("packages") || [];
    const updatedPackages = currentPackages.filter(pkg => pkg.id !== packageId);
    setValue("packages", updatedPackages);
    
    // Save changes
    onUpdate({
      basePrice: form.getValues("basePrice"),
      packages: updatedPackages,
    });
  };

  const packages = watch("packages") || [];

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif de base</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: À partir de 1500€" {...field} />
                </FormControl>
                <FormDescription>
                  Un prix indicatif qui sera affiché sur votre profil
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="bg-vip-gold hover:bg-amber-600 text-white">
              Enregistrer le tarif
            </Button>
          </div>
        </form>
      </Form>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Forfaits et services</h3>
          {!showNewPackage && !editingPackageId && (
            <Button 
              onClick={handleAddPackage} 
              variant="outline"
              className="gap-2"
            >
              <PlusCircle size={16} />
              Ajouter un forfait
            </Button>
          )}
        </div>

        {/* Package Editor */}
        {(showNewPackage || editingPackageId) && (
          <PackageEditor 
            packageToEdit={editingPackageId ? 
              packages.find(pkg => pkg.id === editingPackageId) : 
              undefined
            }
            onSave={handleSavePackage}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Packages List */}
        <div className="space-y-4 mt-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <Card key={pkg.id} className={editingPackageId === pkg.id ? "border-amber-500" : ""}>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium">{pkg.name}</h4>
                    <p className="text-vip-gold font-medium">{pkg.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditPackage(pkg.id)}
                    >
                      <PlusCircle size={16} />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-gray-600 text-sm mb-2">{pkg.description}</p>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Aucun forfait ajouté. Utilisez le bouton ci-dessus pour ajouter vos forfaits.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PackageEditorProps {
  packageToEdit?: PricingPackage;
  onSave: (pkg: PricingPackage) => void;
  onCancel: () => void;
}

const PackageEditor: React.FC<PackageEditorProps> = ({ packageToEdit, onSave, onCancel }) => {
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState<string[]>(packageToEdit?.features || []);
  
  const form = useForm({
    defaultValues: {
      name: packageToEdit?.name || "",
      price: packageToEdit?.price || "",
      description: packageToEdit?.description || "",
    },
  });

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleMoveFeature = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === features.length - 1)
    ) {
      return;
    }

    const updatedFeatures = [...features];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const [movedFeature] = updatedFeatures.splice(index, 1);
    updatedFeatures.splice(newIndex, 0, movedFeature);
    setFeatures(updatedFeatures);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      id: packageToEdit?.id || "",
      features,
    });
  };

  return (
    <Card className="border-amber-500 mb-6">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">
            {packageToEdit ? "Modifier le forfait" : "Nouveau forfait"}
          </h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onCancel}
          >
            <X size={18} />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du forfait</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Forfait Prestige" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1500€ ou À partir de 1500€" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Une description brève de ce forfait" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Caractéristiques</FormLabel>
              
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: 8 heures de prestation"
                  className="flex-1"
                />
                <Button 
                  type="button"
                  onClick={handleAddFeature} 
                  className="gap-2"
                  disabled={newFeature.trim() === ""}
                >
                  <PlusCircle size={16} />
                  Ajouter
                </Button>
              </div>

              <div className="border rounded-lg divide-y">
                {features.length > 0 ? (
                  features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <span>{feature}</span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={index === 0}
                          onClick={() => handleMoveFeature(index, "up")}
                        >
                          <ChevronUp size={16} />
                          <span className="sr-only">Monter</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={index === features.length - 1}
                          onClick={() => handleMoveFeature(index, "down")}
                        >
                          <ChevronDown size={16} />
                          <span className="sr-only">Descendre</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <X size={16} />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Aucune caractéristique ajoutée. Utilisez le champ ci-dessus pour ajouter des caractéristiques.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" className="bg-vip-gold hover:bg-amber-600 text-white">
                {packageToEdit ? "Mettre à jour" : "Ajouter"} le forfait
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfilePricing;
