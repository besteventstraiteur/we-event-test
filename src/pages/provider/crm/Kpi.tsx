import {
  Clock,
  Euro,
  File,
  FileStack,
  Filter,
  Plus,
  Settings,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import Staticscard from "../Sales/Statics-card";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getRequest } from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const PIE_COLORS = ["#f59e0b", "#22c55e", "#ef4444", "#3b82f6", "#a855f7"];

const DashboardKpi = ({ pipelineId }: { pipelineId: string | null }) => {
  const [loading, setLoading] = useState(false);
  const [kpi, setKpi] = useState<any>(null);

  const projectedRevenue = kpi?.forecastRevenue || 0;
  const conversionRate = kpi?.conversionRate || 0;
  const activeOpportunities = kpi?.activeCount || 0;
  const averageDealSize = kpi?.averageDealSize || 0;

  const stageCounts = kpi?.stageCounts || {};

  const normalizedStageValues = (kpi?.stageValues || []).map((item: any) => ({
    stageId: item.stageId,
    name: item.name,
    value: Number(item.value) || 0,
  }));

  const fetchKpi = async () => {
    if (!pipelineId) return;

    setLoading(true);
    try {
      const res = await getRequest(
        `${PROVIDER.OPPURTINITES}/${pipelineId}/kpi`
      );
      setKpi(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpi();
  }, [pipelineId]);

  const pieData = (kpi?.stageDistribution || []).map((item: any) => ({
    name: item.name,
    value: Number(item.count) || 0,
  }));

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Staticscard
            heading="CA Prévisionnel"
            value={loading ? <Skeleton width={60} /> : `${projectedRevenue}€`}
            bgcolor="bg-blue-100"
            icon={<Euro size={20} />}
            iconcolor="text-blue-600"
          />

          <Staticscard
            heading="Taux de Conversion"
            value={loading ? <Skeleton width={40} /> : `${conversionRate}%`}
            bgcolor="bg-green-100"
            icon={<Target size={20} />}
            iconcolor="text-green-600"
          />

          <Staticscard
            heading="Opportunités Actives"
            value={loading ? <Skeleton width={20} /> : activeOpportunities}
            bgcolor="bg-yellow-100"
            icon={<Clock size={20} />}
            iconcolor="text-yellow-600"
          />

          <Staticscard
            heading="Taille Moyenne"
            value={loading ? <Skeleton width={60} /> : `${averageDealSize}€`}
            bgcolor="bg-purple-100"
            icon={<TrendingUp size={20} />}
            iconcolor="text-purple-600"
          />
        </div>
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={20} />
          ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <h2 className="text-xl dark:text-neutral-300 tracking-wider font-bold mb-4">
              Répartition par étape
            </h2>

            <div className="text-center">
              {loading ? (
                <Skeleton circle height={220} width={220} />
              ) : (
                <div className="h-[260px]">
                  {loading ? (
                    <Skeleton circle height={220} width={220} />
                  ) : pieData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={55}
                          paddingAngle={3}
                        >
                          {pieData.map((_, index) => (
                            <Cell
                              key={index}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500">Aucune donnée</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <h2 className="text-xl dark:text-neutral-300 tracking-wider font-bold mb-4">
              Valeur par étape
            </h2>

            {!loading && normalizedStageValues.length === 0 && (
              <div className="text-gray-500 text-sm dark:text-neutral-300">No data</div>
            )}

            {normalizedStageValues.map((item) => {
              const max = Math.max(
                ...normalizedStageValues.map((i) => i.value),
                1
              );
              const width = `${(item.value / max) * 100}%`;

              return (
                <div
                  key={item.stageId}
                  className="flex justify-between gap-2 text-sm"
                >
                  <span className="dark:text-neutral-300">{item.name}</span>

                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full my-2 relative">
                      <div
                        className="h-full bg-yellow-600 rounded-full absolute top-0 left-0"
                        style={{ width }}
                      />
                    </div>
                    <span className="min-w-[60px] text-right dark:text-neutral-300">
                      {item.value}€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardKpi;
