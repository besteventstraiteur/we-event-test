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

const FEATURE_LABELS_FR: Record<string, string> = {
  sales_crm: "Gestion commerciale & CRM",
  messaging: "Messagerie & communication",
  calendar: "Agenda & disponibilités",
  logistics: "Logistique",
  inventory: "Gestion des stocks",
  food_orders: "Commandes alimentaires (traiteurs)",
  accounting: "Comptabilité & trésorerie",
  dashboard_kpi: "Tableau de bord & KPI",
  event_sheets: "Fiches techniques événementielles",
  multi_accounts: "Comptes multiples & gestion des rôles",
  api_webhooks: "API publique & webhooks",
  budgets_analytics: "Budgets & analyses",
  storefront: "Vitrine en ligne & présence digitale",
  training: "Formation & communauté",
  community: "Communauté & système de recommandations",
  gamification: "Gamification & reconnaissance",
  referral: "Programme de parrainage",
  profession_specific: "Fonctionnalités spécifiques par métier",
  marketplace: "Marketplace",
  tasks: "Gestion des tâches & to-do",
  talkshow: "Talk-show & podcast",
  landing_pages: "Mini-site & Landing page",
  commercial_ai: "IA commerciale avancée",
  hr: "RH – Pointage & personnel temporaire",
  webinars: "Webinaires",
  marketing: "Marketing",
  ticketing: "Billetterie en ligne",

  // Free plan features
  creation_of_showcase: "Création de vitrine",
  presence_on_the_platform: "Présence sur la plateforme",
  standard_visibility: "Visibilité standard",
  full_access_to_the_platform: "Accès complet à la plateforme",
  priority_visibility_in_searches: "Visibilité prioritaire dans les recherches",
  unlimited_customer_recommendations: "Recommandations clients illimitées",
  access_to_the_sponsorship_program: "Accès au programme de parrainage",
  badges_et_best_awards: "Badges & Best Awards",
  advanced_statistics: "Statistiques avancées",
  priority_support: "Support prioritaire",
};

