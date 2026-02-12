import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Logo from "../../assets/images/we-event-logo-white.svg";
import { CircleCheckBig, Plus, X, Trash2 } from "lucide-react";
import CreatePlan from "../../module/Subscriptions/CreatePlan";
import { getRequest, deleteRequest } from "../../utils/http-client/axiosClient";
import { ADMIN, PROVIDER } from "../../utils/endPoints";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useToast } from "../../utils/toast";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function Manageplans() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [isUpfront, setIsUpfront] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    plan: any | null;
    loading: boolean;
  }>({ open: false, plan: null, loading: false });

  const toast = useToast();

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${ADMIN.PLANS}?type="client"`);
      if (res?.data?.data?.plans) {
        const parsedPlans = res.data.data.plans.map((p) => {
          let parsedFeatures: any[] = [];
          if (Array.isArray(p.features)) {
            parsedFeatures = p.features;
          } else if (typeof p.features === "string") {
            try {
              parsedFeatures = JSON.parse(p.features);
            } catch (err) {
              console.error(
                "❌ Failed to parse features for plan:",
                p.name,
                err,
              );
              parsedFeatures = [];
            }
          }
          return {
            ...p,
            features: parsedFeatures,
          };
        });
        setPlans(parsedPlans);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan: any) => {
    setEditPlan(plan);
    setActive(true);
  };

  const handleDeletePlan = async () => {
    if (!deleteModal.plan) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      await deleteRequest(`${ADMIN.DELETE_PLAN}/${deleteModal.plan.id}`);
      toast.success("Plan supprimé avec succès !");
      setDeleteModal({ open: false, plan: null, loading: false });
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan:", err);
      toast.error(err?.response?.data?.message || "Failed to delete plan!");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatDuration = (months: number) => {
    if (months === 0) return "for life";
    return months === 12 ? "1 year" : `${months} months`;
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Gérer les forfaits
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérer tous les abonnements.
        </p>
      </div>

      {/* ===== Banner section ===== */}
      <div className="text-center bg-secondary dark:bg-slate-700 pt-10 pb-20 px-4 rounded-2xl relative">
        <Button
          onClick={() => {
            setEditPlan(null);
            setActive(true);
          }}
          variant="primary"
          size="medium"
          className="static mb-4 sm:absolute right-5 border border-white bg-transparent top-5 hover:!bg-tertiary hover:border-tertiary"
        >
          <Plus size={18} /> Ajouter un nouveau forfait
        </Button>

        <img src={Logo} alt="logo" className="max-w-48 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-white mb-4">
          Abonnements à nos événements
        </h2>
        <p className="text-white/75 text-base sm:text-lg">
          Contrôlez et personnalisez les formules d'abonnement de vos
          utilisateurs
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
            En amont
          </span>
        </div>
      </div>

      {/* ===== Plans Grid ===== */}
      <div className="plans grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative -top-10 px-4 sm:px-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-darkmode flex flex-col px-4 py-10 rounded-xl"
            >
              <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-10 w-3/4 mx-auto mb-3" />
              <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
              <Skeleton className="h-10 w-full rounded-lg mb-6" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-3/4 mx-auto" />
                ))}
              </div>
            </div>
          ))
        ) : plans.length === 0 ? (
          <p className="text-center text-gray-500 col-span-4">
            No plans found.
          </p>
        ) : (
          plans.map((plan) => {
            const commitments = plan.commitments || [];

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-darkmode flex flex-col px-4 py-10 rounded-xl relative transition-all duration-300 hover:shadow-md"
              >
                {/* ===== Delete button for paid plans ===== */}
                {!plan.isFree && (
                  <button
                    onClick={() =>
                      setDeleteModal({ open: true, plan, loading: false })
                    }
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition cursor-pointer bg-red-100 flex w-9 h-9 rounded-full"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Delete Plan"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="text-center mt-4">
                  <span className="block text-base text-gray-600 font-semibold">
                    {plan.name}
                  </span>

                  {/* ===== Pricing section ===== */}
                  {commitments.map((commit, i) => {
                    const activePayment = commit.payments?.find((p) =>
                      isUpfront
                        ? p.paymentType === "full_upfront"
                        : p.paymentType === "monthly",
                    );

                    const eur = activePayment?.currencies?.find(
                      (c) => c.currency.toLowerCase() === "eur",
                    );
                    const usd = activePayment?.currencies?.find(
                      (c) => c.currency.toLowerCase() === "usd",
                    );

                    return (
                      <div key={i} className="mt-4">
                        {eur?.price || usd?.price ? (
                          <div className="flex flex-col items-center my-4">
                            <div className="flex items-center gap-3 text-3xl font-bold dark:text-neutral-300">
                              {eur?.price && (
                                <span className="flex items-baseline gap-1">
                                  <span>€{eur.price}</span>
                                </span>
                              )}
                              {/* {usd?.price && (
                                  <span className="flex items-baseline gap-1">
                                    <span>${usd.price}</span>
                                  </span>
                                )} */}
                            </div>
                            <sub className="text-sm capitalize mt-1 text-gray-600 dark:text-gray-300">
                              / {formatDuration(commit.durationMonths)}
                            </sub>
                          </div>
                        ) : (
                          <span className="block my-4 text-4xl font-bold mb-0">
                            -
                          </span>
                        )}

                        {activePayment?.trialDays > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            {activePayment.trialDays}-day free trial
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ===== Edit Button + Features ===== */}
                <div className="w-full mt-4">
                  <Button
                    variant="primary"
                    size="large"
                    className="w-full rounded-lg my-5"
                    onClick={() => handleEdit(plan)}
                  >
                    Modifier le forfait
                  </Button>

                  <ul className="text-gray-600 space-y-3 text-sm">
                    {plan.features
                      .filter((f: any) => f.isActive)
                      .map((f: any) => (
                        <li key={f.key} className="relative ps-8">
                          <CircleCheckBig
                            size={22}
                            className="absolute left-0 top-0 text-green-600"
                          />
                          {f.label}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== Create/Edit Modal ===== */}
      <OuterModal active={active} setActive={setActive}>
        <div className="w-full lg:max-w-3/5 mx-auto p-5 lg:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            }}
          />
          <CreatePlan
            fetchPlans={fetchPlans}
            setActive={setActive}
            editData={editPlan}
          />
        </div>
      </OuterModal>

      {/* ===== Delete Confirmation Modal ===== */}
      <OuterModal
        active={deleteModal.open}
        setActive={() =>
          setDeleteModal({ open: false, plan: null, loading: false })
        }
      >
        <div className="w-full max-w-lg mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <h2 className="text-2xl font-bold text-center mb-3 dark:text-neutral-100">
            Êtes-vous sûr ?
          </h2>
          <p className="text-gray-600 text-base text-center dark:text-neutral-300">
            Cette action supprimera définitivement{" "}
            <span className="font-semibold">
              {deleteModal.plan?.name || "this plan"}
            </span>
            . Cette action est irréversible.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setDeleteModal({ open: false, plan: null, loading: false })
              }
            >
              Annuler
            </Button>
            <Button
              loading={deleteModal.loading}
              variant="danger"
              className="w-full"
              onClick={handleDeletePlan}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
}
