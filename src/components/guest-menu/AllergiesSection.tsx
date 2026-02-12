
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react';

interface AllergiesSectionProps {
  selectedMenu: string;
  allergies: string[];
  otherAllergy: string;
  onAllergyToggle: (allergyId: string) => void;
  onOtherAllergyChange: (value: string) => void;
}

const AllergiesSection: React.FC<AllergiesSectionProps> = ({
  selectedMenu,
  allergies,
  otherAllergy,
  onAllergyToggle,
  onOtherAllergyChange
}) => {
  if (!selectedMenu) return null;

  const commonAllergies = [
    { id: 'gluten', label: 'Gluten' },
    { id: 'arachides', label: 'Arachides' },
    { id: 'lactose', label: 'Lactose' },
    { id: 'fruits_mer', label: 'Fruits de mer' },
    { id: 'oeufs', label: 'Œufs' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Allergies et restrictions alimentaires</h2>
      
      <Card className="border-amber-200 bg-amber-50">
        <div className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Information importante</h3>
            <p className="text-amber-700 text-sm mt-1">
              Indiquez toutes vos allergies ou restrictions alimentaires pour que notre chef puisse adapter votre menu.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {commonAllergies.map((allergy) => (
          <div key={allergy.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`allergy-${allergy.id}`} 
              checked={allergies.includes(allergy.id)}
              onCheckedChange={() => onAllergyToggle(allergy.id)}
            />
            <label
              htmlFor={`allergy-${allergy.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {allergy.label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="otherAllergy" className="text-sm font-medium">
          Autres allergies ou restrictions (optionnel)
        </label>
        <Textarea
          id="otherAllergy"
          placeholder="Précisez vos autres allergies ou restrictions alimentaires..."
          value={otherAllergy}
          onChange={(e) => onOtherAllergyChange(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default AllergiesSection;
