import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Button from "../../components/ui/Button";

const FeatureNotIncluded = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-center">
        <div className="flex items-center justify-center mx-auto bg-yellow-100 rounded-full w-24 h-24 mb-6">
          <AlertTriangle className="text-yellow-600 mx-a" size={60} />
        </div>

        <h2 className="text-xl font-bold text-center mb-3 dark:text-neutral-100">
          Fonctionnalité non disponible
        </h2>

        <p className="text-gray-600 text-base text-center dark:text-neutral-300 mb-10">
          Cette fonctionnalité n’est pas disponible dans votre formule actuelle.
          Veuillez passer à un abonnement payant pour accéder à toutes les
          fonctionnalités premium.
        </p>

        <Button
          variant="primary"
          size="large"
          onClick={() => {
            navigate("/provider/plans");
          }}
          className="w-full"
        >
          Upgrade Plan
        </Button>
      </div>
    </>
  );
};

export default FeatureNotIncluded;
