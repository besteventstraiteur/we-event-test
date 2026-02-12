import { useEffect, useState } from "react";
import { FileStack } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getRequest } from "../../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../../utils/endPoints";

const HistoricalTab = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchReminderLogs = async () => {
    setLoading(true);
    try {
      const res = await getRequest(`${PROVIDER.PIPLINE}/reminder/logs`);
      setLogs(res?.data?.data?.logs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminderLogs();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return {
          text: "Envoyé",
          className: "bg-green-100 text-green-800",
        };
      case "failed":
        return {
          text: "Échec",
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          text: "En attente",
          className: "bg-blue-100 text-blue-800",
        };
    }
  };
  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
      <div className="flex gap-4 items-start justify-between mb-10">
        <div>
          <span className="flex items-center gap-2 text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
           Histoire des rappels
          </span>
          <p className="text-sm text-gray-600 dark:text-neutral-300">
            Les 50 derniers rappels ont été envoyés automatiquement.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={110} borderRadius={12} />
          ))}

        {!loading &&
          logs.map((log) => {
            const status = getStatusLabel(log.status);

            return (
              <div
                key={log.id}
                className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg"
              >
                <div>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <h4 className="font-semibold capitalize dark:text-neutral-100">
                    {log.config?.documentType || "—"}
                  </h4>

                  <p className="text-gray-600 dark:text-neutral-400 text-sm">
                   Rappel via: {log.config?.reminderType}
                  </p>

                  <p className="text-gray-600 dark:text-neutral-400 text-sm">
                    {formatDate(log.sentAt)} • Interval{" "}
                    {log.config?.intervalDays} day(s)
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {!loading && logs.length === 0 && (
        <div className="flex flex-col items-center mt-10">
          <FileStack size={50} className="text-gray-400 dark:text-neutral-100" />
          <span className="mt-5 text-gray-600 dark:text-neutral-300">Aucun rappel envoyé pour le moment</span>
        </div>
      )}
    </div>
  );
};

export default HistoricalTab;
