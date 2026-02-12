import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Activity,
  Calendar,
  Euro,
  Eye,
  File,
  MousePointerClick,
  Star,
  User2,
} from "lucide-react";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Staticscard from "./Sales/Statics-card";
import Button from "../../components/ui/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../utils/toast";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-300/60 dark:bg-slate-700/50 ${className}`}
  />
);

type DashboardApi = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    chart?: { date: string; count: number }[];
    stats?: {
      total?: number;
      pending?: number;
      accepted?: number;
      rejected?: number;
      cancelled?: number;
    };
  };
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-40 rounded-lg" />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Two cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>

      {/* Graph + Health */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <Skeleton className="h-[340px] rounded-2xl" />
        <Skeleton className="h-[340px] rounded-2xl" />
      </div>
    </div>
  );
};

function Providerdashboard() {
  const [active, setActive] = useState(false);
  const login = useSelector((state: any) => state.login);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<string | null>(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState<
    Required<NonNullable<DashboardApi["data"]>>["stats"]
  >({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [chartApiData, setChartApiData] = useState<
    { date: string; count: number }[]
  >([]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = (await getRequest(PROVIDER.DASHBOARD)) as DashboardApi;

      if (res?.status === 200 && res?.data?.data) {
        const s = res.data?.data?.stats ?? {};
        setStats({
          total: s.total ?? 0,
          pending: s.pending ?? 0,
          accepted: s.accepted ?? 0,
          rejected: s.rejected ?? 0,
          cancelled: s.cancelled ?? 0,
        });
        setChartApiData(
          Array.isArray(res.data?.data?.chart) ? res.data?.data?.chart : []
        );
        setDashboardData(res.data?.data || null);
      } else {
        setError(res?.message || "Failed to load dashboard");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const dashboard = dashboardData as any;
  const kpis = dashboard?.kpis || {};
  const performanceChart = dashboard?.performanceChart || [];
  const businessHealth = dashboard?.businessHealth || {};
  const recommendationsHistory = dashboard?.recommendationsHistory || [];

  const healthScore = businessHealth?.score ?? 0;

  const healthColor =
    healthScore < 55
      ? "from-red-500 to-red-600"
      : healthScore < 85
      ? "from-orange-400 to-orange-500"
      : "from-green-400 to-green-500";
  const progressWidth = (value: number, max = 25) =>
    `${Math.min(100, (value / max) * 100)}%`;

  const topRequests = dashboard?.topRequests || [];
  const documents = dashboard?.documents || [];
  const upcomingMeetings = dashboard?.upcomingMeetings || [];

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "accepted":
        return "bg-green-600";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const toast = useToast();
  const handleSendEmail = async (requestId: string) => {
    setButtonLoading(true);
    try {
      await postRequest(PROVIDER.SEND_CONTACT_EMAIL, {
        quoteId: requestId,
      });
      toast.success("Email envoyé avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email");
    }
    setButtonLoading(false);
  };

  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <p className="text-gray-600 dark:text-neutral-300">
              Voici un aperçu de votre activité sur We Event
            </p>
          </div>
          <div>
            <Button
              size="medium"
              className="!bg-orange-400 hover:!bg-orange-500"
              onClick={() =>
                window.open(`/partners/${dashboardData?.businessId} `, "_blank")
              }
            >
              <Eye /> Voir ma vitrine
            </Button>
          </div>
        </div>
      </div>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Staticscard
              heading="Demandes reçues"
              value={kpis.totalRequests ?? 0}
              subheading="sur les 12 derniers mois"
              bgcolor="bg-blue-100"
              icon={<File size={20} />}
              iconcolor="text-blue-600"
            />

            <Staticscard
              heading="Avis"
              value={kpis.totalReviews ?? 0}
              subheading="sur les 12 derniers mois"
              bgcolor="bg-green-100"
              icon={<Star size={20} />}
              iconcolor="text-green-600"
            />

            <Staticscard
              heading="Impressions sur votre vitrine"
              value={kpis.impressions ?? 0}
              subheading="sur les 12 derniers mois"
              bgcolor="bg-yellow-100"
              icon={<Eye size={20} />}
              iconcolor="text-yellow-600"
            />

            <Staticscard
              heading="Clics sur Voir Coordonnées"
              value={kpis.contactClicks ?? 0}
              subheading="sur les 12 derniers mois"
              bgcolor="bg-purple-100"
              icon={<MousePointerClick size={20} />}
              iconcolor="text-purple-600"
            />
          </div>

          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100 block mb-4">
              Demandes en attente
            </span>

            <div className="space-y-4 divide-y-2 divide-gray-100 dark:divide-neutral-700">
              {topRequests.length === 0 && (
                <p className="text-gray-500">Aucune demande en attente</p>
              )}

              {topRequests.map((req: any) => (
                <div
                  key={req.id}
                  className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center pb-4"
                >
                  <div className="flex gap-3 items-start">
                    <span
                      className={`shrink-0 w-10 h-10 flex justify-center items-center rounded-full text-white ${statusColor(
                        req.status
                      )}`}
                    >
                      <User2 size={20} />
                    </span>

                    <div className="flex flex-col">
                      <span className="dark:text-neutral-300 capitalize">{req.clientName}</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {req.eventName}
                      </span>
                      <div className="text-gray-600 text-sm">{req.date}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* <Button
                      size="medium"
                      className="!bg-purple-500 hover:!bg-purple-700"
                      loading={buttonLoading}
                      onClick={() => handleSendEmail(req.id)}
                    >
                      Demander en contact
                    </Button> */}
                    <Button
                      size="medium"
                      onClick={() => navigate("/provider/requests")}
                    >
                      Voir la demande
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                Toutes les recommandations
              </span>

              <span
                className="text-sm font-medium underline cursor-pointer dark:text-neutral-300"
                role="button"
                onClick={() => navigate("/provider/recommendations")}
              >
                Voir tout
              </span>
            </div>

            {/* Content */}
            <div className="space-y-4 divide-y-2 divide-gray-100 dark:divide-neutral-700">
              {recommendationsHistory.length === 0 && (
                <p className="text-gray-500 dark:text-neutral-400">
                  Aucune recommandation en attente
                </p>
              )}

              {recommendationsHistory.slice(0, 5).map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center pb-4"
                >
                  {/* Left */}
                  <div className="flex gap-3 items-start">
                    <span className="shrink-0 w-10 h-10 flex justify-center items-center rounded-full bg-green-500 text-white">
                      <User2 size={20} />
                    </span>

                    <div className="flex flex-col">
                      <span className="dark:text-neutral-300 font-medium">
                        {item.clientName}
                      </span>

                      <span className="text-sm text-gray-500">
                        {item.category}
                      </span>

                      {item.sharedWith?.length > 0 && (
                        <span className="text-xs text-gray-400">
                          Partagé avec : {item.sharedWith.join(", ")}
                        </span>
                      )}

                      <span className="text-xs text-gray-500 mt-1">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className="bg-amber-100 text-amber-700 text-sm rounded-full px-3 py-1 self-start md:self-center">
                    En attente
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100 block mb-4">
              Activité récente
            </span>

            <div className="space-y-4 divide-y-2 divide-gray-100 dark:divide-neutral-700">
              {documents.length === 0 && (
                <p className="text-gray-500 dark:text-neutral-400">Aucune activité récente</p>
              )}

              {documents.map((doc: any) => (
                <div key={doc.id} className="flex gap-3 items-start pb-4">
                  <span className="shrink-0 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                    {doc.type === "invoice" ? (
                      <Euro size={20} />
                    ) : (
                      <File size={20} />
                    )}
                  </span>

                  <div className="flex flex-col">
                    <span className="dark:text-neutral-300">
                      {doc.type === "invoice" ? "Facture" : "Devis"}{" "}
                      {doc.number} — {doc.status}
                    </span>

                    <div className="text-gray-600 text-sm">
                      Montant : €{doc.amount} • Échéance : {doc.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                <div className="flex items-start gap-2">
                  <Calendar className="text-blue-400 shrink-0" />
                  <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                    Prochains rendez-vous
                  </span>
                </div>
                <span
                  className="text-sm dark:text-neutral-300 font-medium underline cursor-pointer"
                  role="button"
                  onClick={() => navigate("/provider/appointment")}
                >
                  Voir tout
                </span>
              </div>

              <div className="space-y-4">
                {upcomingMeetings.length === 0 && (
                  <p className="text-gray-500">Aucun rendez-vous à venir</p>
                )}

                {upcomingMeetings.map((meet: any) => (
                  <div
                    key={meet.id}
                    className="border border-borderlight rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span className="dark:text-neutral-300">{meet.title}</span>
                      <div className="text-gray-600 text-sm">{meet.date}</div>
                    </div>

                    <span className="bg-purple-500 text-white text-sm rounded-full px-3 py-1 self-start sm:self-center">
                      {meet.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
              <div className="mb-4">
                <span className="block text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                  Évolution des performances de votre vitrine
                </span>

                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  Vues, clics et leads sur la période
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceChart}>
                      <XAxis dataKey="month" />
                      <YAxis
                        domain={[0, 12]}
                        ticks={[0, 3, 6, 9, 12]}
                        allowDecimals={false}
                      />

                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#3B82F6" />
                      <Bar dataKey="clicks" fill="#A855F7" />
                      <Bar dataKey="leads" fill="#22C55E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>{" "}
              </div>
            </div>

            <div
              className={`bg-white dark:bg-darkmode rounded-2xl overflow-hidden`}
              // className="bg-gradient-to-r from-[#10B981] to-[#22C55E] rounded-2xl overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${healthColor} p-4 relative`}>
                <p className="text-white dark:text-neutral-300">Score de Santé Business</p>
                <div className="my-1">
                  <span className="text-white text-5xl font-bold">
                    {healthScore}
                  </span>{" "}
                </div>
                <p className="text-white text-lg">{businessHealth?.label}</p>
                <Activity
                  size={100}
                  className="text-white/20 absolute top-[10px] right-[10px]"
                />
              </div>

              <div className="bg-white dark:bg-darkmode p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex gap-2 justify-between mb-1 text-sm dark:text-neutral-300">
                      <span>Visibilité</span>
                      <span>{`${businessHealth.visibility}/25`}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                      <span
                        className="h-full bg-gradient-to-l from-blue-500 to-pink-500 absolute top-0 left-0"
                        style={{
                          width: progressWidth(businessHealth.visibility),
                        }}
                      ></span>{" "}
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2 justify-between mb-1 text-sm dark:text-neutral-300">
                      <span>Conversion</span>
                      <span>{`${businessHealth.conversion}/25`}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                      <span
                        className="h-full bg-gradient-to-l from-blue-500 to-pink-500 absolute top-0 left-0"
                        style={{
                          width: progressWidth(businessHealth.conversion),
                        }}
                      ></span>{" "}
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 justify-between mb-1 text-sm dark:text-neutral-300">
                      <span>Satisfaction</span>
                      <span>{`${businessHealth.satisfaction}/25`}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                      <span
                        className="h-full bg-gradient-to-l from-blue-500 to-pink-500 absolute top-0 left-0"
                        style={{
                          width: progressWidth(businessHealth.satisfaction),
                        }}
                      ></span>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 justify-between mb-1 text-sm dark:text-neutral-300">
                      <span>Finances</span>
                      <span>{`${businessHealth.finances}/25`}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                      <span
                        className="h-full bg-gradient-to-l from-blue-500 to-pink-500 absolute top-0 left-0"
                        style={{
                          width: progressWidth(businessHealth.finances),
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Providerdashboard;
