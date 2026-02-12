import React, { useEffect, useMemo, useState } from "react";
import { CalendarRange, MapPin, CircleX, CalendarPlus2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";

dayjs.extend(utc);
dayjs.extend(timezone);

type EventBudget = {
  total: number;
  used: number;
  balance: number;
};

type EventCategory = {
  id: string;
  name: string;
};

type EventAPI = {
  id: string;
  name: string;
  description: string;
  category?: EventCategory | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  status?: string | null;
  thumbnail?: string | null;
  budget?: EventBudget | null;
};

function Event_details() {
  const { id } = useParams();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventAPI | null>(null);
  const [error, setError] = useState("");

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await getRequest(`${PROVIDER.GET_EVENT_BY_ID}/${id}`);
      const payload = resp?.data?.data ?? resp?.data ?? null;
      if (payload) {
        setEvent(payload as EventAPI);
      } else {
        setError("Aucune donnée d’événement trouvée.");
      }
    } catch (e: any) {
      setError(e?.message || "Échec de la récupération de l’événement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  const tz = useMemo(() => dayjs.tz.guess(), []);
  const dateRangeLabel = useMemo(() => {
    if (!event?.startDateTime || !event?.endDateTime) return "";
    const start = dayjs.utc(event.startDateTime).tz(tz);
    const end = dayjs.utc(event.endDateTime).tz(tz);
    const startFmt = start.format("MMM D, YYYY");
    const endFmt = end.format("MMM D, YYYY");
    return `${startFmt} to ${endFmt}`;
  }, [event, tz]);

  const isActive = (event?.status || "").toLowerCase() === "active";

  return (
    <div className="min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-2xl dark:text-neutral-100 font-bold capitalize">
          {loading ? (
            <Skeleton width={260} />
          ) : (
            event?.name || "Nom de l’événement"
          )}
        </h1>
       
      </div>

      <div className="mx-auto">

        {/* Thumbnail */}
        
        <div className="w-full h-96 rounded-2xl mb-6 overflow-hidden bg-gray-100">
          {loading ? (
            <Skeleton height={"100%"} />
          ) : event?.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event?.name || "event thumbnail"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-neutral-400">
              No Image
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] items-start gap-24">
          <div className="w-full">
            {/* Status */}

            <div>
              {loading ? (
                <Skeleton width={100} height={28} borderRadius={999} />
              ) : (
                <span
                  className={`px-4 py-1.5 text-sm rounded-full ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>

            {/* Title */}

            <h2 className="text-2xl font-semibold mt-3 dark:text-neutral-100 capitalize">
              {loading ? (
                <Skeleton width={280} />
              ) : (
                event?.name || "Untitled Event"
              )}
            </h2>

            {/* Meta: address + date range + category */}

            <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1 capitalize dark:text-neutral-400">
                <MapPin size={18} className="text-gray-600 dark:text-neutral-400" />
                {loading ? (
                  <Skeleton width={200} />
                ) : (
                  event?.address || "Adresse non disponible"
                )}
              </div>
              <div className="flex items-center gap-1 dark:text-neutral-400">
                <CalendarRange
                  size={18}
                  className="text-gray-600 dark:text-neutral-400"
                />
                {loading ? (
                  <Skeleton width={260} />
                ) : (
                  dateRangeLabel || "Dates non disponibles"
                )}
              </div>
              {!loading && event?.category?.name ? (
                <div className="flex items-center gap-1 capitalize dark:text-neutral-400">
                  <CalendarPlus2
                    size={18}
                    className="text-gray-600 dark:text-neutral-400"
                  />
                  {event.category.name}
                </div>
              ) : null}
            </div>

            {/* Description - plain paragraph */}

            <div className="text-gray-700 dark:text-neutral-300 mt-4 space-y-3 leading-relaxed">
              {loading ? (
                <>
                  <Skeleton count={3} />
                  <Skeleton width={"80%"} />
                </>
              ) : (
                <p>{event?.description || "Aucune description fournie."}</p>
              )}
            </div>
          </div>

          <div className="w-full sticky top-6">

            {/* Budget */}

            {loading ? (
              <div className="bg-white dark:bg-darkmode p-4 rounded-2xl mt-6">
                <Skeleton width={100} height={20} />
                <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                  <Skeleton height={56} />
                  <Skeleton height={56} />
                  <Skeleton height={56} />
                </div>
              </div>
            ) : event?.budget ? (
              <div className="bg-white dark:bg-darkmode p-4 rounded-2xl mt-6 border border-gray-100">
                <span className="text-lg font-semibold dark:text-neutral-300">
                  Budget
                </span>
                <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-neutral-300 block mb-2">
                      Total
                    </span>
                    <span className="font-medium dark:text-neutral-300">
                      $ {event.budget.total ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-neutral-300 block mb-2">
                      Utilisé
                    </span>
                    <span className="font-medium dark:text-neutral-300">
                      $ {event.budget.used ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-neutral-300 block mb-2">
                      Solde
                    </span>
                    <span className="font-medium dark:text-neutral-300">
                      $ {event.budget.balance ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Guest Info (static placeholders; replace once API available) */}
            <div className="guest-info bg-white dark:bg-darkmode p-5 rounded-2xl mt-6">
              <span className="text-lg font-semibold dark:text-neutral-100">
                Détails des invités
              </span>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mt-3">
                  <Skeleton height={18} />
                  <Skeleton height={18} />
                  <Skeleton height={18} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 text-sm mt-3 dark:text-neutral-300">
                  <span>Nom: Jane Andrews</span>
                  <span>E-mail: Jane12@gmail.com</span>
                  <span>Numéro de téléphone: +91 9056128761</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-4 text-sm text-red-600 bg-red-50 borderborder-red-100 rounded-lg p-3">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Event_details;
