
import React from "react";

interface DescriptionTabProps {
  description: string;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ description }) => {
  return (
    <div className="space-y-4">
      <p>{description}</p>
      <p>
        Ce pack vous offre un ensemble complet de services pour rendre votre mariage inoubliable.
        Tous nos prestataires sont sélectionnés pour leur professionnalisme et la qualité de leurs services.
      </p>
      <p>
        En choisissant ce pack, vous bénéficiez d'une coordination simplifiée et d'un suivi personnalisé
        pour tous les prestataires inclus.
      </p>
    </div>
  );
};

export default DescriptionTab;
