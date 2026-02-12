import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Logo from "../../assets/images/we-event-logo-white.svg";
import { CircleCheckBig, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useToast } from "../../utils/toast";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useDispatch, useSelector } from "react-redux";
import { setOnLocalStorage } from "../../utils/localStorage";
import { updateUserAccountAction } from "../../module/Auth/Login/LoginActions";
import { STORAGE_INDEXES } from "../../utils/constants";

const Plans = () => {
  const [isUpfront, setIsUpfront] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [currency, setCurrency] = useState<"eur" | "usd">("usd");
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const toast = useToast();
  const login = useSelector((state: any) => state.login);
  const dispatch = useDispatch();
  

  // Detect currency by country
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const euroCountries = [
          "FR",
          "DE",
          "ES",
          "IT",
          "PT",
          "NL",
          "BE",
          "FI",
          "IE",
          "AT",
          "LU",
          "GR",
          "SI",
          "SK",
          "CY",
          "MT",
          "EE",
          "LV",
          "LT",
        ];
        setCurrency(euroCountries.includes(data.country_code) ? "eur" : "usd");
      } catch {
        setCurrency("eur");
      }
    };
    detectCountry();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${PROVIDER.PLANS}?subscriberType=client`);

      if (res?.data?.data?.plans) {
        const formatted = res.data.data.plans.map((plan: any) => {
          let features = [];

          try {
            if (typeof plan.features === "string") {
              features = JSON.parse(plan.features);
            } else if (Array.isArray(plan.features)) {
              features = plan.features;
            } else if (
              typeof plan.features === "object" &&
              plan.features !== null
            ) {
              features = Object.values(plan.features);
            }
          } catch (e) {
            console.error("Invalid features JSON:", plan.features);
            features = [];
          }

          return {
            ...plan,
            features,
          };
        });

        setPlans(formatted);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await getRequest(PROVIDER.MY_SUBSCRIPTION);
      if (res?.data?.success) {
        const sub = res.data.data;

        if (sub?.plan?.features) {
          try {
            sub.plan.features =
              typeof sub.plan.features === "string"
                ? JSON.parse(sub.plan.features)
                : sub.plan.features;
          } catch {
            sub.plan.features = [];
          }
        }

        const updatedUser = { ...login.user, subscription: sub };
        const updatedData = { ...login, user: updatedUser };

        dispatch(updateUserAccountAction(updatedData));
        setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);

        setActiveSubscription(sub);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  // Subscribe
  const handleSubscribe = async (
    planId: string,
    paymentOptionId: string,
    currency: string
  ) => {
    setLoadingSubscription(true);
    try {
      const payload = { planId, paymentOptionId, currency: "EUR" };
      const res = await postRequest(PROVIDER.SUBSCRIBE, payload);
      if (res?.data?.success && res.data.data?.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Subscription failed.");
    }
    setLoadingSubscription(false);
  };

  // Cancel subscription
  const handleCancelConfirm = async () => {
    setCancelLoading(true);
    try {
      const res = await postRequest(PROVIDER.CANCEL_SUBSCRIPTION);
      if (res?.data?.success) {
        toast.success("Subscription cancelled successfully.");
        fetchSubscription();
        setCancelModalOpen(false);
      } else {
        toast.error("Failed to cancel subscription.");
      }
    } catch (error) {
      
    }
    setCancelLoading(false);
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">Abonnement</h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Découvrez les fonctionnalités à venir et proposez vos idées.
        </p>
      </div>

      {/* TOP SECTION */}
      
      <div className="text-center bg-secondary dark:bg-slate-700 pt-10 pb-20 px-4 rounded-2xl">
        <img src={Logo} alt="logo" className="max-w-48 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
       Abonnements We Event
        </h2>
        <p className="text-white/75 text-sm sm:text-xl">Choisissez le forfait qui correspond à vos ambitions.</p>
      </div>

      {/* PLANS GRID */}
      {loading ? (
        <SkeletonPlans />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 -top-10 relative px-4 sm:px-8">
          {plans.map((plan) => {
            const isSubscribed =
              activeSubscription?.planId === plan.id &&
              activeSubscription?.status === "active" &&
              !activeSubscription?.isCanceled;

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-darkmode px-4 py-10 rounded-xl shadow-md"
              >
                <div className="text-center mb-4">
                  <span className="block text-base text-gray-600 dark:text-neutral-400 font-semibold">
                    {plan.name}
                  </span>
                </div>

                {/* Commitments + Payments */}
                {plan.commitments?.map((commit: any) =>
                  commit.payments?.map((payment: any) => {
                    // currency fallback → always use EUR if USD not found
                    let selectedCurrency =
                      payment.currencies.find(
                        (c: any) =>
                          c.currency.toLowerCase() === currency.toLowerCase()
                      ) ||
                      payment.currencies.find(
                        (c: any) => c.currency.toLowerCase() === "eur"
                      );

                    const price = selectedCurrency?.price || "0";
                    const symbol =
                      selectedCurrency?.currency === "EUR" ? "€" : "$";

                    return (
                      <div key={payment.id} className="text-center mb-5">
                        <span className="text-sm text-gray-500 dark:text-neutral-300 font-medium">
                          {payment.paymentType === "full_upfront"
                            ? "Paiement intégral à l’avance"
                            : "Paiement mensuel"}
                        </span>

                        <span className="block my-2 text-4xl font-bold dark:text-neutral-300">
                          {symbol}
                          {price}
                          {payment.paymentType === "monthly" && (
                            <sub className="text-sm">/ Month</sub>
                          )}
                        </span>

                        {/* SUBSCRIBE / CANCEL BUTTON */}
                        {isSubscribed ? (
                          <div className="flex flex-col mt-4 gap-2">
                            <Button
                              variant="secondary"
                              size="medium"
                              className="w-full hover:!bg-gray-500"
                              disabled
                            >
                              Abonné
                            </Button>

                            <Button
                              variant="danger"
                              size="medium"
                              className="w-full"
                              onClick={() => setCancelModalOpen(true)}
                            >
                              Annuler l’abonnement
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="medium"
                            loading={loadingSubscription}
                            className="w-full mt-4"
                            onClick={() =>
                              handleSubscribe(plan.id, payment.id, currency)
                            }
                          >
                            S’abonner
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Features */}
                <ul className="text-gray-600 dark:text-neutral-400 space-y-3 text-sm mt-4">
                  {plan.features?.map((f: any, i: number) => (
                    <li key={i} className="relative ps-8">
                      <CircleCheckBig
                        size={20}
                        className="absolute left-0 top-0 text-green-600"
                      />
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCEL MODAL */}

      <OuterModal active={cancelModalOpen} setActive={setCancelModalOpen}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 bg-white dark:bg-[#1E1E1E] border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl">
          <div className="mb-6 space-y-3">
              <h2 className="text-2xl font-bold text-center dark:text-neutral-100">
            Êtes-vous sûr de vouloir annuler votre abonnement ?
          </h2>
          <p className="text-gray-600 text-base text-center dark:text-neutral-300">
            Vous perdrez immédiatement l'accès aux fonctionnalités premium.
          </p>
          </div>
          

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCancelModalOpen(false)}
            >
              Fermer
            </Button>
            <Button
              variant="danger"
              className="w-full"
              loading={cancelLoading}
              onClick={handleCancelConfirm}
            >
             Confirmer Annuler
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

// Skeleton component
const SkeletonPlans = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 -top-10 relative px-4 sm:px-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white dark:bg-darkmode p-6 rounded-xl shadow-md">
        <Skeleton height={40} width="80%" />
        <Skeleton height={100} />
        <Skeleton count={5} />
      </div>
    ))}
  </div>
);

export default Plans;
