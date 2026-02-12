import {
  Check,
  DollarSign,
  Plus,
  X,
  Users,
  ClipboardCheck,
  Globe,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import OuterModal from "../../components/Custommodal/OuterModal";
import CreateTask from "./Createtasks";
import CountdownTimer from "./Countdown";
import { useNavigate, useParams } from "react-router-dom";
import { PROVIDER } from "../../utils/endPoints";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useToast } from "../../utils/toast";

const EventDashboard = () => {
  const [active, setActive] = useState(false);
  const { id } = useParams();
  const user = useSelector((state) => state?.login?.user);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [btnloading, setbtnLoading] = useState(false);

  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = async () => {
    try {
      setQuotesLoading(true);
      const response = await getRequest(
        `${PROVIDER.REQUEST_QUOTE}?eventId=${id}`
      );
      const data = response?.data?.data ?? [];
      setQuotes(data);
    } catch (err) {
      console.error("Failed to fetch quotes", err);
      setQuotes([]);
    }
    setQuotesLoading(false);
  };
  // -----------------------------------------------------------

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await getRequest(`${PROVIDER.GET_EVENT_BY_ID}/${id}`);
      const payload = resp?.data?.data ?? resp?.data ?? null;
      if (payload) {
        setEvent(payload);
      } else {
        setError("No event data found.");
      }
    } catch (e) {
      setError(e?.message || "Failed to fetch event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchQuotes();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    document.documentElement.style.overflow = active ? "hidden" : "auto";
  }, [active]);

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmitTask = async (values: any) => {
    setbtnLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        date: values.date?.toISOString(),
        priority: values.priority,
        eventId: Number(id),
      };

      await postRequest(`${PROVIDER.TASKS}`, payload);
      toast.success("Tâche ajoutée avec succès");

      setActive(false);
      fetchEventDetails();
    } catch (error) {
      toast.error("Échec de l’enregistrement de la tâche");
    }
    setbtnLoading(false);
  };

  const stats = event?.stats || {};
  const budgetUsed = stats?.used_budget || 0;
  const budgetTotal = stats?.total_budget || 0;
  const guestAccepted = stats?.total_guest_accepted || 0;
  const guestTotal = stats?.total_guest || 0;
  const taskCompleted = stats?.total_task_completed || 0;
  const taskTotal = stats?.total_task || 0;
  const isSiteDeveloped = stats?.is_site_developed || false;

  const getProgress = (used, total) => {
    if (!total || total === 0) return 0;
    return Math.min((used / total) * 100, 100);
  };

  const handleToggleComplete = async (task) => {
    try {
      setUpdatingTaskId(task.id);

      setEvent((prev) => {
        const updatedTasks = prev.tasks.map((t) =>
          t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return { ...prev, tasks: updatedTasks };
      });

      await patchRequest(`${PROVIDER.TASKS}/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted,
        eventId: Number(id),
      });

      toast.success(
        `Tâche marquée comme ${!task.isCompleted ? "Terminé" : "Incomplet"}`
      );
      await fetchEventDetails();
    } catch {
      toast.error("Échec de la mise à jour du statut de la tâche");
    } finally {
      setUpdatingTaskId(null);
    }
  };
  const statusClasses = {
    pending: "text-yellow-600 bg-yellow-100",
    accepted: "text-green-600 bg-green-100",
    rejected: "text-red-600 bg-red-100",
  };
  return (
    <>
      
        <div className="mb-6">
          {loading ? (
            <div>
              <Skeleton width={250} height={28} className="mb-2" />
              <Skeleton width={200} height={20} />
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-neutral-300 capitalize">
              Votre tableau de bord d’événement:{" "}
                <span className="text-secondary dark:text-neutral-400 font-semibold">{event?.name || "N/A"}</span>
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            <Skeleton height={100} className="rounded-xl" />
          ) : (
            <CountdownTimer
              endDate={event?.endDateTime}
              startDate={event?.startDateTime}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} height={140} className="rounded-2xl" />
              ))
            ) : (
              <>
                <StatCard
                  title="Budget dépensé"
                  icon={<DollarSign size={20} />}
                  color="bg-green-500"
                  used={budgetUsed}
                  total={budgetTotal}
                  unit="€"
                  progress={getProgress(budgetUsed, budgetTotal)}
                  onClick={() => navigate(`/client/budget/${id}`)}
                />
                <StatCard
                  title="Invités confirmés"
                  icon={<Users size={20} />}
                  color="bg-blue-500"
                  used={guestAccepted}
                  total={guestTotal}
                  onClick={() => navigate(`/client/guests/${id}`)}
                />
                <StatCard
                  title="Tâches terminées"
                  icon={<ClipboardCheck size={20} />}
                  color="bg-purple-500"
                  used={taskCompleted}
                  total={taskTotal}
                  onClick={() => navigate(`/client/tasks/${id}`)}
                />
                <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 hover:shadow-md transition-all">
                  <div className="flex flex-col gap-1 pr-5">
                      <div className="text-gray-500 dark:text-neutral-400 text-sm">Mini-Site</div>
                    <h3 className="text-3xl font-bold dark:text-neutral-300">
                      {isSiteDeveloped ? "En ligne" : "Hors ligne"}
                    </h3>
                    <p
                      className={`text-sm underline cursor-pointer ${
                        isSiteDeveloped
                          ? "text-blue-600"
                          : "text-secondary hover:text-tertiary"
                      }`}
                      onClick={() =>
                        navigate(
                          `/client/mini-site-editor/${id}${
                            !isSiteDeveloped ? "?type=create" : ""
                          }`
                        )
                      }
                    >
                      {isSiteDeveloped ? "Modifier le site web" : "Créer le site web"}
                    </p>
                  </div>
                  <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-pink-500 text-white">
                    <Globe size={20} />
                  </span>
                </div>
              </>
            )}
          </div>

          {/* -------------------- Quote Pending Section ------------------- */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white dark:bg-darkmode p-4 rounded-2xl">
              {/* task list ... (unchanged) */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                <div>
                <span className="text-xl heading-font font-semibold mb-0 block dark:text-neutral-100">
                 Liste des tâches
                </span>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                {taskCompleted} tâches effectuées sur {taskTotal}
              </p>
              </div>

                <Button size="small" onClick={() => setActive(true)}>
                  <Plus size={18} /> Ajouter des tâches
                </Button>
              </div>

              

              {loading ? (
                <div className="space-y-4 mt-6">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} height={40} className="rounded-md" />
                  ))}
                </div>
              ) : event?.tasks?.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {event.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col-reverse sm:flex-row justify-between items-start gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() =>
                            !updatingTaskId && handleToggleComplete(task)
                          }
                          disabled={updatingTaskId === task.id}
                          className="w-5 h-5 shrink-0 border border-gray-400 rounded-sm flex items-center justify-center"
                        >
                          {updatingTaskId === task.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          ) : task.isCompleted ? (
                            <span className="bg-blue-600 w-full h-full flex items-center justify-center rounded-sm">
                              <Check className="text-white w-4 h-4" />
                            </span>
                          ) : null}
                        </button>
                        <div className="flex flex-col items-start sm:flex-row gap-2">
                        <span
                          className={`text-sm ${
                            task.isCompleted
                              ? "line-through text-gray-500 dark:text-neutral-400"
                              : "text-gray-800 dark:text-neutral-400"
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 capitalize">
                          {task.priority === "average"
                            ? "Normal"
                            : task.priority}
                        </span>
                        </div>
                      </div>
                      <span className="text-gray-600 dark:text-neutral-400 text-sm">
                        {formatDate(task.date)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        navigate(`/client/tasks/${id}`);
                      }}
                      className="gap-4"
                    >
                      Voir toutes les tâches
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-neutral-400 text-center py-5">
                  Aucune tâche disponible.
                </p>
              )}
            </div>

            {/* ----------------------- QUOTE PENDING BOX ---------------------------- */}
            <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
              <span className="text-xl heading-font font-semibold mb-4 block dark:text-neutral-100">
                Devis en attente
              </span>

              {quotesLoading ? (
                <>
                  <Skeleton height={50} width={50} circle className="mx-auto" />
                  <Skeleton height={20} width={200} className="mx-auto mt-3" />
                  <Skeleton
                    height={36}
                    width={180}
                    className="mx-auto mt-5 rounded-md"
                  />
                </>
              ) : quotes?.length === 0 ? (
                <>
                  <DollarSign size={40} className="text-gray-500 mx-auto" />
                  <p className="text-gray-600 dark:text-neutral-300 text-sm mb-6 text-center">
                    Aucun devis à valider pour le moment.
                  </p>
                  <Button
                    onClick={() => navigate("/partners")}
                    size="medium"
                    variant="outline"
                    className="w-full"
                  >
                   Rechercher des prestataires de services
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                    {quotes.map((q) => (
                      <div
                        key={q.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 p-3 border border-borderlight dark:border-neutral-700
                         rounded-lg bg-gray-50 dark:bg-neutral-800"
                      >
                        <div>
                          <p className="text-sm font-medium dark:text-neutral-300" data-no-translate>
                            {q?.business?.name}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${
                            statusClasses[q?.status]
                          }`}
                          data-no-translate
                        >
                          {q?.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => navigate(`/client/requests/${id}`)}
                    size="medium"
                    className="w-full mt-4"
                  >
                    Voir toutes les demandes
                  </Button>
                </>
              )}
            </div>
            {/* ---------------------------------------------------------------------- */}
          </div>
        </div>
      

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setActive(false)}
          />
          <CreateTask onSubmit={handleSubmitTask} loading={btnloading} />
        </div>
      </OuterModal>
    </>
  );
};

// ------------------ StatCard Component ------------------

const StatCard = ({
  title,
  used,
  total,
  progress,
  icon,
  color,
  unit = "",
  onClick,
}) => {
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all
        ${
          isClickable
            ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
            : "hover:shadow-md"
        }
      `}
    >
      <div className="flex flex-col gap-1 pr-5">
        <div className="text-gray-500 dark:text-neutral-400 text-sm">{title}</div>
        <h3 className="text-3xl font-bold dark:text-neutral-300">
          {used} {unit}
        </h3>
        <p className="text-sm text-gray-600 dark:text-neutral-300">
          sur {total || 0} {unit}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className={`${color} h-full rounded-full`}
            style={{ width: `${progress ?? (used / (total || 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      <span
        className={`absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center ${color} text-white`}
      >
        {icon}
      </span>
    </div>
  );
};

export default EventDashboard;
