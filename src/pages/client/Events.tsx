import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import { Loader2, Search } from "lucide-react";
import Eventimg from "../../assets/images/destination.jpg";
import { PROVIDER } from "../../utils/endPoints";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { useNavigate } from "react-router-dom";
import CreateEvent from "../../module/Dashboard/CreateEvent";
import CustomModal from "../../components/Custommodal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../utils/toast";
import AddExpenseForm from "./AddExpenseForm";


function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return debounced;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-gray-200/70 dark:bg-gray-700/50 rounded-md animate-pulse ${className}`}
  />
);

const EventCardSkeleton: React.FC = () => (
  <div className="p-4 shadow-sm rounded-xl">
    <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
      <Skeleton className="h-[140px] w-[200px] rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-8 w-28 mt-3" />
      </div>
    </div>
  </div>
);

// Types
type Category = { id: string; name: string };
type EventItem = {
  id: string;
  name: string;
  description?: string;
  startDateTime?: string;
  status?: string;
  thumbnail?: string;
  address?: string;
  category?: { id: string; name: string };
};

type FormValues = {
  amount: number;
};

function Events() {
  
  const schema = useMemo(() =>
    yup.object().shape({
      amount: yup.number().required(t("enter_amount")),
    })
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {},
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [submittingData, setSubmittingDatas] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<"all" | string>(
    "all"
  );
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useDebounce(searchText, 500);
  const navigate = useNavigate();

  const categoryIdsParam =
    activeCategoryId === "all" ? "" : String(activeCategoryId);

  const fetchAll = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      const trimmed = debouncedSearch.trim();
      if (trimmed) qs.set("search", trimmed);
      if (categoryIdsParam) qs.set("categoryIds", categoryIdsParam);

      const [eventsRes, categoriesRes] = await Promise.all([
        getRequest(`${PROVIDER.GET_EVENTS}?${qs.toString()}`),
        getRequest(PROVIDER.GET_ALL_CATEGORIES),
      ]);

      if (!isMounted) return;

      const evData = eventsRes?.data?.data ?? {};
      setEvents(Array.isArray(evData?.events) ? evData.events : []);
      setTotal(Number(evData?.total ?? 0));

      const catList = categoriesRes?.data?.data?.data;
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.error(err);
      if (isMounted) {
        setEvents([]);
        setTotal(0);
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, categoryIdsParam]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const cleanup = await fetchAll();
      if (!cancelled && typeof cleanup === "function") {
        return cleanup;
      }
    };
    const promise = run();
    return () => {
      cancelled = true;
      void promise;
    };
  }, [fetchAll]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryIdsParam]);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (activeCategoryId !== "all") {
      const target = String(activeCategoryId);
      list = list.filter((e) => String(e?.category?.id ?? "") === target);
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter((e) => {
        const fields = [
          e?.name ?? "",
          e?.description ?? "",
          e?.address ?? "",
          e?.category?.name ?? "",
        ];
        return fields.some((f) => f.toLowerCase().includes(q));
      });
    }
    return list;
  }, [events, activeCategoryId, searchText]);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [active, setActive] = useState(false);

  const [addBudget, setAddBudget] = useState(false);
  const [addExpense, setAddExpense] = useState(false);
  const [budgetObj, setBudgetObj] = useState({});

  const toast = useToast();
  const handleSubmitBudget = async (data: FormValues) => {
    setSubmittingDatas(true);
    try {
      const payload = {
        budgetId: budgetObj?.id,
        amount: data?.amount,
      };
      // setLoading(true);
      
      const res = await postRequest(PROVIDER.ADD_BUDGET, payload);
      if (res.status === 200) {
        setAddBudget(false);
        fetchAll();
        reset();
        setSubmittingDatas(false);
        toast.success("Budget added successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to add budget. Please try again.");
    }
    setSubmittingDatas(false);
  };

  const handleAddBudget = (budget) => {
    
    setAddBudget(true);
    setBudgetObj(budget);
  };

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);
  useEffect(() => {
    reset({}, { keepValues: true });
  }, [schema, reset]);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col items-start gap-5 justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold dark:text-neutral-100">
              Mes événements
            </h1>
            <p className="text-gray-600 mt-1 dark:text-neutral-300">
              Gérez tous vos événements depuis un seul endroit.
            </p>
          </div>
          {filteredEvents?.length === 0 && (
            <div className="flex-shrink-0 pe-[100px]">
              <Button
                onClick={() => setActive(!active)}
                variant="primary"
                size="medium"
              >
                Créer un événement
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="event-wrapper">
        <div className="relative">
          <Search
            size={20}
            className="text-gray-500 absolute top-[15px] left-4"
          />
          <InputGroup
            // label="Search"
            placeholder="Rechercher un événement par nom"
            className="pl-11"
            inputProps={{
              value: searchText,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value),
            }}
          />
        </div>

        {/* Categories */}

        <div className="events-tabs flex flex-nowrap gap-3 mt-8 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <span
            onClick={() => setActiveCategoryId("all")}
            className={`px-5 py-2 rounded-full flex-shrink-0 cursor-pointer transition-all duration-300 capitalize ${
              activeCategoryId === "all"
                ? "bg-secondary text-white"
                : "bg-gray-200  hover:bg-gray-300"
            }`}
          >
            Tous
          </span>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-32 rounded-full" />
              ))
            : categories.map((cat) => {
                const isActive = String(activeCategoryId) === String(cat.id);
                return (
                  <span
                    key={cat.id}
                    onClick={() => setActiveCategoryId(String(cat.id))}
                    className={`px-5 flex-shrink-0 py-2 rounded-full cursor-pointer transition-all duration-300 capitalize ${
                      isActive
                        ? "bg-secondary text-white"
                        : "bg-gray-200 dark:bg-[#0A0A0A] dark:hover:bg-white/10 dark:text-neutral-300 hover:bg-gray-300"
                    }`}
                  >
                    {cat.name}
                  </span>
                );
              })}
        </div>

        {/* Events list */}
        <div className="events-tabs__content space-y-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="text-gray-600">Aucun événement trouvé.</div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 shadow-sm rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-white/10 dark:bg-[#0A0A0A]"
              >
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center">
                  <div className="overflow-hidden rounded-2xl h-[140px]">
                    <img
                      src={ev.thumbnail || Eventimg}
                      alt={ev.name}
                      className="w-full h-full object-cover rounded-2xl transition-all duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-gray-600 text-sm dark:text-neutral-300">
                        Statut:{" "}
                        {ev.status === "active" ? "Upcoming" : ev.status}
                      </div>
                      <div className="text-gray-600 text-sm dark:text-neutral-300">
                        Total budget: ${ev?.budget?.total}
                      </div>
                    </div>

                    <h3 className="text-lg capitalize font-semibold dark:text-neutral-300">
                      {ev.name}
                    </h3>
                    <div className="text-gray-600 dark:text-neutral-300 gap-2 text-sm">
                      <span>{formatDate(ev.startDateTime)}</span> •{" "}
                      <span>{ev.category?.name ?? "Uncategorized"}</span> •{" "}
                      <span>{ev.address}</span>
                      <div className="mt-4">
                        <Button
                          onClick={() =>
                            navigate(`/client/event-details/${ev.id}`)
                          }
                          variant="primary"
                          size="small"
                        >
                          Voir les détails
                        </Button>
                        {ev?.budget?.balance === 0 ? (
                          <Button
                            className="ml-2"
                            onClick={() => handleAddBudget(ev.budget)}
                            variant="outline"
                            size="small"
                          >
                            Ajouter un budget
                          </Button>
                        ) : (
                          <Button
                            className="ml-2"
                            onClick={() => navigate(`/client/budget/${ev?.id}`)}
                            variant="outline"
                            size="small"
                          >
                           Gérer les dépenses
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && total > limit && (
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="text-sm text-gray-600">Page {page}</div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= total}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <CreateEvent fetchAll={fetchAll} setActive={setActive} active={active} />
      <CustomModal active={addBudget} setActive={setAddBudget}>
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
      </CustomModal>
      <CustomModal active={addExpense} setActive={setAddExpense}>
        <div className="w-full max-w-xl mx-auto p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <h2 className="text-4xl font-bold text-center mb-3 dark:text-neutral-300">
             Détails de la dépense
          </h2>
          <p className="text-gray-600 text-base text-center dark:text-neutral-300">
            Remplissez les détails pour ajouter une dépense
          </p>
     
          <AddExpenseForm
            budgetId={budgetObj?.id}
            setActive={setAddExpense}
            fetchAll={fetchAll}
          />
        </div>
      </CustomModal>
    </div>
  );
}

export default Events;
