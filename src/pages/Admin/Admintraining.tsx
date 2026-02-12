import {
  Award,
  BriefcaseBusiness,
  Monitor,
  Presentation,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import ReplaysTab from "./ReplaysTab";
import ElearningTab from "./ElearningTab";
import LiveSessionsTab from "./LiveSessionsTab";
import BusinessTab from "./BusinessTab";
import AnalyticsTab from "./AnalyticsTab";

type Stats = {
  stats_replays: number;
  stats_live_sessions: number;
  stats_business_meetings: number;
  stats_elearning: number;
  stats_registrations: number;
};

const Admintraining = () => {
  const [activeTab, setActiveTab] = useState<
    "Replays" | "E-Learning" | "Live Sessions" | "Business" | "Analytics"
  >("Rediffusions");

  const [stats, setStats] = useState<Stats>({
    stats_replays: 0,
    stats_live_sessions: 0,
    stats_business_meetings: 0,
    stats_elearning: 0,
    stats_registrations: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await getRequest(PROVIDER.trainingSTATS);
      if (res?.data?.data?.adminTraining) {
        const s = res.data.data.adminTraining;
        setStats({
          stats_replays: s.stats_replays ?? 0,
          stats_live_sessions: s.stats_live_sessions ?? 0,
          stats_business_meetings: s.stats_business_meetings ?? 0,
          stats_elearning: s.stats_elearning ?? 0,
          stats_registrations: s.stats_registrations ?? 0,
        });
      }
    } catch (err) {
      
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  return (
    <>
      
      <div className="mb-6 space-y-4">          
            <h1 className="text-2xl mb-0 font-semibold dark:text-neutral-100">Formation</h1>
            <p className="text-gray-600 dark:text-neutral-300">
              Gérer l'ensemble des sessions de formation et du contenu
            </p>
      </div>

      {/* Top Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md">
          <div className="flex flex-col gap-1 pr-5">
            <div className="text-gray-500 text-sm capitalize">Rediffusions</div>
            <h3 className="text-3xl font-bold dark:text-neutral-300">
              {loadingStats ? <Skeleton width={40} /> : stats.stats_replays}
            </h3>
          </div>
          <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
            <Award size={18} />
          </span>
        </div>

        <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md">
          <div className="flex flex-col gap-1 pr-5">
            <div className="text-gray-500 text-sm capitalize">
             sessions en direct
            </div>
            <h3 className="text-3xl font-bold dark:text-neutral-300">
              {loadingStats ? (
                <Skeleton width={40} />
              ) : (
                stats.stats_live_sessions
              )}
            </h3>
          </div>
          <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white">
            <Monitor size={18} />
          </span>
        </div>

        <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md">
          <div className="flex flex-col gap-1 pr-5">
            <div className="text-gray-500 text-sm capitalize">
              réunions d'affaires
            </div>
            <h3 className="text-3xl font-bold dark:text-neutral-300">
              {loadingStats ? (
                <Skeleton width={40} />
              ) : (
                stats.stats_business_meetings
              )}
            </h3>
          </div>
          <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
            <BriefcaseBusiness size={18} />
          </span>
        </div>

        <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md">
          <div className="flex flex-col gap-1 pr-5">
            <div className="text-gray-500 text-sm capitalize">Inscriptions</div>
            <h3 className="text-3xl font-bold dark:text-neutral-300">
              {loadingStats ? <Skeleton width={40} /> : stats.stats_elearning}
            </h3>
          </div>
          <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-pink-500 text-white">
            <Presentation size={18} />
          </span>
        </div>

        <div className="relative bg-white dark:bg-darkmode rounded-2xl p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md">
          <div className="flex flex-col gap-1 pr-5">
            <div className="text-gray-500 text-sm capitalize">
              Registrations
            </div>
            <h3 className="text-3xl font-bold dark:text-neutral-300">
              {loadingStats ? (
                <Skeleton width={40} />
              ) : (
                stats.stats_registrations
              )}
            </h3>
          </div>
          <span className="absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center bg-violet-500 text-white">
            <Users size={18} />
          </span>
        </div>
      </div>

      {/* Tabs */}

      <div className="mt-10">
        
        <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
          {[
            "Rediffusions",
            "apprentissage en ligne",
            "Sessions en direct",
          "Entreprise",
            "Analytique",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 whitespace-nowrap py-1 px-2 text-center rounded-lg cursor-pointer font-medium capitalize ${
                activeTab === tab
                  ? "bg-white text-secondary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        

        <div className="mt-5">
          {activeTab === "Rediffusions" && <ReplaysTab />}
          {activeTab === "apprentissage en ligne" && <ElearningTab />}
          {activeTab === "Sessions en direct" && <LiveSessionsTab />}
          {activeTab === "Entreprise" && <BusinessTab />}
          {activeTab === "Analytique" && <AnalyticsTab />}
        </div>
      </div>
    </>
  );
};

export default Admintraining;
