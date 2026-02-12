import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import Logo from "../../assets/images/we-event-logo-white.svg";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate("/provider/plans");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black px-4">
      {/* Logo */}
      <img
        src={Logo}
        alt="We Event"
        className="w-40 mb-6 animate-fade-in"
      />

      {/* Cancel Icon */}
      <div className="flex items-center justify-center bg-red-100 rounded-full w-24 h-24 mb-6">
        <XCircle className="text-red-600" size={60} />
      </div>

      {/* Cancel Message */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-300 mb-3 text-center">
        Paiement Annulé
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-8">
        Votre paiement n'a pas été finalisé. Vous pouvez réessayer à tout moment.
      </p>

      {/* Redirect Info */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Redirection vers votre page Abonnement...
      </p>
    </div>
  );
};

export default PaymentCancel;
