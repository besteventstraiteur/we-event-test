import { useEffect, useRef, useState, useCallback } from "react";
import {
  Calendar,
  CircleCheckBig,
  Clock,
  EllipsisVertical,
  Euro,
  EuroIcon,
  Eye,
  Pencil,
  Trash,
  Users,
  X,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Eventthumb from "../../assets/images/event.webp";
import Button from "../../components/ui/Button";
import { PROVIDER } from "../../utils/endPoints";
import { useSearchParams } from "react-router-dom";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import CreateEvent from "../../module/Dashboard/CreateEvent";
import { useNavigate } from "react-router-dom";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useToast } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAccountAction } from "../../module/Auth/Login/LoginActions";
import { setOnLocalStorage } from "../../utils/localStorage";
import { STORAGE_INDEXES } from "../../utils/constants";

const Multievents = () => {
  const dispatch = useDispatch();
  const login = useSelector((state: any) => state.login);

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [active, setActive] = useState(false);
  const [openaction, setOpenAction] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const [page] = useState(1);
  const [limit] = useState(10);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      const res = await getRequest(`${PROVIDER.GET_EVENTS}?${qs.toString()}`);
      const evData = res?.data?.data ?? {};
      setStats(evData?.stats || {});
      const list = Array.isArray(evData?.events) ? evData.events : [];
      setEvents(list);

      const subscription = login?.user?.subscription;
      const freePlan = isFreePlan(subscription);

      if (freePlan) {
        if (list.length === 0) {
          setActive(true);
        } else if (list.length === 1) {
          fetchPlans();
          setTimeout(() => setPlanModal(true), 600);
        } else {
          toast.error("Free plan allows only 1 event.");
        }
      } else {
        // setActive(true);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, login]);

  const isFreePlan = (subscription: any) => {
    return subscription?.planName?.toLowerCase().includes("free");
  };
  const canCreateEvent = useCallback(() => {
    const sub = login?.user?.subscription;
    const isFree = !sub || isFreePlan(sub);
    const hasReachedLimit = events.length >= 1;

    if (isFree && hasReachedLimit) {
      fetchPlans();
      setPlanModal(true);
      return false;
    }

    return true;
  }, [login, events]);

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

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await getRequest(`${PROVIDER.PLANS}?subscriberType=client`);
      const data = res?.data?.data?.plans || [];
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to fetch plans");
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubscribe = async (
    planId: string,
    paymentOptionId: string,
    currency: string,
  ) => {
    setLoadingSubscription(true);
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
    } finally {
      setLoadingSubscription(false);
    }
  };

  const openDeleteModal = (event: any) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    setDeleting(true);
    try {
      await deleteRequest(`${PROVIDER.DELETE_EVENT}/${selectedEvent.eventId}`);
      setOpenModal(false);
      setSelectedEvent(null);
      fetchAll();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openaction) return;

      const ref = refs.current[openaction];
      if (ref && !ref.contains(e.target as Node)) {
        setOpenAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openaction]);
  useEffect(() => {
    const createParam = searchParams.get("create");

    if (createParam === "true") {
      setSelectedEvent(null);
      setActive(true);
    } else {
      setActive(false);
    }
  }, [searchParams]);
  useEffect(() => {
    fetchSubscription();
    fetchAll();
  }, []);

  // useEffect(() => {
  //   if (planModal) return;

  //   const createParam = searchParams.get("create");

  //   if (createParam === "true") {
  //     setSelectedEvent(null);
  //     setActive(true);
  //   } else {
  //     setActive(false);
  //   }
  // }, [searchParams, planModal]);

  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam !== "true") return;

    const sub = login?.user?.subscription;
    const isFree = !sub || isFreePlan(sub);
    const hasReachedLimit = events.length >= 1;

    if (isFree && hasReachedLimit) {
      const params = new URLSearchParams(searchParams);
      params.delete("create");
      setSearchParams(params);

      setActive(false);
      return;
    }

    setSelectedEvent(null);
    setActive(true);
  }, [searchParams, events, login]);

  useEffect(() => {
    if (planModal) {
      const params = new URLSearchParams(searchParams);
      params.delete("create");
      setSearchParams(params);
      setActive(false);
    }
  }, [planModal]);

  return (
    <>
      
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-6">
          <div className="space-y-4">
            <h1 className="text-2xl capitalize mb-0 font-bold dark:text-neutral-100">
              Mes événements
            </h1>
            <p className="text-gray-600 dark:text-neutral-400">
              Gérez tous vos événements depuis un seul endroit.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => {
                const sub = login?.user?.subscription;

                const isFree = !sub || isFreePlan(sub);
                const hasReachedLimit = events.length >= 1;

                if (isFree && hasReachedLimit) {
                  fetchPlans();
                  setPlanModal(true);
                  return;
                }

                const params = new URLSearchParams(searchParams);
                params.set("create", "true");
                setSearchParams(params);

                setSelectedEvent(null);
                setActive(true);
              }}
              variant="primary"
              size="medium"
            >
              Créer événement
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Événements totaux",
              icon: <Calendar size={30} />,
              count: stats?.totalEvents || 0,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Avenir",
              icon: <Clock size={30} />,
              count: stats?.comingSoonEvents || 0,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Budget total",
              icon: <EuroIcon size={30} />,
              count: stats?.totalBudget || 0,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Déjà dépensé",
              icon: <EuroIcon size={30} />,
              count: stats?.totalSpent || 0,
              color: "from-orange-500 to-orange-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`flex rounded-2xl bg-gradient-to-r ${card.color} text-white p-3`}
            >
              <div className="flex w-100">
                <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                  {card.icon}
                </div>
                <div className="ps-3.5 flex-1">
                  <div className="text-4xl font-bold mb-1">{card.count}</div>
                  <p className="capitalize mb-0">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Events List */}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4">
                <Skeleton height={160} className="rounded-xl mb-4" />
                <Skeleton count={4} />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center mt-20">
            <h3 className="text-gray-600 dark:text-neutral-400 text-lg">
              Aucun événement trouvé
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {events.map((event) => {
              const startDate = new Date(event.startDateTime);
              const date = startDate.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const time = startDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const taskProgress =
                event.tasks?.total > 0
                  ? (event.tasks.completed / event.tasks.total) * 100
                  : 0;
              const guestProgress =
                event.guests?.total > 0
                  ? (event.guests.accepted / event.guests.total) * 100
                  : 0;
              const budgetProgress =
                event.budget?.total > 0
                  ? ((event.budget.total - event.budget.balance) /
                      event.budget.total) *
                    100
                  : 0;

              return (
                <div
                  key={event.eventId}
                  className="bg-white dark:bg-darkmode rounded-2xl shadow-lg relative top-0 transition-linear duration-300 hover:-top-2"
                >
                  <div
                    className="text-white p-4 md:p-5 rounded-t-2xl h-40 relative z-10 before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/50 before:-z-1 before:rounded-t-2xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${encodeURI(event.thumbnail)}")`,
                    }}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex gap-3 justify-between">
                        <div>
                          <div className="text-lg sm:text-xl dark:text-neutral-100 font-semibold capitalize tracking-wider">
                            {event.name || "Event Name"}
                          </div>
                          <p className="text-white dark:text-neutral-400 text-sm capitalize">
                            {event.category || "Uncategorized"}
                          </p>
                        </div>
                        <div
                          className="relative"
                          ref={(el) => (refs.current[event.eventId] = el)}
                        >
                          <EllipsisVertical
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenAction(
                                openaction === event.eventId
                                  ? null
                                  : event.eventId,
                              )
                            }
                          />
                          {openaction === event.eventId && (
                            <div className="rounded-lg overflow-hidden shadow-2xl text-sm w-40 bg-white divide-y divide-gray-200 absolute right-0 text-mainclr z-50">
                              <span
                                className="flex items-center gap-1 p-2 hover:bg-gray-100 cursor-pointer"
                                role="button"
                                onClick={() =>
                                  navigate(
                                    `/client/event-details/${event.eventId}`,
                                  )
                                }
                              >
                                <Eye size={18} /> Voir les détails
                              </span>
                              <span
                                className="flex items-center gap-1 p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setActive(true);
                                }}
                              >
                                <Pencil size={18} /> Modifier
                              </span>
                              <span
                                className="flex items-center gap-1 p-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                role="button"
                                onClick={() => openDeleteModal(event)}
                              >
                                <Trash size={18} /> Supprimer
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-between mt-4 dark:text-neutral-400">
                        <span className="flex gap-1 text-xs sm:text-sm">
                          <Calendar size={20} className="shrink-0" /> {date}
                        </span>
                        <span className="flex gap-1 text-xs sm:text-sm">
                          <Clock size={20} className="shrink-0" /> {time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-3 gap-5">
                      {[
                        {
                          label: "Tâches",
                          icon: CircleCheckBig,
                          progress: taskProgress,
                          completed: event.tasks?.completed,
                          total: event.tasks?.total,
                        },
                        {
                          label: "Les invités",
                          icon: Users,
                          progress: guestProgress,
                          completed: event.guests?.accepted,
                          total: event.guests?.total,
                        },
                        {
                          label: "Budget",
                          icon: Euro,
                          progress: budgetProgress,
                          completed:
                            event.budget?.total - event.budget?.balance,
                          total: event.budget?.total,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-2 items-center"
                        >
                          <div className="text-center">
                            <span className="font-semibold dark:text-neutral-100 text-sm">
                              {item.label === "Budget"
                                ? `€${item.completed}/€${item.total}`
                                : `${item.completed || 0}/${item.total || 0}`}
                            </span>
                          </div>
                          <span className="text-gray-600 dark:text-neutral-400 text-center text-xs flex items-center gap-1">
                            <item.icon
                              size={16}
                              className="text-gray-600 dark:text-neutral-400 shrink-0"
                            />{" "}
                            {item.label}
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-full rounded-full"
                              style={{
                                width: `${Math.min(item.progress, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() =>
                        navigate(`/client/event-dashboard/${event.eventId}`)
                      }
                      size="medium"
                      className="mt-7 w-full rounded-md"
                    >
                      Gérer l'événement
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Edit Event Modal */}
        <CreateEvent
          fetchAll={fetchAll}
          setActive={setActive}
          active={active}
          selectedEvent={selectedEvent}
          mode={selectedEvent ? "edit" : "create"}
          canCreateEvent={canCreateEvent}
          planModal={planModal}
          setPlanModal={setPlanModal}
        />
      

      {/* Delete Modal */}

      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setOpenModal(false)}
          />
          <div className="mb-6 space-y-3">
          <h2 className="text-2xl font-bold text-center dark:text-neutral-100">
            Confirmer la suppression
          </h2>
          <p className="text-gray-600 text-center dark:text-neutral-300">
            Êtes-vous sûr de vouloir supprimer{" "}
            <span className="font-semibold text-red-600">
              {selectedEvent?.name}
            </span>
            ?
          </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button
              className="flex-1"  
              variant="outline"
              size="medium"
              onClick={() => setOpenModal(false)}
            >
              Annuler
            </Button>
            <Button
            className="flex-1"
              variant="danger"
              size="medium"
              disabled={deleting}
              onClick={handleDeleteConfirm}
            >
              {deleting ? "Suppression en cours..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal active={planModal} setActive={setPlanModal}>
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setPlanModal(false)}
          />

          <div className="mb-6 space-y-3">
            <h2 className="text-2xl font-bold text-center dark:text-neutral-100">
            Bien joué !<br/> Vous avez créé votre premier événemen
            </h2>
            <p className="text-center text-gray-600 dark:text-neutral-400">
              Passez à une offre supérieure pour débloquer plusieurs événements.
            </p>
          </div>

          {loadingPlans ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} height={120} borderRadius={12} />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-neutral-400">
              Aucun forfait disponible.
            </p>
          ) : (
            <div className="border border-gray-200 dark:border-neutral-700 rounded-xl p-6 transition-all">
              {plans.map((plan) =>
                plan.commitments.map((commit: any) =>
                  commit.payments.map((pay: any) => {
                    const priceData = pay.currencies?.[0];
                    return (
                      <>
                        <div
                          key={plan.id + pay.id}
                          className="flex flex-col md:flex-row gap-2 justify-between"
                        >
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100">
                              {plan.name}
                            </h3>
                            <p className="text-gray-600 dark:text-neutral-400 mb-4">
                              {plan.description}
                            </p>
                          </div>
                          <div className="md:text-end">
                            <p className="text-3xl font-bold text-gray-900 dark:text-neutral-300 mb-2">
                              €{priceData?.price}
                              <span className="text-sm dark:text-neutral-300">
                                {" "}
                                / month
                              </span>
                            </p>
                          </div>
                        </div>

                        <Button
                          size="large"
                          loading={loadingSubscription}
                          onClick={() =>
                            handleSubscribe(
                              plan.id,
                              pay.id,
                              priceData?.currency,
                            )
                          }
                          className="w-full mt-4"
                        >
                          Subscribe Now
                        </Button>
                      </>
                    );
                  }),
                ),
              )}
            </div>
          )}
        </div>
      </OuterModal>
    </>
  );
};

export default Multievents;
