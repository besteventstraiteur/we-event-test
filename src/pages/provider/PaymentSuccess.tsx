import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const login = useSelector((state: any) => state.login);

  useEffect(() => {
    const role = login?.user?.role;
    const fromBusiness = localStorage.getItem("fromBusinessMeeting");

    const timer = setTimeout(() => {
      if (fromBusiness === "true") {
        localStorage.removeItem("fromBusinessMeeting");
        navigate("/provider/partner-training");
        return;
      }

      if (role === "client") {
        navigate("/client/multi-events");
      } else {
        navigate("/provider/plans");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="flex items-center justify-center bg-green-100 rounded-full w-24 h-24 mb-6">
        <CircleCheckBig className="text-green-600" size={60} />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-300 mb-3 text-center">
        Paiement réussi !
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-8">
        Votre paiement a été traité avec succès.
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Redirection en cours, veuillez patienter...
      </p>
    </div>
  );
};

export default PaymentSuccess;
