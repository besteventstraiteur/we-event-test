import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import {
  CircleCheckBig,
  Clock,
  Heart,
  Lightbulb,
  Plus,
  Rocket,
  Search,
  Users,
  X,
} from "lucide-react";
import CreateSuggestion from "../../module/Provider/Roadmap/CreateSuggestion";
import { useToast } from "../../utils/toast";
import { PROVIDER } from "../../utils/endPoints";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import CustomDatePicker from "../../components/DatePicker";

function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function Roadmap() {
  const [active, setActive] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [roadmapData, setRoadmapData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const months = [
    { value: "2025-01,January", label: "January" },
    { value: "2025-02,February", label: "February" },
    { value: "2025-03,March", label: "March" },
    { value: "2025-04,April", label: "April" },
    { value: "2025-05,May", label: "May" },
    { value: "2025-06,June", label: "June" },
    { value: "2025-07,July", label: "July" },
    { value: "2025-08,August", label: "August" },
    { value: "2025-09,September", label: "September" },
    { value: "2025-10,October", label: "October" },
    { value: "2025-11,November", label: "November" },
    { value: "2025-12,December", label: "December" },
  ];

  const toast = useToast();
  const debouncedSearch = useDebounce(search, 600);

  const priority = [
    { value: "low", label: "Faible" },
    { value: "medium", label: "Moyen" },
    { value: "high", label: "Haute" },
    { value: "urgent", label: "Critique" },
  ];

  const fetchRoadmap = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (status) params.append("priority", status);
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        params.append("date", formattedDate);
      }
      if (startDate)
        params.append("startDate", startDate.toISOString().split("T")[0]);
      if (endDate)
        params.append("endDate", endDate.toISOString().split("T")[0]);

      const baseUrl = `${
        PROVIDER.ROADMAP
      }?${params.toString()}&page=1&limit=100`;
      const finalUrl =
        selectedMonth && selectedMonth.includes(",")
          ? `${baseUrl}&month=${selectedMonth}`
          : baseUrl;

      const [resRoadmap, resSuggestion] = await Promise.all([
        getRequest(finalUrl),
        getRequest(`${PROVIDER.FEEDBACK}`),
      ]);

      const roadmapData = resRoadmap?.data?.data || {};
      const feedbackData = resSuggestion?.data?.data || {};

      setRoadmapData({
        comingSoon: roadmapData.comingSoon || [],
        inProgress: roadmapData.inProgress || [],
        finished: roadmapData.finished || [],
        cards: roadmapData.cards || {},
      });

      setSuggestions(feedbackData.posts || []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de récupérer les données de la feuille de route");
    } finally {
      setLoading(false);
    }
  };

  console.log(roadmapData, "roadmapDatasdns");
  useEffect(() => {
    fetchRoadmap();
  }, [debouncedSearch, status, startDate, endDate]);

  const handleAddSuggestion = async (data: any) => {
    setAddLoading(true);
    try {
      const res = await postRequest(`${PROVIDER.ADD_SUGESTION}`, data);
      if (res.status === 201) {
        setActive(false);
        toast.success(res?.data?.message || "Suggestion added!");
        fetchRoadmap();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add suggestion");
    } finally {
      setAddLoading(false);
    }
  };

  const handleLikeToggle = async (id: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked
        ? `${PROVIDER.ROADMAP_OLD}/${id}/unlike`
        : `${PROVIDER.ROADMAP_OLD}/${id}/like`;

      await postRequest(endpoint);

      // Optimistic UI update
      setRoadmapData((prev: any) => ({
        ...prev,
        comingSoon: prev.comingSoon.map((item: any) =>
          item.id === id
            ? {
                ...item,
                isLiked: !item.isLiked,
                likesCount: item.isLiked
                  ? item.likesCount - 1
                  : item.likesCount + 1,
              }
            : item,
        ),
        inProgress: prev.inProgress.map((item: any) =>
          item.id === id
            ? {
                ...item,
                isLiked: !item.isLiked,
                likesCount: item.isLiked
                  ? item.likesCount - 1
                  : item.likesCount + 1,
              }
            : item,
        ),
        finished: prev.finished.map((item: any) =>
          item.id === id
            ? {
                ...item,
                isLiked: !item.isLiked,
                likesCount: item.isLiked
                  ? item.likesCount - 1
                  : item.likesCount + 1,
              }
            : item,
        ),
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to like/unlike");
    }
  };

  const handleLikeToggleFeedback = async (id: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked
        ? `${PROVIDER.ADD_SUGESTION}/${id}/unlike`
        : `${PROVIDER.ADD_SUGESTION}/${id}/like`;

      await postRequest(endpoint);

      // Optimistic UI update
      setSuggestions((prev: any[]) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isLiked: !item.isLiked,
                likesCount: item.isLiked
                  ? item.likesCount - 1
                  : item.likesCount + 1,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to like/unlike");
    }
  };

  const planned = roadmapData?.comingSoon || [];
  const inprogress = roadmapData?.inProgress || [];
  const completed = roadmapData?.finished || [];

  const renderEmptyState = (icon: JSX.Element, message: string) => (
    <div className="border-dashed border-2 border-gray-200 dark:border-neutral-700 rounded-2xl relative p-10 flex flex-col justify-between gap-7 cursor-pointer hover:shadow-lg">
      <div className="text-center flex justify-center flex-col items-center gap-6">
        {icon}
        <p className="text-gray-600 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  );
  return (
    <>
      <div className="mb-6 space-y-3">
        <h1 className="text-2xl font-bold dark:text-neutral-100">
          Feuille de route
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Découvrez les fonctionnalités à venir et proposez vos idées
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={120}
                  className="rounded-2xl"
                  baseColor="#f3f4f6"
                  highlightColor="#e5e7eb"
                />
              ))
          : [
              {
                label: "Prévu",
                icon: <Clock size={30} />,
                count: roadmapData?.cards?.planned || 0,
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "Progrès",
                icon: <Rocket size={30} />,
                count: roadmapData?.cards?.inprogress || 0,
                color: "from-orange-500 to-orange-600",
              },
              {
                label: "Complété",
                icon: <CircleCheckBig size={30} />,
                count: roadmapData?.cards?.completed || 0,
                color: "from-green-500 to-green-600",
              },
              {
                label: "Suggestions",
                icon: <Lightbulb size={30} />,
                count: roadmapData?.cards?.suggestions || 0,
                color: "from-purple-500 to-purple-600",
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

      <div className="flex flex-col md:flex-row gap-3 my-10">
        <div className="relative">
          <Search className="absolute left-3 top-4 text-gray-400" size={20} />
          <InputGroup
            type="text"
            placeholder="Consulter la feuille de route"
            className="ps-10 bg-white min-w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <CustomSelect
            options={priority}
            value={priority.find((opt) => opt.value === status) || null}
            onChange={(option) => setStatus(option?.value || "")}
            placeholder="Sélectionner la priorité"
            className="w-full min-w-60"
          />
        </div>

        <div>
          <CustomDatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) =>
              setDateRange(update)
            }
            placeholderText="Sélectionner la période"
            className="w-full min-w-60"
            isClearable
            monthsShown={2} // ✅ show 2 months side by side
            showPopperArrow={false} // optional, cleaner look
            dateFormat="dd MMM yyyy"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                height={220}
                className="rounded-2xl"
                baseColor="#f3f4f6"
                highlightColor="#e5e7eb"
              />
            ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Planned */}
          <div className="space-y-4">
            <h2 className="mb-6 flex gap-2 items-center text-xl font-semibold dark:text-neutral-100">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 w-3.5 h-3.5 rounded-full inline-block"></span>
              Avenir
              <span className="flex justify-center items-center text-xs bg-blue-200 w-7 h-7 rounded-full ms-5 dark:text-black">
                {roadmapData?.cards?.planned || 0}
              </span>
            </h2>

            {planned.length === 0
              ? renderEmptyState(
                  <Clock size={40} className="text-gray-400" />,
                  `Les fonctionnalités prévues apparaîtront ici au fur et à mesure de leur ajout.`,
                )
              : planned.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl relative p-4 flex flex-col justify-between gap-7 cursor-pointer hover:shadow-lg"
                  >
                    <div>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs absolute right-3 top-3">
                        Prévu
                      </span>
                      <Clock size={24} className="text-gray-400" />
                      <span className="text-lg font-semibold block mt-3 dark:text-neutral-300">
                        {item.title}
                      </span>
                      <p className="text-gray-600 mt-1 text-sm dark:text-neutral-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start justify-between">
                      <div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-600 block mt-1 dark:text-neutral-300">
                          Phase ({item.phase})
                        </span>
                        <span className="text-sm">
                          Date d’échéance (
                          {new Date(item.dueDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          )
                        </span>
                      </div>
                      <label
                        onClick={() => handleLikeToggle(item.id, item.isLiked)}
                        className="text-xs shrink-0 flex gap-1 items-center cursor-pointer dark:text-neutral-300 transition-all"
                      >
                        <Heart
                          size={18}
                          className={`${
                            item.isLiked
                              ? "fill-red-600 stroke-red-600"
                              : "dark:stroke-white"
                          }`}
                        />{" "}
                        {item.likesCount}
                      </label>
                    </div>
                  </div>
                ))}
          </div>

          <div className="space-y-4">
            <h2 className="mb-6 flex gap-2 items-center text-xl font-semibold dark:text-neutral-300">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 w-3.5 h-3.5 rounded-full inline-block"></span>
              En cours
              <span className="flex justify-center items-center text-xs bg-orange-200 w-7 h-7 rounded-full ms-5 dark:text-black">
                {roadmapData?.cards?.inprogress}
              </span>
            </h2>

            {roadmapData?.cards?.inprogress === 0
              ? renderEmptyState(
                  <Rocket size={40} className="text-gray-400" />,
                  "Les développements en cours apparaîtront ici bientôt",
                )
              : inprogress.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl relative p-4 flex flex-col justify-between gap-7 cursor-pointer hover:shadow-lg"
                  >
                    <div>
                      <span className="bg-orange-600 text-white dark:text-neutral-100 px-3 py-1 rounded-full text-xs absolute right-3 top-3">
                        En cours
                      </span>
                      <Rocket size={24} className="text-gray-400" />
                      <span className="text-lg font-semibold block mt-3 dark:text-neutral-100">
                        {item.title}
                      </span>
                      <p className="text-gray-600 mt-1 text-sm dark:text-neutral-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start justify-between">
                      <div>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-600 block mt-1 dark:text-neutral-300">
                          Phase ({item.phase})
                        </span>
                        <span className="text-sm dark:text-neutral-400">
                          Date d’échéance (
                          {new Date(item.dueDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          )
                        </span>
                      </div>
                      <label
                        onClick={() => handleLikeToggle(item.id)}
                        className="text-xs shrink-0 flex gap-1 items-center cursor-pointer dark:text-neutral-300 transition-all"
                      >
                        <Heart
                          size={18}
                          className={`${
                            item.isLiked
                              ? "fill-red-600 stroke-red-600"
                              : "dark:stroke-white"
                          }`}
                        />{" "}
                        {item.likesCount}
                      </label>
                    </div>
                  </div>
                ))}
          </div>

          {/* Completed */}
          <div className="space-y-4">
            <h2 className="mb-6 flex gap-2 items-center text-xl font-semibold dark:text-neutral-100">
              <span className="bg-gradient-to-r from-green-500 to-green-600 w-3.5 h-3.5 rounded-full inline-block"></span>
              Complété
              <span className="flex justify-center items-center text-xs bg-green-200 w-7 h-7 rounded-full ms-5 dark:text-black">
                {completed.length}
              </span>
            </h2>

            {completed.length === 0
              ? renderEmptyState(
                  <CircleCheckBig size={40} className="text-gray-400" />,
                  "Les fonctionnalités terminées apparaîtront ici une fois déployées",
                )
              : completed.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl relative p-4 flex flex-col justify-between gap-7 cursor-pointer hover:shadow-lg"
                  >
                    <div>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs absolute right-3 top-3">
                        Complété
                      </span>
                      <CircleCheckBig size={24} className="text-gray-400" />
                      <span className="text-lg font-semibold block mt-3 dark:text-neutral-100">
                        {item.title}
                      </span>
                      <p className="text-gray-600 mt-1 text-sm dark:text-neutral-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start justify-between">
                      <div>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-600 block mt-1 dark:text-neutral-300">
                          Phase ({item.phase})
                        </span>
                      </div>
                      <label
                        onClick={() => handleLikeToggle(item.id)}
                        className="text-xs shrink-0 flex gap-1 items-center cursor-pointer dark:text-neutral-300 transition-all"
                      >
                        <Heart
                          size={18}
                          className={`${
                            item.isLiked
                              ? "fill-red-600 stroke-red-600"
                              : "dark:stroke-white"
                          }`}
                        />{" "}
                        {item.likesCount}
                      </label>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Community Ideas */}
      <div className="flex items-start justify-between gap-3 mt-10 mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-neutral-100">
            Idées communautaires
          </h2>
          <p className="text-gray-600 mt-1 dark:text-neutral-300">
            Votez pour les idées qui vous tiennent à cœur.
          </p>
        </div>

        <Button variant="primary" size="medium" onClick={() => setActive(true)}>
          <Plus size={20} className="mr-3" /> Proposer une idée
        </Button>
      </div>

      {loading ? (
        <Skeleton
          height={200}
          count={3}
          className="rounded-2xl mb-4"
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
        />
      ) : (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((s: any) => (
            <div
              key={s.id}
              className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl relative p-4 flex flex-col justify-between gap-7 cursor-pointer hover:shadow-lg"
            >
              <div>
                <span className="bg-green-100 text-green-600 font-medium px-3 py-1 rounded-full text-xs absolute right-3 top-3">
                  {s.isApproved ? "Approuvé" : "En attente"}
                </span>
                <Lightbulb size={24} className="text-gray-400" />
                <span className="text-lg capitalize font-semibold block mt-3 dark:text-neutral-100">
                  {s.title}
                </span>
                <p className="text-gray-600 mt-1 text-sm dark:text-neutral-300">
                  {s.description}
                </p>
              </div>
              <div className="flex gap-2 items-start justify-between">
                <span className="text-xs text-gray-600 block mt-1 dark:text-neutral-300">
                  Soumis • {new Date(s.createdAt).toLocaleDateString()}
                </span>
                <label
                  onClick={() => handleLikeToggleFeedback(s.id, s.isLiked)}
                  className="shrink-0 flex gap-1 items-center cursor-pointer transition-all text-xs dark:text-neutral-300"
                >
                  <Heart
                    size={18}
                    className={`${
                      s.isLiked
                        ? "fill-red-600 stroke-red-600"
                        : "dark:stroke-white"
                    }`}
                  />{" "}
                  {s?.likesCount || 0}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length == 0 && (
        <div className="text-center w-full bg-secondary/100 hover:bg-secondary/95 dark:bg-darkmode/95 rounded-2xl relative p-10 flex flex-col items-center justify-between cursor-pointer transition duration-300">
          <Users size={40} className="text-white mx-auto mb-4" />
          <p className="text-white dark:text-neutral-300 text-2xl font-bold mb-0">
            Votre voix compte
          </p>
          <p className="text-white dark:text-neutral-300">
            Chaque vote et suggestion nous aide à construire une meilleure
            plateforme pour vous. Continuez à partager vos idées !
          </p>
          <Button
            variant="primary"
            size="medium"
            onClick={() => setActive(true)}
            className="mt-8 border"
          >
            <Plus size={20} className="mr-3" />
            Suggérer une idée
          </Button>
        </div>
      )}

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            }}
          />
          <CreateSuggestion
            onSubmit={handleAddSuggestion}
            loading={addLoading}
          />
        </div>
      </OuterModal>
    </>
  );
}

export default Roadmap;
