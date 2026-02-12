import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import freetrial from "../../assets/images/free-trial.svg";
import { Search, TrendingUp, Award, X } from "lucide-react";
import DataTable from "../../components/ui/Datatable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useToast } from "../../utils/toast";
import debounce from "lodash.debounce";

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ManageSubscriptions() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [plan, setPlan] = useState<string>("");
  const [planOptions, setPlanOptions] = useState<any[]>([]);
  const [plansData, setPlansData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [cancelModal, setCancelModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [upgradeModal, setUpgradeModal] = useState(false);
  const [selectedUserForUpgrade, setSelectedUserForUpgrade] =
    useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [subscriberType, setSubscriberType] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const [planFilterOptions, setPlanFilterOptions] = useState<any[]>([]);

  const subscriptions = [
    { value: "partner", label: "Prestataire" },
    { value: "client", label: "Client" },
  ];

  const debouncedSetSearchServer = useMemo(
    () =>
      debounce((q: string) => {
        setPage(1);
        fetchUsers({ page: 1, limit, search: q });
      }, 350),
    [limit],
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    debouncedSetSearchServer(q);
  };
  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: debouncedSearch || "",
        ...(subscriberType ? { subscriberType } : {}),
        ...(planFilter ? { planId: planFilter } : {}),
      }).toString();

      const res = await getRequest(`${ADMIN.SUBSCRIPTION_LIST}?${params}`);
      const data = res?.data?.data;

      setRows(data?.subscriptions || []);
      setTotal(data?.total || 0);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast.error("Échec de la récupération des abonnements");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, subscriberType, planFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Fetch plan list
  const getPlans = async () => {
    try {
      const res = await getRequest(ADMIN.PLANS_LIST);
      if (res?.data?.success) {
        const data = res.data.data;
        setPlansData(data);
        const options = data.map((p: any) => ({
          label: p.name,
          value: p.id,
        }));
        setPlanOptions([{ label: "Tous", value: "" }, ...options]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await getRequest(`${ADMIN.PLANS}`);
      if (res?.data?.data?.plans) {
        const parsedPlans = res.data.data.plans.map((p: any) => {
          let parsedFeatures: any[] = [];
          if (Array.isArray(p.features)) {
            parsedFeatures = p.features;
          } else if (typeof p.features === "string") {
            try {
              parsedFeatures = JSON.parse(p.features);
            } catch {
              parsedFeatures = [];
            }
          }

          return { ...p, features: parsedFeatures };
        });

        setPlans(parsedPlans);

        setPlanFilterOptions([
          { label: "Tous", value: "" },
          ...parsedPlans.map((p: any) => ({
            label: p.name,
            value: p.id,
          })),
        ]);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  useEffect(() => {
    getPlans();
    fetchPlans();
  }, []);

  // Cancel subscription
  const handleCancelClick = (user: any) => {
    setSelectedUser(user);
    setCancelModal(true);
  };

  const confirmCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await postRequest(
        `${ADMIN.CANCEL_SUBSCRIPTION}/${selectedUser?.id}/cancel`,
      );
      if (res?.data?.success) {
        toast.success("Abonnement annulé avec succès");
        fetchSubscriptions();
        setCancelModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de l’annulation de l’abonnement");
    }
    setCancelLoading(false);
  };

  // 🔹 Handle Plan Selection
  const handlePlanChange = (opt: any) => {
    setSelectedPlan(opt);
    setSelectedPayment(null);
    setSelectedCurrency(null);

    if (!opt?.value) return;

    const planDetail = plansData.find((p) => p.id === opt.value);
    if (planDetail) {
      const paymentList: any[] = [];
      planDetail.commitments.forEach((c: any) => {
        c.payments.forEach((p: any) => {
          paymentList.push({
            label: `${p.paymentType} (ID: ${p.id})`,
            value: p.id,
            currencies: p.currencies,
          });
        });
      });
      setPaymentOptions(paymentList);
    }
  };

  // 🔹 Handle Payment Change
  const handlePaymentChange = (opt: any) => {
    setSelectedPayment(opt);
    setSelectedCurrency(null);
    if (opt?.currencies) {
      const curOpts = opt.currencies.map((c: any) => ({
        label: `${c.currency.toUpperCase()} - ${c.price}`,
        value: c.currency,
      }));
      setCurrencyOptions(curOpts);
    } else {
      setCurrencyOptions([]);
    }
  };

  // 🔹 Manual Upgrade API Call
  const handleUpgrade = async () => {
    if (
      !selectedPlan ||
      !selectedPayment ||
      !selectedCurrency ||
      !selectedUserForUpgrade
    ) {
      toast.error("Veuillez sélectionner tous les champs");
      return;
    }

    try {
      setUpgradeLoading(true);
      const payload = {
        planId: selectedPlan.value,
        paymentOptionId: selectedPayment.value,
        currency: selectedCurrency.value,
        userId: selectedUserForUpgrade.id,
      };

      const res = await postRequest(`${ADMIN.MANUAL_UPGRADE}`, payload);
      if (res?.data?.success) {
        toast.success("Utilisateur mis à niveau avec succès !");
        setUpgradeModal(false);
        fetchSubscriptions();
      } else {
        toast.error(res?.data?.message || "Upgrade failed");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error("Une erreur est survenue");
    } finally {
      setUpgradeLoading(false);
    }
  };

  // Columns
  const columns = useMemo(
    () => [
      {
        key: "user",
        label: "Utilisateur",
        render: (i: any) => (
          <div>
            <div className="font-medium">
              {i.user?.firstName} {i.user?.lastName}
            </div>
            <div className="text-xs text-gray-500">ID: {i.user?.id}</div>
          </div>
        ),
      },
      {
        key: "plan",
        label: "Plan",
        render: (i: any) => <span>{i.plan?.name || "-"}</span>,
      },
      {
        key: "status",
        label: "Statut",
        render: (i: any) => {
          const s = i.status;
          const cls =
            s === "active"
              ? "bg-green-100 text-green-700"
              : s === "canceled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700";
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${cls}`}
            >
              {s}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (i: any) => {
          if (i.status !== "active") {
            return (
              <span className="text-gray-400 text-sm italic">Annulé</span>
            );
          }

          const isFreeTrial =
            i.plan?.price === "0" ||
            i.plan?.name?.toLowerCase().includes("free");

          return (
            <div className="flex items-center gap-2">
              {isFreeTrial ? (
                <Button
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                  onClick={() => {
                    setSelectedUserForUpgrade(i.user);
                    setUpgradeModal(true);
                  }}
                >
                  Mettre à jour le forfait
                </Button>
              ) : (
                <>
                  <Button
                    variant="danger"
                    className=" text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => handleCancelClick(i.user)}
                  >
                    Annulé
                  </Button>
                  <Button
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                    onClick={() => {
                      setSelectedUserForUpgrade(i.user);
                      setUpgradeModal(true);
                    }}
                  >
                    Mettre à jour le forfait
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
      <>
      <div className="mb-6">
      <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
        Abonnements
      </h1>
      </div>
      <div className="flex gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Rechercher par nom ou E-mail"
            className="w-full h-full bg-white dark:bg-neutral-800 border border-borderlight dark:border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search users"
            title="Query Param: search"
          />
          {search ? (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              onClick={() => {
                setSearch("");
                debouncedSetSearchServer("");
              }}
            >
              Clear
            </button>
          ) : null}
        </div>

        <div>
          <CustomSelect
            options={[{ label: "Tous", value: "" }, ...subscriptions]}
            placeholder="Filtrer par type"
            className="w-full min-w-60"
            value={subscriptions.find((s) => s.value === subscriberType)}
            onChange={(opt: any) => setSubscriberType(opt?.value || "")}
          />
        </div>

        <div>
          <CustomSelect
            options={planFilterOptions}
            placeholder="Filtrer par forfait"
            className="w-full min-w-60"
            value={planFilterOptions.find((p) => p.value === planFilter)}
            onChange={(opt: any) => setPlanFilter(opt?.value || "")}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              height={40}
              className="rounded-md dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={rows}
          loading={loading}
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
          columns={columns}
        />
      )}

      {/* Manual Upgrade Modal */}

      <OuterModal
        active={upgradeModal}   
        setActive={setUpgradeModal}
      >
        <div className="w-full max-w-xl mx-auto p-6 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
          <button aria-label="close upgrade modal" className="absolute top-4 right-4 cursor-pointer">
          <X
            className=" dark:text-neutral-300"
            onClick={() => setUpgradeModal(false)}
          />
          </button>
          
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-300">
            Mettre à niveau le forfait pour {selectedUserForUpgrade?.firstName}{" "}
            {selectedUserForUpgrade?.lastName}
          </h2>

          <div className="space-y-4">
            <div>
              <CustomSelect
                label="Sélectionner un nouveau forfait"
                options={planOptions.filter((p) => p.value !== "")}
                value={selectedPlan}
                onChange={handlePlanChange}
                placeholder="Choisir un forfait"
              />
            </div>

            <div>
              <CustomSelect
                label="Option de paiement"
                options={paymentOptions}
                value={selectedPayment}
                onChange={handlePaymentChange}
                placeholder="Choisir une option de paiement"
              />
            </div>

            <div>
              <CustomSelect
                label="Devise"
                options={currencyOptions}
                value={selectedCurrency}
                onChange={(opt: any) => setSelectedCurrency(opt)}
                placeholder="Choisir la devise"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                onClick={() => setUpgradeModal(false)}
                variant="outline"
                className="w-full"
              >
                Annuler
              </Button>
              <Button
                loading={upgradeLoading}
                onClick={handleUpgrade}
                className="w-full"
              >
                Mettre à niveau
              </Button>
            </div>
          </div>
        </div>
      </OuterModal>
    </>
  );
}
