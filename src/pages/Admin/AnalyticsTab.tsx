import { useEffect, useState } from "react";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AnalyticsTab = () => {
  const [topTrainings, setTopTrainings] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any>(null);

  const [topPage, setTopPage] = useState(1);
  const [topLimit] = useState(5); // you can change this
  const [topTotalPages, setTopTotalPages] = useState(1);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);

  // ====================== API CALLS ======================
  const fetchTopTrainings = async (page = 1) => {
    try {
      setLoadingTop(true);

      const res = await getRequest(
        `${PROVIDER.TOP_TRAININGS}?page=${page}&limit=${topLimit}`,
      );

      const apiData = res?.data?.data;

      setTopTrainings(apiData?.data ?? []);
      setTopPage(apiData?.page ?? 1);
      setTopTotalPages(apiData?.totalPages ?? 1);
    } catch (err) {
      setTopTrainings([]);
      setTopTotalPages(1);
    } finally {
      setLoadingTop(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoadingReg(true);
      const res = await getRequest(PROVIDER.TRAINING_REG_CHART);
      setRegistrations(res?.data?.data?.chart ?? {});
    } catch (err) {
      setRegistrations({});
    } finally {
      setLoadingReg(false);
    }
  };

  useEffect(() => {
    fetchTopTrainings(topPage);
    fetchRegistrations();
  }, []);

  // ====================== REGISTRATION RENDER ======================
  const renderSection = (title: string, data: Record<string, number>) => {
    const entries = Object.entries(data || {});

    return (
      <div className="p-3 border border-borderlight dark:border-neutral-700 dark:bg-neutral-800 rounded-xl">
        <h4 className="text-md font-semibold mb-2 dark:text-neutral-300">
          {title}
        </h4>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {entries.map(([date, count]) => (
              <div
                key={date}
                className="flex justify-between text-sm border-b border-borderlight dark:border-neutral-700 pb-3 last:border-none dark:text-neutral-300"
              >
                <span>{new Date(date).toLocaleDateString()}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ====================== TOP TRAININGS ====================== */}
      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
        <h3 className="text-xl heading-font font-semibold mb-2 dark:text-neutral-300">
          Formations de haut niveau
        </h3>

        {loadingTop ? (
          <p className="text-gray-400 text-sm dark:text-neutral-300">
            Chargement…
          </p>
        ) : topTrainings.length === 0 ? (
          <p className="text-gray-500 text-sm dark:text-neutral-300">
            Aucune formation trouvée
          </p>
        ) : (
          <div className="space-y-3">
            {topTrainings.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 dark:bg-neutral-700 border border-borderlight dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-200">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full text-xs text-gray-500">
                      Aucune image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium dark:text-neutral-300">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-300">
                    Vues: {item.views} | Téléchargements: {item.downloads}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {topTotalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={topPage === 1}
              onClick={() => fetchTopTrainings(topPage - 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              <ArrowLeft size={16} /> Précédent
            </button>

            <button
              disabled={topPage === topTotalPages}
              onClick={() => fetchTopTrainings(topPage + 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Suivant <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ====================== REGISTRATIONS ====================== */}

      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
        <h3 className="text-xl heading-font font-semibold dark:text-neutral-300">
          Inscriptions
        </h3>

        {loadingReg ? (
          <p className="text-gray-400 text-sm">Chargement…</p>
        ) : !registrations ? (
          <p className="text-gray-500 text-sm">
            Aucune donnée d’inscription trouvée
          </p>
        ) : (
          <div className="space-y-4">
            {renderSection("Webinars", registrations.webinars)}
            {renderSection("Meetings", registrations.meetings)}
            {renderSection("Courses", registrations.courses)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;
