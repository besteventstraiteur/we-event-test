import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import Staticscard from "../../pages/provider/Sales/Statics-card";

import {
  BriefcaseBusiness,
  Calendar,
  Check,
  Clipboard,
  Users,
  Users2,
} from "lucide-react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

type DashboardStats = {
  totalUsers: number;
  blockedUsers: number;
  usersByRole: { role: string; count: number }[];
  totalEvents: number;
  totaGuest: number;
};

type DashboardOverview = {
  kpis: {
    totalUsers: number;
    pendingProviders: number;
    approvedProviders: number;
    totalEvents: number;
  };
  newClients: any[];
  newProviders: any[];
  activeSubscriptions: any[];
  subscriptionsChart: any[];
  subscriptionDistribution: any[];
  conversion: {
    visitorsToSignup: number;
    requestsToBookings: number;
  };
};

function AdminDashbaordComponent() {
  const { id } = useParams();

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const navigate = useNavigate();
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await getRequest(ADMIN.STATS);
      setDashboard(res?.data?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const visitorsPercent = Math.min(
    Math.max(dashboard?.conversion?.visitorsToSignup ?? 0, 0),
    100,
  );

  const requestsPercent = Math.min(
    Math.max(dashboard?.conversion?.requestsToBookings ?? 0, 0),
    100,
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-neutral-300">
          Vue d’ensemble de la plateforme We Event
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Staticscard
            heading="Total Utilisateurs"
            value={dashboard?.kpis.totalUsers ?? 0}
            subheading="+ 4 nouveaux utilisateurs ce mois-ci"
            bgcolor="bg-blue-100"
            icon={<Users2 size={20} />}
            iconcolor="text-blue-600"
            link="/admin/manage-users"
          />

          <Staticscard
            heading="Prestataires en attente"
            value={dashboard?.kpis.pendingProviders ?? 0}
            subheading="Approuver les prestataires"
            bgcolor="bg-green-100"
            icon={<Clipboard size={20} />}
            iconcolor="text-green-600"
            link="/admin/manage-users?role=provider"
          />

          <Staticscard
            heading="Prestataires approuvés"
            value={dashboard?.kpis.approvedProviders ?? 0}
            subheading="Voir les vitrines"
            bgcolor="bg-yellow-100"
            icon={<Check size={20} />}
            iconcolor="text-yellow-600"
            link="/partners"
          />

          <Staticscard
            heading="Événements"
            value={dashboard?.kpis.totalEvents ?? 0}
            subheading="+ 3 nouveau événements ce mois-ci"
            bgcolor="bg-purple-100"
            icon={<Calendar size={20} />}
            iconcolor="text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
              <div className="flex items-start gap-2">
                <Users className="text-orange-400 shrink-0" />
                <span className="text-xl heading-font font-semibold tracking-wider capitalize dark:text-neutral-100">
                  Nouveaux Clients inscrit
                </span>
              </div>
              <span className="text-sm dark:text-neutral-300 font-medium underline cursor-pointer hover:text-tertiary">
                Voir tout
              </span>
            </div>

            <div className="space-y-4">
              {dashboard?.newClients.map((client) => (
                <div
                  key={client.id}
                  className="border border-borderlight rounded-lg p-3"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
                    <div className="flex gap-3 items-start">
                      <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-amber-500 text-white text-lg capitalize">
                        {client.firstName?.[0]}
                      </span>
                      <div>
                        <span className="dark:text-neutral-300 capitalize">
                          {client.firstName} {client.lastName}
                        </span>
                        <div className="text-gray-600 text-xs sm:text-sm">
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-sm dark:text-neutral-300 underline cursor-pointer"
                      role="button"
                      onClick={() => navigate("/admin/manage-users")}
                    >
                      Voir profil
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
              <div className="flex items-start gap-2">
                <BriefcaseBusiness className="text-blue-400 shrink-0" />
                <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-300">
                  Nouveaux Prestataires
                </span>
              </div>
              <span className="text-sm dark:text-neutral-300 font-medium underline cursor-pointer hover:text-tertiary">
                Voir tout
              </span>
            </div>

            <div className="space-y-4">
              {dashboard?.newProviders.map((p) => (
                <div
                  key={p.id}
                  className="border border-borderlight rounded-lg p-3 flex justify-between"
                >
                  <div>
                    <span className="dark:text-neutral-300">{p.name}</span>
                    <div className="text-gray-600 text-sm">
                      Approuvé le : {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span className="bg-green-500 text-white text-sm rounded-full px-3 py-1 self-start">
                    Vérifié
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
          <div className="mb-4">
            <div className="flex gap-3 justify-between">
              <div>
                <span className="block text-xl heading-font font-semibold tracking-wider capitalize dark:text-neutral-100">
                  Abonnements Actifs
                </span>

                <p className="text-green-600 text-sm">
                  {/* + 30% d’abonnés ce mois-ci
                   */}
                  {dashboard?.growthrate?.display} d’abonnés ce mois-ci
                </p>
              </div>
              <span className="text-secondary dark:text-neutral-300 text-5xl font-bold">
                8
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
            {dashboard?.activeSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex gap-2 justify-between border border-light rounded-2xl p-3"
              >
                <div>
                  <span className="dark:text-neutral-300 capitalize">
                    {sub.subscriber}
                  </span>
                  <span className="block bg-orange-400 text-white text-xs rounded-full px-3 py-1 mt-2">
                    {sub.commitment}
                  </span>
                </div>

                <div className="text-right dark:text-neutral-300">
                  <span className="text-xl font-bold">{sub.price}€</span>
                  <div className="text-sm">/mois</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
          <div className="mb-4">
            <span className="block text-xl heading-font font-semibold tracking-wider capitalize dark:text-neutral-100">
              Abonnements
            </span>

            <p className="text-gray-600 dark:text-neutral-300 text-sm">
              Clients, Partenaires et abbonnements sur la période
            </p>
          </div>

          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboard?.subscriptionsChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clients" stroke="#3b82f6" />
                <Line type="monotone" dataKey="partners" stroke="#f97316" />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#8b5cf6"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-darkmode rounded-2xl p-4">
            <div className="mb-4">
              <span className="block text-xl heading-font font-semibold tracking-wider capitalize dark:text-neutral-100">
                Répartition des abonnements
              </span>
            </div>
            <div className="space-y-3">
              {dashboard?.subscriptionDistribution.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[150px_2fr] gap-2"
                >
                  <span className="dark:text-neutral-300 text-sm">
                    {item.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <span
                        className="h-full bg-gradient-to-r from-blue-500 to-pink-500 block"
                        style={{ width: `${item.percentage}%` }}
                        data-no-translate
                      />
                    </div>
                    <span className="w-10 shrink-0 dark:text-neutral-300 text-sm">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode rounded-2xl p-4">
            <div className="mb-4">
              <span className="block text-xl heading-font font-semibold tracking-wider capitalize dark:text-neutral-100">
                Taux de conversion
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="dark:text-neutral-300 text-sm">
                  Visiteurs → Inscrits
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                    <span
                      className="h-full bg-green-600 absolute top-0 left-0"
                      style={{ width: `${visitorsPercent}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 dark:text-neutral-300 text-sm">
                    {visitorsPercent}%
                  </span>
                </div>
              </div>

              <div>
                <span className="dark:text-neutral-300 text-sm">
                  Demandes → Signatures
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-300 rounded-full relative overflow-hidden">
                    <span
                      className="h-full bg-blue-600 absolute top-0 left-0"
                      style={{ width: `${requestsPercent}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 dark:text-neutral-300 text-sm">
                    {requestsPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashbaordComponent;