const Plans = () => {
  const [isUpfront, setIsUpfront] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<{
    planId: string;
    paymentOptionId: string;
    type: "subscribe" | "upgrade";
  } | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const toast = useToast();
  const login = useSelector((state: any) => state.login);
  //  const PARTNER_FEATURES = {
  //     sales_crm: "Sales & CRM Management",
  //     messaging: "Messaging & Communication",
  //     // calendar: "Calendar & Avaislability",
  //     // logistics: "Logistics",
  //     // inventory: "Inventory Management",
  //     // food_orders: "Food Orders (Caterers)",
  //     accounting: "Accounting & Treasury",
  //     dashboard_kpi: "Dashboard & KPI",
  //     // event_sheets: "Event Technical Sheets",
  //     // multi_accounts: "Multi-Accounts & Roles",
  //     // api_webhooks: "Public API & Webhooks",
  //     budgets_analytics: "Budgets & Analytics",
  //     storefront: "Storefront & Online Presence",
  //     // training: "Training & Community",
  //     // community: "Community & Recommendation System",
  //     // gamification: "Gamification & Recognition",
  //     referral: "Referral Program",
  //     profession_specific: "Profession-Specific Features",
  //     // marketplace: "Marketplace",
  //     // tasks: "To-Do & Task Management",
  //     // talkshow: "Talkshow & Podcast",
  //     // landing_pages: "Landing Page Mini-Site",
  //     commercial_ai: "Advanced Commercial AI",
  //     // hr: "HR – Time Clock & Temp Staff",
  //     // webinars: "Webinars",
  //     // marketing: "Marketing",
  //     // ticketing: "Online Ticketing",
  //   };

  const PARTNER_FEATURES = {
    sales_crm: FEATURE_LABELS_FR.sales_crm,
    messaging: FEATURE_LABELS_FR.messaging,
    accounting: FEATURE_LABELS_FR.accounting,
    dashboard_kpi: FEATURE_LABELS_FR.dashboard_kpi,
    budgets_analytics: FEATURE_LABELS_FR.budgets_analytics,
    storefront: FEATURE_LABELS_FR.storefront,
    referral: FEATURE_LABELS_FR.referral,
    profession_specific: FEATURE_LABELS_FR.profession_specific,
    commercial_ai: FEATURE_LABELS_FR.commercial_ai,
  };
  const hasActiveSubscription =
    activeSubscription?.status === "active" && !activeSubscription?.isCanceled;

  const currency = "eur";
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getRequest(PROVIDER.PLANS);
      if (res?.data?.data?.plans) {
        const formatted = res.data.data.plans.map((plan: any) => {
          let features: any[] = [];

          // Case 1: already array
          if (Array.isArray(plan.features)) {
            features = plan.features;
          }
          // Case 2: JSON string
          else if (typeof plan.features === "string") {
            try {
              const parsed = JSON.parse(plan.features);
              features = Array.isArray(parsed) ? parsed : [];
            } catch {
              features = [];
            }
          }
          // Case 3: object (KEY FIX)
          else if (
            typeof plan.features === "object" &&
            plan.features !== null
          ) {
            features = Object.keys(plan.features).map((key) => ({
              key,
              label: key.replace(/_/g, " "),
              isActive: Boolean(plan.features[key]),
            }));
          }
          features = features.map((f: any) => ({
            ...f,
            label: FEATURE_LABELS_FR[f.key] || f.label,
          }));
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

  const dispatch = useDispatch();

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
            if (Array.isArray(sub.plan.features)) {
              sub.plan.features = sub.plan.features.map((f: any) => ({
                ...f,
                label: FEATURE_LABELS_FR[f.key] || f.label,
              }));
            }
          } catch (err) {
            console.error("❌ Failed to parse plan features:", err);
            sub.plan.features = [];
          }
        }
        const updatedUser = {
          ...login.user,
          subscription: sub,
        };
        const updatedData = {
          ...login,
          user: updatedUser,
        };
        dispatch(updateUserAccountAction(updatedData));
        setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, updatedData);
        setActiveSubscription(sub);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    }
  };

  const handleUpgrade = async (
    newPlanId: string,
    newPaymentOptionId: string,
    currency: string,
  ) => {
    setLoadingAction({
      planId: newPlanId,
      paymentOptionId: newPaymentOptionId,
      type: "upgrade",
    });

    try {
      const payload = {
        subscriptionId: activeSubscription.id,
        newPlanId,
        newPaymentOptionId,
        currency: currency.toUpperCase(),
      };

      const res = await postRequest(PROVIDER.UPGRADE_SUBSCRIPTION, payload);

      if (res?.data?.success) {
        const checkoutUrl = res?.data?.data?.checkoutUrl;

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        // fallback (if no checkout needed)
        await fetchSubscription();
      } else {
        toast.error("La mise à jour a échoué. Veuillez réessayer.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upgrade failed.");
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const handleSubscribe = async (
    planId: string,
    paymentOptionId: string,
    currency: string,
  ) => {
    setLoadingAction({ planId, paymentOptionId, type: "subscribe" });
    const payload = { planId, paymentOptionId, currency };
    try {
      const res = await postRequest(PROVIDER.SUBSCRIBE, payload);
      if (res?.data?.success && res.data.data?.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Subscription failed.");
    }
    setLoadingAction(null);
  };

  const handleCancelConfirm = async () => {
    setCancelLoading(true);
    try {
      const res = await postRequest(PROVIDER.CANCEL_SUBSCRIPTION);
      if (res?.data?.success) {
        toast.success("Subscription cancelled successfully.");
        fetchSubscription();
        setCancelModalOpen(false);
      } else {
        toast.error("Failed to cancel subscription. Please try again.");
      }
    } catch (error) {}
    setCancelLoading(false);
  };

  const freePlan = plans.find((p) => p.isFree === true);
  const paidPlan = plans.find((p) => p.isFree === false);
  const currentPlan = plans.find((p) => p.id === activeSubscription?.planId);

  const hasFeature = (plan: any, featureKey: string) =>
    plan?.features?.some((f: any) => f.key === featureKey && f.isActive);

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Abonnement
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Découvrez les fonctionnalités à venir et proposez vos idées.
        </p>
      </div>

      <div className="text-center bg-secondary dark:bg-slate-700  pt-10 pb-20 px-4 rounded-2xl">
        <img src={Logo} alt="logo" className="max-w-48 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-white mb-4">
          Abonnements à nos événements
        </h2>
        <p className="text-white/75 text-sm sm:text-xl">
          Choisissez le forfait qui correspond à vos ambitions
        </p>

        <div className="flex items-center justify-center gap-4 mt-8 text-sm sm:text-base">
          <span className={!isUpfront ? "text-primary" : "text-white"}>
            Mensuel
          </span>
          <button
            onClick={() => setIsUpfront(!isUpfront)}
            className="relative w-14 h-8 flex items-center bg-white rounded-full p-1 transition duration-300 ease-in-out"
          >
            <div
              className={`w-6 h-6 bg-secondary absolute rounded-full shadow-md transform transition-transform duration-300 ${
                isUpfront ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={isUpfront ? "text-primary" : "text-white"}>
            Paiement intégral à l'avance
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative -top-10 px-4 sm:px-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-darkmode p-6 rounded-xl shadow-md flex flex-col gap-4"
            >
              <Skeleton height={40} width="80%" className="mx-auto" />
              <Skeleton height={100} />
              <Skeleton count={5} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative -top-10 px-4 sm:px-8">
          {plans.map((plan, idx) => {
            const isFree = plan.name.toLowerCase().includes("free");
            const isFreePlan = plan.isFree === true;
            const isCurrentPlan = activeSubscription?.planId === plan.id;
            const isFreeUser = activeSubscription?.status === "free";
            const isPaidUser = activeSubscription?.status === "active";

            const isSubscribed =
              activeSubscription?.planId === plan.id &&
              !activeSubscription?.isCanceled &&
              (activeSubscription?.status === "active" ||
                activeSubscription?.status === "free");

            const isPaidSubscribed = isSubscribed && !plan.isFree;

            const filteredCommitments = isFree
              ? plan.commitments
              : plan.commitments?.filter((commit: any) =>
                  commit.payments.some((p: any) =>
                    isUpfront
                      ? p.paymentType === "full_upfront"
                      : p.paymentType === "monthly",
                  ),
                );

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-darkmode flex flex-col px-4 py-10 rounded-xl transition-all duration-300 hover:shadow-md relative"
              >
                {/* {!isFree && idx === 3 && (
                  <span className="absolute -top-2 left-2/4 -translate-x-2/4 bg-orange-500 text-white rounded-sm px-3 py-1 text-xs">
                    Most popular
                  </span>
                )} */}

                <div className="text-center mb-4">
                  <span className="block text-base text-gray-600 dark:text-neutral-400 font-semibold">
                    {plan.name}
                  </span>
                </div>

                {filteredCommitments?.map((commit: any, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="border-t border-gray-200 pt-4 mt-3"
                  >
                    {commit.payments
                      .filter((p: any) =>
                        isFree
                          ? true
                          : isUpfront
                            ? p.paymentType === "full_upfront"
                            : p.paymentType === "monthly",
                      )
                      .map((payment: any, pIdx: number) => {
                        const selectedCurrency = payment.currencies.find(
                          (c: any) => c.currency === currency,
                        );
                        const price = selectedCurrency?.price || "0";
                        const symbol = currency === "eur" ? "€" : "$";
                        const label = isFree
                          ? "Monthly Subscription"
                          : payment.paymentType === "full_upfront"
                            ? "Paiement intégral"
                            : "Abonnement mensuel";
                        const isCurrentPlan =
                          activeSubscription?.planId === plan.id &&
                          activeSubscription?.status === "active";

                        const shouldUpgrade =
                          hasActiveSubscription &&
                          !isCurrentPlan &&
                          !plan.isFree;
                        return (
                          <div key={pIdx} className="text-center mb-5">
                            <span className="text-sm text-gray-500 font-medium">
                              {label}
                            </span>
                            <span className="block my-2 text-4xl font-bold dark:text-neutral-300">
                              {symbol}
                              {price}
                              <sub className="text-sm capitalize">
                                {isUpfront && isFree ? "" : "/ Month"}
                              </sub>
                            </span>

                            {!isFree && payment.trialDays > 0 && (
                              <p className="text-sm text-gray-600 mt-1">
                                {payment.trialDays}-jour d'essai gratuit
                              </p>
                            )}

                            {(() => {
                              if (!activeSubscription) {
                                return (
                                  <Button
                                    variant="primary"
                                    size="medium"
                                    className="w-full rounded-lg my-3"
                                    loading={
                                      loadingAction?.planId === plan.id &&
                                      loadingAction?.paymentOptionId ===
                                        payment.id &&
                                      loadingAction?.type === "subscribe"
                                    }
                                    onClick={() =>
                                      handleSubscribe(
                                        plan.id,
                                        payment.id,
                                        currency,
                                      )
                                    }
                                  >
                                    S’abonner
                                  </Button>
                                );
                              }

                              if (activeSubscription.status === "free") {
                                if (isFreePlan) return null;

                                return (
                                  <Button
                                    variant="primary"
                                    size="medium"
                                    className="w-full rounded-lg my-3"
                                    loading={
                                      loadingAction?.planId === plan.id &&
                                      loadingAction?.paymentOptionId ===
                                        payment.id &&
                                      loadingAction?.type === "subscribe"
                                    }
                                    onClick={() =>
                                      handleSubscribe(
                                        plan.id,
                                        payment.id,
                                        currency,
                                      )
                                    }
                                  >
                                    S’abonner
                                  </Button>
                                );
                              }

                              if (activeSubscription.status === "active") {
                                if (isSubscribed) {
                                  return (
                                    <Button
                                      size="medium"
                                      className="w-full rounded-lg"
                                      disabled
                                    >
                                      Abonné
                                    </Button>
                                  );
                                }

                                // Hide free plan
                                if (isFreePlan) return null;

                                // Other paid plans → Upgrade
                                return (
                                  <Button
                                    variant="primary"
                                    size="medium"
                                    className="w-full rounded-lg my-3"
                                    loading={
                                      loadingAction?.planId === plan.id &&
                                      loadingAction?.paymentOptionId ===
                                        payment.id &&
                                      loadingAction?.type === "upgrade"
                                    }
                                    onClick={() =>
                                      handleUpgrade(
                                        plan.id,
                                        payment.id,
                                        currency,
                                      )
                                    }
                                  >
                                    Mettre à niveau
                                  </Button>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        );
                      })}
                  </div>
                ))}

                <ul className="text-gray-600 dark:text-neutral-300 space-y-3 text-sm mt-3">
                  {plan.features.map((f: any, fIdx: number) => (
                    <li key={fIdx} className="relative ps-8">
                      <CircleCheckBig
                        size={22}
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
      {!loading && (
        <div className="bg-white dark:bg-darkmode rounded-2xl p-4 sm:p-8 lg:mx-8 mt-4 md:mt-10">
          <h2 className="text-2xl font-bold text-center mb-4 dark:text-neutral-300">
            Comparaison détaillée des fonctionnalités
          </h2>
          <table className="w-full">
            <thead className="dark:text-neutral-300 text-xs sm:text-base">
              <tr>
                <th className="border-b border-borderlight py-3 text-left">
                  Fonctionnalité
                </th>
                <th className="border-b border-borderlight py-3 text-center">
                  Abonnement payant
                </th>
                <th className="border-b border-borderlight py-3 text-center">
                  Gratuit
                </th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(PARTNER_FEATURES).map(
                ([featureKey, featureLabel], index) => {
                  const freeHas = hasFeature(freePlan, featureKey);
                  const paidHas = hasFeature(paidPlan, featureKey);
                  const currentHas = hasFeature(currentPlan, featureKey);

                  return (
                    <tr key={featureKey} className="text-xs sm:text-base">
                      {/* Feature name */}
                      <td className="border-b border-borderlight dark:border-neutral-700 py-3 dark:text-neutral-400">
                        {featureLabel}
                      </td>

                      {/* Paid column */}
                      <td className="border-b border-borderlight dark:border-neutral-700 py-3 text-center">
                        {paidHas ? (
                          <CircleCheckBig
                            size={20}
                            className="text-green-600 mx-auto"
                          />
                        ) : (
                          <X size={20} className="text-red-600 mx-auto" />
                        )}
                      </td>

                      {/* Free column */}
                      <td className="border-b border-borderlight dark:border-neutral-700 py-3 text-center">
                        {freeHas ? (
                          <CircleCheckBig
                            size={20}
                            className="text-green-600 mx-auto"
                          />
                        ) : (
                          <X size={20} className="text-red-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}

      <OuterModal active={cancelModalOpen} setActive={setCancelModalOpen}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <div className="mb-6 space-y-4 text-base">
            <h2 className="text-2xl font-bold mb-0 dark:text-neutral-100">
              Êtes-vous sûr de vouloir annuler votre abonnement ?
            </h2>

            <p className="text-gray-600  text-center dark:text-neutral-300">
              Vous perdrez immédiatement l'accès aux fonctionnalités premium.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="large"
              className="w-full"
              onClick={() => setCancelModalOpen(false)}
            >
              Fermer
            </Button>
            <Button
              variant="danger"
              size="large"
              className="w-full"
              loading={cancelLoading}
              onClick={handleCancelConfirm}
            >
              Confirmer l’annulation
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Plans;
