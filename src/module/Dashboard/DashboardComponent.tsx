import { useState, useEffect } from "react";
import React from "react";
import Button from "../../components/ui/Button";
import CreateEvent from "./CreateEvent";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CLIENT, PROVIDER } from "../../utils/endPoints";
import managmenticon from "../../assets/images/managment-icon.svg";
import minisiteicon from "../../assets/images/minisite-icon.svg";
import trackingicon from "../../assets/images/tracking-icon.svg";
import { getRequest } from "../../utils/http-client/axiosClient";
import Slider from "../Homepage/Slider";
import Eventthumb from "../../assets/images/event.webp";
import { Calendar, Clock } from "lucide-react";
import CustomSelect from "../../components/ui-main/selectBox";

const phase = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
];

function DashboardComponent() {
  const [active, setActive] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [singleEvent, setSingleEvent] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const login = useSelector((state: any) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [active]);

  const fetchDashboard = async () => {
    try {
      const res = await getRequest(CLIENT.DASHBOARD);
      if (res?.data?.data) setDashboardData(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await getRequest(`${PROVIDER.GET_EVENTS}?page=1&limit=3`);
      const data = res?.data?.data;

      if (!data?.events?.length) {
        setEvents([]);
        return;
      }

      setEvents(data.events);

      if (data.events.length === 1) {
        fetchSingleEvent(data.events[0].eventId);
      }
    } catch (e) {
      console.log("Error loading events", e);
    }
  };

  const fetchSingleEvent = async (id: number) => {
    try {
      const res = await getRequest(`${PROVIDER.GET_EVENT_BY_ID}/${id}`);
      setSingleEvent(res?.data?.data);
    } catch (e) {
      console.log("Error loading event", e);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchEvents();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const res = await getRequest(PROVIDER.GET_ALL_SERVICES);

      if (res?.status === 200 && Array.isArray(res?.data?.data?.services)) {
        const opts = res.data.data.services
          .map((c) => ({
            value: c.id,
            label: c.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCategories(opts);
      } else {
        setCategories([]);
      }
    } catch (e) {
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* Greeting */}
      <div className="mb-8">
        <p
          className="text-gray-600 dark:text-neutral-300 mt-1 text-center text-lg"
          data-no-translate
        >
          Prêt(e) à organiser l’événement de vos rêves ?{" "}
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative z-10 pt-14 px-5 md:p-14 pb-0 rounded-2xl before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-[80%] before:bg-primary dark:before:bg-darkmode before:-z-1 before:rounded-3xl">
          {singleEvent && (
            <div className="single-event max-w-[840px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[320px_2fr] gap-3 items-start">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg">
                  <div
                    className="text-white dark:text-neutral-100 p-4 md:p-5 rounded-t-2xl h-40 relative z-10 before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-secondary/60 before:-z-1 before:rounded-t-2xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        singleEvent.thumbnail || Eventthumb
                      })`,
                    }}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white dark:text-neutral-100 capitalize">
                          {singleEvent.name}
                        </h3>
                        <p className="text-sm capitalize dark:text-neutral-400">
                          {singleEvent.category}
                        </p>
                      </div>
                      <div className="flex justify-between mt-4 text-sm dark:text-neutral-400">
                        <span className="flex gap-1">
                          <Calendar size={16} />{" "}
                          {formatDate(singleEvent.startDateTime)}
                        </span>
                        <span className="flex gap-1">
                          <Clock size={16} />{" "}
                          {formatTime(singleEvent.startDateTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row gap-3 justify-between">
                    <Button
                      className="text-xs"
                      onClick={() =>
                        navigate(`/client/event-dashboard/${singleEvent.id}`)
                      }
                    >
                      Gérer l’événement
                    </Button>
                    <Button
                      className="text-xs"
                      variant="outline"
                      onClick={() => navigate(`/partners`)}
                    >
                      Vos prestataires
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to={`/client/budget/${singleEvent.id}`}>
                    <Stat
                      title="Budget dépensé"
                      value={`${singleEvent.stats.used_budget}€`}
                      percent={
                        (singleEvent.stats.used_budget /
                          singleEvent.stats.total_budget) *
                        100
                      }
                    />
                  </Link>
                  <Link to={`/client/guests/${singleEvent.id}`}>
                    <Stat
                      title="Invités confirmés"
                      value={singleEvent.stats.total_guest_accepted}
                      percent={
                        (singleEvent.stats.total_guest_accepted /
                          singleEvent.stats.total_guest) *
                        100
                      }
                    />
                  </Link>

                  <Link to={`/client/tasks/${singleEvent.id}`}>
                    <Stat
                      title="Tâches terminées"
                      value={singleEvent.stats.total_task_completed}
                      percent={
                        (singleEvent.stats.total_task_completed /
                          singleEvent.stats.total_task) *
                        100
                      }
                    />
                  </Link>

                  <Link to={`/client/mini-site-editor/${singleEvent.id}`}>
                    <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg">
                      <h4 className="text-sm dark:text-neutral-300">
                        Mini-site
                      </h4>
                      <span
                        className={`font-bold ${
                          singleEvent.stats.is_site_developed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {singleEvent.stats.is_site_developed
                          ? "En ligne"
                          : "Non créé"}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {events.length > 1 && (
            <div className="multievent-section">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {events.map((ev) => (
                  <div
                    key={ev.eventId}
                    className="bg-white dark:bg-black rounded-2xl shadow"
                  >
                    <div
                      className="text-white p-4 md:p-5 rounded-t-2xl h-40 relative z-10 before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-secondary/60 before:-z-1 before:rounded-t-2xl bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${ev.thumbnail || Eventthumb})`,
                      }}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex gap-3 justify-between">
                          <div>
                            <div className="text-lg font-semibold capitalize">
                              {ev.name}
                            </div>
                            <p className="text-white text-sm capitalize">
                              {ev.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-between mt-4">
                          <span className="flex gap-1 text-xs sm:text-sm">
                            <Calendar size={20} className="shrink-0" />{" "}
                            {formatDate(ev.startDateTime)}
                          </span>
                          <span className="flex gap-1 text-xs sm:text-sm">
                            <Clock size={20} className="shrink-0" />{" "}
                            {formatTime(ev.startDateTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row gap-3 justify-between">
                      <Button
                        className="text-xs w-full"
                        onClick={() =>
                          navigate(`/client/event-dashboard/${ev.eventId}`)
                        }
                      >
                        Gérer l’événement
                      </Button>
                      <Button className="text-xs w-full" variant="outline">
                        Vos prestataires
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Link
                  to="/client/multi-events"
                  className="bg-[#1C7B6D] text-white px-5 py-2 rounded-xl"
                >
                  Voir tous mes événements
                </Link>
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="text-center">
              <h2 className="text-4xl text-secondary dark:text-neutral-300">
                Bienvenue sur We Events !
              </h2>
              <p className="text-gray-600 text-lg my-5">
                Vous êtes à quelques clics de créer l’événement parfait !
              </p>
              <Link
                to="/client/multi-events?create=true"
                className="bg-secondary text-white px-5 py-2 mt-4 inline-block rounded-xl"
              >
                Créer mon premier événement
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-0 xl:px-20 mt-7 mx-auto">
            <Service
              icon={managmenticon}
              title="Gestion complète"
              desc="Invités, budget, tâches"
            />
            <Service
              icon={minisiteicon}
              title="Mini-site personnalisé"
              desc="Partagez avec vos invités"
            />
            <Service
              icon={trackingicon}
              title="Suivi automatisé"
              desc="Étapes clés automatiques"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-darkmode border border-borderlight dark:border-transparent p-4 lg:p-6 rounded-2xl flex flex-col xl:flex-row gap-12">
          {/* <h2 className="text-center text-3xl mt-10 dark:text-neutral-300">
          Une sélection de prestataires
        </h2> */}

          <div className="w-full xl:w-1/4">
            <h2 className="text-secondary text-2xl xl:text-3xl dark:text-neutral-100">
              Trouvez le lieu idéal pour votre événement
            </h2>
            <p className="text-gray-600 dark:text-neutral-400 mt-5">
              Découvrez nos recommandations
            </p>

            <div className="mt-5 lg:mt-10">
              <Button onClick={() => navigate("/partners")}>
                Découvrez les lieux de réception
              </Button>
            </div>
          </div>
          <div className="w-full xl:w-3/4">
            <Slider serviceId={5} />
          </div>
        </div>

        <div className="bg-white dark:bg-darkmode border border-borderlight dark:border-transparent p-4 lg:p-6 rounded-2xl flex flex-col-reverse xl:flex-row gap-12">
          <div className="w-full xl:w-3/4">
            <div className="mb-5 lg:px-16 relative z-50">
              <CustomSelect
                options={categories}
                placeholder={
                  loadingCats ? "Chargement..." : `Sélectionner une catégorie`
                }
                className="w-full max-w-80"
                value={selectedCategory}
                onChange={setSelectedCategory}
                isDisabled={loadingCats}
                isClearable
              />
            </div>
            <Slider serviceId={selectedCategory?.value} />
          </div>

          <div className="w-full xl:w-1/4 pt-10">
            <h2 className="text-secondary text-2xl xl:text-3xl dark:text-neutral-100">
              Découvrez des prestataires qui sublimeront votre événement
            </h2>
            <p className="text-gray-600 dark:text-neutral-400 mt-5">
              Choisissez, enregistrez et demandez un devis{" "}
            </p>

            <div className="mt-5 lg:mt-10">
              <Button>Découvrez les vitrinesde nos prestataires</Button>
            </div>
          </div>
        </div>
      </div>

      <CreateEvent setActive={setActive} active={active} />
    </>
  );
}

/* ====== HELPERS ====== */
const Stat = ({
  title,
  value,
  percent,
}: {
  title: string;
  value: any;
  percent: number;
}) => (
  <div className="bg-white dark:bg-neutral-800 p-3 rounded">
    <h4 className="text-sm dark:text-neutral-100 tracking-widest">{title}</h4>
    <span className="font-bold text-lg dark:text-neutral-100">{value}</span>
    <div className="h-2 bg-gray-200 rounded mt-1">
      <div
        className="bg-green-500 h-full rounded"
        style={{ width: `${Math.min(percent || 0, 100)}%` }}
      />
    </div>
  </div>
);

const Service = ({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow transition-all hover:shadow-xl">
    <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex justify-center items-center bg-[#18655A]">
      <img src={icon} className="w-10 mx-auto mb-3" />
    </div>
    <h3 className="text-lg text-secondary dark:text-neutral-100 font-bold capitalize mb-1">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-neutral-400 text-sm">{desc}</p>
  </div>
);

export default DashboardComponent;
