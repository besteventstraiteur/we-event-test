import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomModal from "../../components/Custommodal";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { format } from "date-fns";
import AddExpenseForm from "./AddExpenseForm";
import Gift from "../../assets/images/gift.svg";
import { ArrowLeft, Loader2, Pencil, Trash2, X } from "lucide-react";
import OuterModal from "../../components/Custommodal/OuterModal";
import * as yup from "yup";

// Recharts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
} from "recharts";

import { useToast } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const formatCurrency = (value = 0, locale = "en-US", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value || 0
  );

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const COLOR_PALETTE = [
  "#4F46E5", // indigo
  "#06B6D4", // teal
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#6366F1", // purple
  "#EC4899", // pink
  "#8B5CF6", // violet
  "#F97316", // orange
  "#14B8A6", // emerald
];

type FormValues = {
  amount: number;
};

function Budget() {
  const navigate = useNavigate();
  
  const { id } = useParams(); // event id
  const toast = useToast();

  // --- Add budget form schema ---
  const schema = useMemo(
    () =>
      yup.object().shape({
        amount: yup.number().required("Veuillez entrer le montant"),
      }),
  
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [categoriesOptions, setCategoriesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [active, setActive] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [allocationTemplate, setAllocationTemplate] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<any | null>(null);
  const [error, setError] = useState("");

  const [addBudget, setAddBudget] = useState(false);
  const [budgetObj, setBudgetObj] = useState<any>({});
  const [submittingData, setSubmittingDatas] = useState(false);

  const [openModal, setOpenModal] = useState(false); // outer dummy modal (kept)

  // Intelligent distribution state
  const [allocation, setAllocation] = useState<
    { name: string; percent: number; estimated: number; color: string }[]
  >([]);
  const [allocationLoading, setAllocationLoading] = useState(false);

  // --- Fetch budget ---
  const fetchBudgetDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await getRequest(
        `${PROVIDER.GET_BUDGET_BY_ID}?eventId=${id}`
      );
      const data = resp?.data?.data ?? resp?.data ?? resp;
      setBudget(data || null);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch budget.");
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBudgetDetails();
  }, [id]);

  // Lock body scroll when modals open
  useEffect(() => {
    const locked = active || editActive || openModal || addBudget;
    document.documentElement.style.overflow = locked ? "hidden" : "auto";
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [active, editActive, openModal, addBudget]);

  const total = budget?.total ?? 0;
  const used = budget?.used ?? 0;
  const balance = budget?.balance ?? 0;
  const expenses: any[] = budget?.expenses ?? [];

  const paidActual = useMemo(
    () =>
      expenses.reduce((sum, e) => {
        const val = e.used_amount || e.amount || 0;
        return sum + val;
      }, 0),
    [expenses]
  );

  const remainingEffective = Math.max(0, total - paidActual);
  const percentUsed = total > 0 ? Math.round((paidActual / total) * 100) : 0;

  const categories = useMemo(() => {
    const set = new Set<string>();

    expenses.forEach((e) => {
      if (e.category?.name) {
        set.add(e.category.name);
      }
    });

    return ["All Categories", ...Array.from(set)];
  }, [expenses]);

  const expensesByCategory = useMemo(() => {
    const map: Record<string, any[]> = { "All Categories": expenses };

    for (const e of expenses) {
      const key = e.category?.name || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }

    return map;
  }, [expenses]);

  const [activeTab, setActiveTab] = useState("All Categories");

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const e of expenses) {
      const categoryName = e.category?.name || "Other";
      const value = e.used_amount || e.amount || 0;

      if (!value) continue;

      totals[categoryName] = (totals[categoryName] || 0) + value;
    }

    return Object.entries(totals).map(([name, value], idx) => ({
      name,
      value,
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));
  }, [expenses]);

  const allocationChartData = useMemo(
    () =>
      allocation.map((item) => ({
        name: item.name,
        value: item.estimated || 0,
        color: item.color,
      })),
    [allocation]
  );

  // --- Handlers ---
  const openEdit = (expense: any) => {
    setEditingExpense(expense);
    setEditActive(true);
  };

  const handleDelete = async (expenseId: string) => {
    try {
      setLoading(true);
      await postRequest(`${PROVIDER.DELETE_EXPENSE}/${expenseId}/remove`);
      await fetchBudgetDetails();
      toast.success(t("deleted_successfully", "Supprimé avec succès"));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudgetClick = (b: any) => {
    setBudgetObj(b);
    setAddBudget(true);
  };

  const handleSubmitBudget = async (data: FormValues) => {
    setSubmittingDatas(true);
    try {
      const payload = {
        budgetId: budgetObj?.id,
        amount: data?.amount,
      };
      const res = await postRequest(PROVIDER.ADD_BUDGET, payload);
      if (res.status === 200) {
        setAddBudget(false);
        reset();
        await fetchBudgetDetails();
        toast.success("Budget added successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to add budget. Please try again.");
    } finally {
      setSubmittingDatas(false);
    }
  };

  // 🔹 Apply intelligent distribution – keeps static category list, updates amounts/percents from backend
  const applyDistribution = async () => {
    if (!id) return;

    try {
      setAllocationLoading(true);

      const res = await getRequest(
        `${PROVIDER.APPLY_INTELLIGENT_DISTRIBUTION}?eventId=${id}`
      );

      const serverData = res?.data?.data || [];

      const mapped = allocationTemplate.map((tpl, idx) => {
        const fromApi = serverData.find((d: any) => d.name === tpl.name);

        return {
          name: tpl.name,
          percent: Number(fromApi?.percent) || 0,
          estimated: Number(fromApi?.estimated) || 0,
          color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        };
      });

      setAllocation(mapped);
      await fetchBudgetDetails();

      toast.success("Budget distribution applied");
    } catch (e: any) {
      toast.error("Failed to apply budget distribution");
    } finally {
      setAllocationLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getRequest(
        `${PROVIDER.GET_ALL_SERVICES}?page=1&limit=100`
      );

      const services = res?.data?.data?.services || [];

      // For dropdowns (already existing)
      setCategoriesOptions(
        services.map((s: any) => ({
          value: s.id,
          label: s.name,
        }))
      );

      // 🔥 NEW: allocation template from services
      setAllocationTemplate(
        services.map((s: any) => ({
          id: s.id,
          name: s.name,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const actualCollected = useMemo(() => {
    return expenses.reduce((sum, e) => {
      if (e.status === "paid") {
        return sum + (Number(e.used_amount) || 0);
      }
      return sum;
    }, 0);
  }, [expenses]);

  // ✅ TOTAL ESTIMATED COST → sum of ALL estimated budgets
  const totalEstimatedCost = useMemo(() => {
    return expenses.reduce((sum, e) => {
      return sum + (Number(e.amount) || 0);
    }, 0);
  }, [expenses]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!budget?.distribution?.length) return;
    if (!allocationTemplate.length) return;

    const mapped = allocationTemplate.map((tpl, idx) => {
      const fromApi = budget.distribution.find((d: any) => d.name === tpl.name);

      return {
        name: tpl.name,
        percent: Number(fromApi?.percent) || 0,
        estimated: Number(fromApi?.estimated) || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      };
    });

    setAllocation(mapped);
  }, [budget?.distribution, allocationTemplate]);

  return (
    <>
      
        <div className="mb-6 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center mb-2 cursor-pointer text-sm hover:text-secondary bg-secondary hover:bg-tertiary !text-white px-3 py-1 rounded-lg"
            data-no-translate
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <h2 className="text-2xl font-bold dark:text-neutral-100 mb-0">Event budget</h2>
          <p className="text-gray-600 dark:text-neutral-300">
            For: <span className="capitalize">{budget?.event?.name || ""}</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Top stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-3 text-center rounded-2xl bg-[#4F7396] p-5 text-white">
              <div className="text-3xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24 mx-auto" />
                ) : (
                  `€${total}`
                )}
              </div>
              <div>Budget total</div>
            </div>

            <div className="space-y-3 text-center rounded-2xl bg-amber-500 dark:text-neutral-300 p-5">
              <div className="text-3xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24 mx-auto" />
                ) : (
                  `€${used}`
                )}
              </div>
              <div>Coût réel encaissé   </div>
            </div>

            <div className="space-y-3 text-center rounded-2xl bg-blue-500 text-white p-5">
              <div className="text-3xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24 mx-auto" />
                ) : (
                  `€${balance}`
                )}
              </div>
              <div>Restant total</div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl heading-font font-semibold dark:text-neutral-100">
               Progression du budget
              </span>
              <span className="text-sm text-gray-600 dark:text-neutral-300">
                {percentUsed}% utilisé
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm border border-red-200 rounded px-3 py-2 bg-red-50">
              {error}
            </div>
          )}

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Breakdown by Category (left) */}
            <div className="col-span-1 bg-white dark:bg-darkmode rounded-2xl p-4">
              <h3 className="text-xl heading-font font-semibold mb-3 dark:text-neutral-100">
               Répartition par catégorie
              </h3>

              {loading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="w-36 h-36 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-4 w-16 mb-2" />
                  </div>
                </div>
              ) : categoryTotals.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-neutral-400">Pas encore de catégories</div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div style={{ width: 160, height: 160 }}>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={categoryTotals}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={3}
                          label={false}
                        >
                          {categoryTotals.map((entry, idx) => (
                            <Cell
                              key={`cat-cell-${idx}`}
                              fill={entry.color as string}
                            />
                          ))}
                        </Pie>
                        <ReTooltip
                          formatter={(value: any) => `€${value}`}
                          labelFormatter={(label: any) => label}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-2 max-h-[250px] overflow-auto pr-2">
                      {categoryTotals.map((c) => (
                        <li
                          key={c.name}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full inline-block"
                              style={{ background: c.color as string }}
                            />
                            <span className="text-sm text-gray-700 dark:text-neutral-300">
                              {c.name}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                            €{c.value as number}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Intelligent Budget Allocation (right, chart LEFT, list RIGHT) */}
            <div className="col-span-1 lg:col-span-2 space-y-3 bg-white dark:bg-darkmode p-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <span className="text-xl heading-font block font-semibold dark:text-neutral-100">
                    Allocation intelligente du budget
                  </span>
                  <span className="text-sm flex gap-2 items-center text-gray-700 dark:text-neutral-300 mt-1">
                    Budget total :{" "}
                    <span className="text-3xl text-secondary font-bold">
                      €{total}
                    </span>
                  </span>
                </div>

                <Button
                  onClick={applyDistribution}
                  disabled={allocationLoading}
                  size="medium"
                  variant="primary"
                >
                  {allocationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Application en cours...
                    </>
                  ) : (
                    "Appliquer cette répartition"
                  )}
                </Button>
              </div>

              {allocationLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Skeleton className="w-40 h-40 rounded-full" />
                  <Skeleton className="w-full h-20" />
                </div>
              ) : (
                <div className="mt-4 flex gap-6 items-start">
                  {/* Legend/list on RIGHT */}
                  <div className="flex-1 space-y-3 max-h-[220px] overflow-auto pr-2">
                    {allocation.map((item, idx) => {
                      const percent = item.percent ?? 0;
                      const widthPct = Math.min(
                        100,
                        Math.max(0, percent as number)
                      );

                      return (
                        <div
                          key={`${item.name}-${idx}`}
                          className="border border-gray-100 dark:border-neutral-700 rounded-2xl p-3 bg-gray-50 dark:bg-neutral-800 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-gray-800 dark:text-neutral-100">
                              {item.name}
                            </span>
                            <span className="text-xs rounded-full bg-blue-50 text-blue-600 dark:text-neutral-300 px-2 py-1">
                              {percent}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 dark:text-neutral-300">
                            <span>Estimé</span>
                            <span className="font-semibold text-gray-800 dark:text-neutral-300">
                              €{item.estimated || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category cards (Estimated vs Real) */}

          <div className="bg-white dark:bg-darkmode rounded-xl p-4">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex overflow-auto gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveTab(c)}
                      className={`px-3 py-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === c
                          ? "border-b-2 border-secondary text-secondary"
                          : "text-gray-600 dark:text-neutral-400 hover:text-tertiary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="tab-content">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(expensesByCategory[activeTab] || []).map((item) => {
                      const estimated = item.amount || 0;
                      const real = item.used_amount || 0;
                      const diff = real - estimated;
                      const isOverSpend = diff > 0;
                      const isSaving = diff < 0;
                      const diffClass = isOverSpend
                        ? "text-red-500"
                        : isSaving
                        ? "text-green-500"
                        : "text-gray-500";

                      const ratio =
                        estimated > 0 ? (real / estimated) * 100 : 0;
                      const barWidth = Math.min(
                        100,
                        Math.max(0, Math.round(ratio))
                      );

                      return (
                        <div
                          key={item.id}
                          className="space-y-2 relative border border-borderlight dark:border-neutral-700 dark:bg-neutral-800  p-4 rounded-2xl pr-16"
                        >
                          <div className="flex items-center gap-2">
                            {/* <img src={Gift} className="w-8" alt="icon" /> */}
                            <span className="font-semibold dark:text-neutral-100 capitalize">
                              {item.title}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-neutral-300">
                            {item.category?.name}
                          </p>
                          <div className="flex gap-2 absolute right-3 top-3">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer group relative"
                            >
                              <Pencil size={14} className="text-gray-600" />
                              <span
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                              >
                                Modifier
                              </span>
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer group relative"
                            >
                              <Trash2 size={14} className="text-gray-600" />
                              <span
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                              >
                                Supprimer
                              </span>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-600 dark:text-neutral-300">
                                Estimé
                              </span>
                              <span className="font-semibold dark:text-neutral-400">
                                €{estimated?.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm text-gray-600 dark:text-neutral-300">
                                Réel
                              </span>
                              <span className="font-semibold dark:text-neutral-400">
                                €{real?.toFixed(2)}
                              </span>
                              <span className={`text-xs ${diffClass}`}>
                                {diff === 0
                                  ? formatCurrency(0)
                                  : `${diff > 0 ? "+" : "-"}€${Math.abs(diff)}`}
                              </span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-500 h-full rounded-full"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {!loading &&
                      (expensesByCategory[activeTab] || []).length === 0 && (
                        <div className="col-span-3 text-gray-500 dark:text-neutral-400">
                         Aucun élément dans cette catégorie
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add budget / Add expense CTA */}

          <div className="mt-4">
            {(!budget || !budget.total) && budget !== 0 ? (
              <Button
                className="ml-2"
                onClick={() => handleAddBudgetClick(budget)}
                variant="outline"
                size="small"
              >
                Ajouter un budget
              </Button>
            ) : (
              <Button
                variant="primary"
                size="medium"
                onClick={() => setActive(true)}
              >
                Ajouter une nouvelle dépense
              </Button>
            )}
          </div>
        </div>
      

      {/* Add Expense Modal */}

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            
            }}
          />
          <div className="mb-6 space-y-3">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Détails de la dépense
            </h2>
            <p className="text-sm text-gray-600 dark:text-neutral-300">Renseignez les détails pour ajouter une dépense.</p>
          </div>

          <AddExpenseForm
            budgetId={budget?.id}
            fetchAll={fetchBudgetDetails}
            setActive={setActive}
            categories={categoriesOptions}
          />
        </div>
      </OuterModal>

      {/* Edit Expense Modal */}

      <OuterModal active={editActive} setActive={setEditActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setEditActive(false);
              
            }}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-semibold dark:text-neutral-100">
              Modifier la dépense
            </h2>
          </div>

          <AddExpenseForm
            budgetId={budget?.id}
            fetchAll={fetchBudgetDetails}
            setActive={setEditActive}
            initialData={editingExpense}
            isEdit
            categories={categoriesOptions}
          />
        </div>
      </OuterModal>

      {/* Add Budget Modal */}

      <OuterModal active={addBudget} setActive={setAddBudget}>
        <div className="w-full max-w-xl mx-auto p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <h2 className="text-4xl font-bold text-center mb-3 dark:text-neutral-300">
            Détails du budget
          </h2>
          <p className="text-gray-600 text-base text-center dark:text-neutral-300">
            Remplissez le montant à ajouter au budget
          </p>

          <div className="event-create mt-10">
            <form
              onSubmit={handleSubmit(handleSubmitBudget)}
              className="space-y-4"
            >
              <div>
                <InputGroup
                  label="Amount"
                  placeholder="Amount"
                  inputProps={register("amount")}
                  error={errors.amount}
                />
              </div>

              <div className="flex gap-4 justify-between mt-10">
                <Button
                  variant="primary"
                  size="medium"
                  type="submit"
                  className="flex-1"
                  disabled={submittingData}
                >
                  {submittingData ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save budget"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>

      {/* Outer modal preserved */}
      
      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-xl mx-auto p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setOpenModal(false)}
          />

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-2xl font-semibold mb-4">Add the post</h2>
            <div>
              <InputGroup
                label="Name"
                placeholder="Name (e.g., Caterer)"
                type="text"
              />
            </div>

            <div>
              <InputGroup
                label="Estimated cost"
                placeholder="Estimated cost"
                type="number"
              />
            </div>

            <div>
              <InputGroup
                label="Actual cost"
                placeholder="Actual cost"
                type="number"
              />
            </div>

            <div>
              <InputGroup
                label="Category"
                placeholder="Category (e.g., Restaurant)"
                type="text"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="mark-paid" />
              <span className="text-sm dark:text-neutral-300">Mark as paid</span>
            </div>

            <div className="mt-5">
              <Button
                loading={loading}
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
    </>
  );
}

export default Budget;
