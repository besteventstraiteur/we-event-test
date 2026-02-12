import { useEffect, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import {
  getRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import {
  CircleCheckBig,
  Clock,
  Lightbulb,
  Plus,
  Rocket,
  Search,
  Pencil,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import OuterModal from "../../components/Custommodal/OuterModal";
import CreateRoadmap from "../../module/Admin/Roadmap/createRoadmap";
import DataTable from "../../components/ui/Datatable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useToast } from "../../utils/toast";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function DeleteConfirmModal({ loading, open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <OuterModal active={open} setActive={onClose}>
      <div className="w-full max-w-xl mx-auto p-10 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
        <div className="mb-6 space-y-4 text-center">
          <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
            Êtes-vous sûr ?
          </h2>

          <p className="text-gray-600 dark:text-neutral-300">
            Cette action est irréversible.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="large"
            className="w-full"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            loading={loading}
            variant="danger"
            size="large"
            className="w-full"
            onClick={onConfirm}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </OuterModal>
  );
}

function SummaryCard({ icon, count, title, gradient }) {
  return (
    <div
      className={`flex rounded-2xl bg-gradient-to-r ${gradient} text-white p-3`}
    >
      <div className="flex w-full">
        <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
          {icon}
        </div>
        <div className="ps-3.5 flex-1">
          <div className="text-4xl font-bold mb-1">{count}</div>
          <p className="capitalize mb-0">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function Manageroadmap() {
  const [active, setActive] = useState(false);
  const [editRoadmap, setEditRoadmap] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapPage, setRoadmapPage] = useState(1);
  const [roadmapLimit, setRoadmapLimit] = useState(10);
  const [roadmapTotal, setRoadmapTotal] = useState(0);
  const [roadmapTotalPages, setRoadmapTotalPages] = useState(1);
  const [btnLoading, setButtonLoading] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackLimit, setFeedbackLimit] = useState(10);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("roadmap");
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    type: "roadmap",
    item: null,
  });
  const [viewModalActive, setViewModalActive] = useState(false);
  const [approveLoadingId, setApproveLoadingId] = useState(null);
  const [rejectLoadingId, setRejectLoadingId] = useState(null);


  const mapstatus = [
    { value: "planned", label: "Prévu" },
    { value: "inprogress", label: "En cours" },
    { value: "completed", label: "Complété" },
    { value: "on_hold", label: "En pause" },
    { value: "cancelled", label: "Annulé" },
  ];
  const roadmapColumns = [
    { key: "title", label: "Titre", render: (i) => <span>{i.title}</span> },
    {
      key: "category",
      label: "Catégorie",
      render: (i) => <span>{i.category || "-"}</span>,
    },
    {
      key: "phase",
      label: "Phase",
      render: (i) => <span>{i.phase || "-"}</span>,
    },
    {
      key: "progressRate",
      label: "Progrès",
      render: (i) => (
        <div className="flex items-center gap-2 w-36">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${i.progressRate}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{i.progressRate}%</span>
        </div>
      ),
    },
    {
      key: "likesCount",
      label: "Goûts",
      render: (i) => <span>{i.likesCount || 0}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (i) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            i.status === "planned"
              ? "bg-yellow-100 text-yellow-700"
              : i.status === "inprogress"
                ? "bg-blue-100 text-blue-700"
                : i.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
          }`}
        >
          {i.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (i) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditRoadmap(i)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Pencil className="w-4 h-4" />

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
            onClick={() =>
              setConfirmDelete({ open: true, type: "roadmap", item: i })
            }
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Trash2 className="w-4 h-4" />
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
      ),
    },
  ];

  const feedbackColumns = [
    { key: "title", label: "Titre", render: (i) => <span>{i.title}</span> },

    { key: "likesCount", label: "Goûts", render: () => <span>0</span> },
    {
      key: "isApproved",
      label: "Statut",
      render: (i) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            i.isApproved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {i.isApproved ? "approuvé" : "en attente"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (i) => (
        <div className="flex items-center gap-2">
          {!i.isApproved && (
            <button
              disabled={approveLoadingId === i.id}
              onClick={() => handleApproveFeedback(i)}
              className={`p-2 rounded-md relative group cursor-pointer ${
                approveLoadingId === i.id
                  ? "bg-green-400 cursor-wait"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {approveLoadingId === i.id ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 block" />
              ) : (
                <>
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
           opacity-0 group-hover:opacity-100
           bg-gray-800 text-white text-xs px-2 py-1 rounded
           transition-opacity duration-300 whitespace-nowrap"
                  >
                    Approuver
                  </span>
                  <CircleCheckBig className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {i.isApproved && (
            <button
              disabled={rejectLoadingId === i.id}
              onClick={() => handleDisapproveFeedback(i)}
              className={`p-2 rounded-md relative group cursor-pointer ${
                rejectLoadingId === i.id
                  ? "bg-red-400 cursor-wait"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {rejectLoadingId === i.id ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 block" />
              ) : (
                <>
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
           opacity-0 group-hover:opacity-100
           bg-gray-800 text-white text-xs px-2 py-1 rounded
           transition-opacity duration-300 whitespace-nowrap"
                  >
                    Rejeter
                  </span>
                  <X className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onViewFeedback(i)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 hover:dark:bg-neutral-700  border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Eye className="w-4 h-4" />
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
           opacity-0 group-hover:opacity-100
           bg-gray-800 text-white text-xs px-2 py-1 rounded
           transition-opacity duration-300 whitespace-nowrap"
            >
              Voir
            </span>
          </button>
          <button
            onClick={() =>
              setConfirmDelete({ open: true, type: "feedback", item: i })
            }
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 hover:dark:bg-neutral-700  border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Trash2 className="w-4 h-4" />
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
      ),
    },
  ];

  const fetchRoadmap = useCallback(
    async (p = roadmapPage) => {
      try {
        setRoadmapLoading(true);
        const query = new URLSearchParams({
          page: p,
          limit: roadmapLimit,
          search: debouncedSearch || "",
          ...(category ? { status: category } : {}),
        }).toString();

        const res = await getRequest(`${ADMIN.ROADMAP}?${query}`);
        fetchFeedback(); // <-- not needed inside here, see below
        const data = res?.data?.data;
        if (data?.posts) {
          setRoadmaps(data.posts);
          setRoadmapTotal(data.total);
          setRoadmapPage(data.page);
          setRoadmapTotalPages(data.totalPages);
        }
      } catch (e) {
        console.error("Error fetching roadmap:", e);
      } finally {
        setRoadmapLoading(false);
      }
    },
    [debouncedSearch, roadmapLimit, category, roadmapPage],
  );

  const fetchFeedback = useCallback(
    async (p = feedbackPage) => {
      try {
        setFeedbackLoading(true);
        const query = new URLSearchParams({
          page: p,
          limit: feedbackLimit,
          search: debouncedSearch || "",
        }).toString();

        const res = await getRequest(`${ADMIN.FEEDBACK}?${query}`);
        const data = res?.data?.data;
        if (data?.data) {
          setFeedbacks(data.data);
          setFeedbackTotal(data.total);
          setFeedbackPage(data.page);
          setFeedbackTotalPages(data.totalPages);
        }
      } catch (e) {
        console.error("Error fetching feedback:", e);
      } finally {
        setFeedbackLoading(false);
      }
    },
    [debouncedSearch, feedbackLimit],
  );

  useEffect(() => {
    if (activeTab === "roadmap") fetchRoadmap(1);
    else fetchFeedback(1);
  }, [activeTab, debouncedSearch, category]);

  useEffect(() => {
    if (activeTab === "roadmap") fetchRoadmap(roadmapPage);
  }, [roadmapPage, debouncedSearch, category, activeTab]);

  useEffect(() => {
    if (activeTab === "suggestions") fetchFeedback(feedbackPage);
  }, [feedbackPage, debouncedSearch, activeTab]);

  useEffect(() => {
    if (activeTab === "roadmap") fetchRoadmap(1);
    else fetchFeedback(1);
  }, [activeTab, debouncedSearch, category]);

  const onEditRoadmap = (item) => {
    setEditRoadmap(item);
    setActive(true);
  };
  const toast = useToast();
  const onViewFeedback = (item) => {
    setFeedbackData(item);
    setViewModalActive(true);
  };
  const handleApproveFeedback = async (item) => {
    try {
      setApproveLoadingId(item.id);
      await patchRequest(`${ADMIN.APPROVE_REJECT_FEEDBACK}/${item.id}/approve`);
      toast.success("Suggestion approuvée avec succès !");
      fetchFeedback();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l’approbation de la suggestion");
    } finally {
      setApproveLoadingId(null);
    }
  };

  const handleDisapproveFeedback = async (item) => {
    try {
      setRejectLoadingId(item.id);
      await patchRequest(
        `${ADMIN.APPROVE_REJECT_FEEDBACK}/${item.id}/disapprove`,
      );
      toast.success("Suggestion rejetée avec succès !");
      fetchFeedback();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du rejet de la suggestion");
    } finally {
      setRejectLoadingId(null);
    }
  };
  const handleDelete = async () => {
    setButtonLoading(true);
    const { type, item } = confirmDelete;
    if (!item) return;
    await deleteRequest(
      `${type === "roadmap" ? ADMIN.ROADMAP : ADMIN.APPROVE_REJECT_FEEDBACK}/${
        item.id
      }`,
    );
    setConfirmDelete({ open: false, type: "roadmap", item: null });
    type === "roadmap" ? fetchRoadmap() : fetchFeedback();
    setButtonLoading(false);
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Gérer la feuille de route
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérer la feuille de route et les suggestions.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Clock size={30} />}
          count={roadmaps?.filter((r) => r.status === "planned").length}
          title="Prévu"
          gradient="from-blue-500 to-blue-600"
        />
        <SummaryCard
          icon={<Rocket size={30} />}
          count={roadmaps.filter((r) => r.status === "inprogress").length}
          title="En cours"
          gradient="from-orange-500 to-orange-600"
        />
        <SummaryCard
          icon={<CircleCheckBig size={30} />}
          count={roadmaps.filter((r) => r.status === "completed").length}
          title="Complété"
          gradient="from-green-500 to-green-600"
        />
        <SummaryCard
          icon={<Lightbulb size={30} />}
          count={feedbacks.length}
          title="Suggestions"
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      <div className="flex">
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`px-4 py-2 font-medium text-sm cursor-pointer ${
            activeTab === "roadmap"
              ? "border-b-2 border-secondary text-secondary"
              : "text-gray-600 hover:text-secondary"
          }`}
        >
          Feuille de route
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2 font-medium text-sm cursor-pointer ${
            activeTab === "suggestions"
              ? "border-b-2 border-secondary text-secondary"
              : "text-gray-600 hover:text-secondary"
          }`}
        >
          Suggestions ({feedbackTotal})
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 my-6">
        <div className="relative">
          <Search className="absolute left-3 top-4 text-gray-400" size={20} />
          <InputGroup
            type="text"
            placeholder="Rechercher…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-10 bg-white min-w-80"
          />
        </div>
        <div>
          {activeTab === "roadmap" && (
            <CustomSelect
              options={mapstatus}
              value={mapstatus.find((o) => o.value === category) || null}
              onChange={(opt) => setCategory(opt?.value || "")}
              placeholder="Filtrer par statut"
              className="w-full min-w-60"
            />
          )}
        </div>
        {activeTab === "roadmap" && (
          <div>
            <Button
              onClick={() => {
                setEditRoadmap(null);
                setActive(true);
              }}
              variant="primary"
              className="!rounded-md !h-[49.6px]"
            >
              <Plus size={18} /> Ajouter une nouvelle feuille de route
            </Button>
          </div>
        )}
      </div>

      {activeTab === "roadmap" ? (
        roadmapLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                height={40}
                className="rounded-md dark:bg-gray-700"
              />
            ))}
          </div>
        ) : (
          <DataTable
            data={roadmaps}
            loading={roadmapLoading}
            page={roadmapPage}
            total={roadmapTotal}
            limit={roadmapLimit}
            onPageChange={setRoadmapPage}
            columns={roadmapColumns}
          />
        )
      ) : feedbackLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              height={40}
              className="rounded-md dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={feedbacks}
          loading={feedbackLoading}
          page={feedbackPage}
          total={feedbackTotal}
          limit={feedbackLimit}
          onPageChange={setFeedbackPage}
          columns={feedbackColumns}
        />
      )}

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full xl:max-w-3/5 mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            }}
          />
          {activeTab === "roadmap" ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 dark:text-neutral-100">
                {editRoadmap
                  ? "Modifier la feuille de route"
                  : "Nouvelle feuille de route"}
              </h2>

              <CreateRoadmap
                fetchRoadmap={fetchRoadmap}
                setActive={setActive}
                editData={editRoadmap}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-5">
                Détails de la suggestion
              </h2>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{feedbackData.title}</h2>
                <p className="text-gray-700">{feedbackData.description}</p>
                <p className="text-sm text-gray-500">
                  Créé le: {new Date(feedbackData.createdAt).toLocaleString()}
                </p>
                <p>
                  Statut:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feedbackData.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {feedbackData.isApproved ? "Approuvé" : "En attente"}
                  </span>
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setActive(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </OuterModal>

      <DeleteConfirmModal
        loading={btnLoading}
        open={confirmDelete.open}
        onClose={() =>
          setConfirmDelete({ open: false, type: "roadmap", item: null })
        }
        onConfirm={handleDelete}
      />
      <OuterModal active={viewModalActive} setActive={setViewModalActive}>
        <div className="w-full lg:max-w-2xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <h2 className="text-2xl font-semibold mb-6 dark:text-neutral-100">
            Détails de la suggestion
          </h2>
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setViewModalActive(false)}
          />
          {feedbackData ? (
            <div className="space-y-3 dark:text-neutral-300">
              <h3 className="text-lg dark:text-neutral-300 font-semibold">
                {feedbackData.title}
              </h3>
              <p>{feedbackData.description}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Créé le: {new Date(feedbackData.createdAt).toLocaleString()}
              </p>
              <p>
                Statut:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feedbackData.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {feedbackData.isApproved ? "Approuvé" : "En attente"}
                </span>
              </p>
            </div>
          ) : (
            <p>Chargement...</p>
          )}
        </div>
      </OuterModal>
    </>
  );
}
