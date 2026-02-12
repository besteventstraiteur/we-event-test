import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import Staticscard from "./Sales/Statics-card";
import Globaltabs from "./Sales/Globaltabs";
import CustomSelect from "../../components/ui-main/selectBox";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import {
  Award,
  CheckCircle,
  Clock,
  Euro,
  Send,
  TrendingUp,
} from "lucide-react";
import CreateListModal from "./CreateListModal";
import RecommendationModal from "./RecommendationModal";
import moment from "moment";

/* STATUS FILTER */
const priority = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "accepted", label: "Accepté" },
  { value: "rejected", label: "Rejeté" },
  { value: "converted", label: "Converti" },
];

const Recommendations = () => {
  // -------- STATE --------
  const [loading, setLoading] = useState(false);
  const [priorityValue, setPriorityValue] = useState("");
  const [search, setSearch] = useState("");
  const [sentList, setSentList] = useState<any[]>([]);
  const [receivedList, setReceivedList] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [ListModal, setListModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionLoadingIdReject, setActionLoadingIdReject] = useState(false);
  // -------- API CALLS --------
  const fetchOverview = async () => {
    const res = await getRequest(PROVIDER.RECOMENDATION_OVERVIEW);
    setOverview(res?.data?.data || null);
  };

  const fetchSentRecommendations = async () => {
    setLoading(true);
    const res = await getRequest(
      `${PROVIDER.SEND_RECOMENDATION}?search=${search}&status=${priorityValue}`,
    );
    setSentList(res?.data?.data?.data || []);
    setLoading(false);
  };

  const fetchReceivedRecommendations = async () => {
    setLoading(true);
    const res = await getRequest(
      `${PROVIDER.RECOMENDATION_RECEIVED}?search=${search}&status=${priorityValue}`,
    );
    setReceivedList(res?.data?.data?.data || []);
    setLoading(false);
  };

  const acceptRecommendation = async (recommendationId: string) => {
    try {
      setActionLoadingId(recommendationId);

      await postRequest(
        `${PROVIDER.RECOMENDATION_SEND}/${recommendationId}/accept`,
      );

      fetchOverview();
      fetchReceivedRecommendations();
    } catch (error) {
      console.error("Accept recommendation failed", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const rejectRecommendation = async (recommendationId: string) => {
    try {
      setActionLoadingIdReject(recommendationId);

      await postRequest(
        `${PROVIDER.RECOMENDATION_SEND}/${recommendationId}/reject`,
      );
      fetchOverview();
      fetchReceivedRecommendations();
    } catch (error) {
      console.error("Reject recommendation failed", error);
    } finally {
      setActionLoadingIdReject(null);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchSentRecommendations();
    fetchReceivedRecommendations();
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchSentRecommendations();
    fetchReceivedRecommendations();
  }, [ListModal, showModal]);

  useEffect(() => {
    fetchSentRecommendations();
    fetchReceivedRecommendations();
  }, [search, priorityValue, activeTab]);

  console.log(sentList, "sentListsentList");

  const getStatusLabel = (status: string) => {
    return priority.find((p) => p.value === status)?.label || status;
  };

  return (
    <>
      
        <div className="mb-6 space-y-4">
          <div className="flex flex-col xl:flex-row items-start justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-0 dark:text-neutral-100">
                Recommandations des partenaires
              </h1>
              <p className="text-gray-600 dark:text-neutral-300">
                Gérer les recommandations envoyées et reçues
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Nouvelle recommandation
              </Button>
              <Button variant="outline" onClick={() => setListModal(true)}>
                Créer une liste
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
            <Staticscard
              heading="En attente"
              value={overview?.pending || 0}
              bgcolor="bg-blue-100"
              icon={<Clock size={20} />}
              iconcolor="text-blue-600"
            />
            <Staticscard
              subheading={""}
              heading="Accepté"
              value={overview?.accepted || 0}
              bgcolor="bg-green-100"
              icon={<CheckCircle size={20} />}
              iconcolor="text-green-600"
            />
            <Staticscard
              heading="Converti"
              value={overview?.converted || 0}
              bgcolor="bg-yellow-100"
              icon={<Award size={20} />}
              iconcolor="text-yellow-600"
            />
            <Staticscard
              heading="Revenu"
              value={`€ ${overview?.totalRevenue || 0}`}
              bgcolor="bg-purple-100"
              icon={<Euro size={20} />}
              iconcolor="text-purple-600"
            />
            <Staticscard
              heading="Envoyé"
              value={overview?.sent || 0}
              bgcolor="bg-pink-100"
              icon={<Send size={20} />}
              iconcolor="text-pink-600"
            />
            <Staticscard
              heading="Taux de réussite"
              value={`${overview?.successRate || 0}%`}
              bgcolor="bg-orange-100"
              icon={<TrendingUp size={20} />}
              iconcolor="text-orange-600"
            />
          </div>

          {/* FILTER */}
          <div className="bg-white dark:bg-darkmode p-4 rounded-xl mt-4">
            <div className="flex flex-col sm:flex-row  gap-3">
              <div className="flex-1">
                <InputGroup
                  placeholder="Rechercher un client…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="min-w-28">
                <CustomSelect
                  options={priority}
                  value={priority.find((p) => p.value === priorityValue)}
                  onChange={(opt) => setPriorityValue(opt?.value || "")}
                  placeholder="Filtre de statut"
                />
              </div>
            </div>
          </div>

          <Globaltabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                label: `Reçu (${receivedList.length})`,
                content: loading ? (
                  <Skeleton height={200} />
                ) : receivedList.length === 0 ? (
                  <div className="text-center p-6">
                    Aucune recommandation reçue
                  </div>
                ) : (
                  receivedList.map((i) => {
                    const rec = i.recommendation;
                    const status = rec.status;
                    return (
                      <div
                        key={i.id}
                        className="bg-white dark:bg-darkmode flex flex-col gap-2 p-4 rounded shadow mb-3"
                      >
                        <h3 className="text-lg dark:text-neutral-100">
                          {rec.clientName}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-neutral-300">
                          {rec.clientEmail}
                        </p>
                        <p className="text-sm text-gray-600">
                          {rec.description}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-neutral-300 capitalize">
                          Statut:{" "}
                          <span
                            className={
                              status === "pending"
                                ? "text-orange-500"
                                : status === "accepted"
                                  ? "text-green-600"
                                  : "text-red-600"
                            }
                          >
                            {getStatusLabel(status)}
                          </span>
                        </p>
                        <h3 className="text-lg dark:text-neutral-100">
                          Informations de contact
                        </h3>
                        <div className="dark:text-neutral-300 text-sm space-y-2">
                          <p>Nom du client - {rec?.clientName}</p>
                          <p>Adresse e-mail du client - {rec?.clientEmail}</p>
                          <p>Téléphone du client - {rec?.clientPhone}</p>
                          <p data-no-translate>
                            Date de l’événement -{" "}
                            {moment(rec?.eventDate).format("DD MMM YYYY")}
                          </p>
                        </div>

                        {/* ACTION BUTTONS */}
                        {status === "pending" && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="small"
                              loading={actionLoadingId === rec.id}
                              onClick={() => acceptRecommendation(rec.id)}
                            >
                              Accepté
                            </Button>

                            <Button
                              size="small"
                              variant="outline"
                              loading={actionLoadingIdReject}
                              onClick={() => rejectRecommendation(rec.id)}
                            >
                              Rejeté
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ),
              },
              {
                label: `Envoyé (${sentList.length})`,
                content: loading ? (
                  <Skeleton height={200} />
                ) : sentList.length === 0 ? (
                  <div className="text-center p-6 dark:text-neutral-300">
                    Aucune recommandation envoyée
                  </div>
                ) : (
                  sentList.map((i) => (
                    <div
                      key={i.id}
                      className="bg-white dark:bg-darkmode flex flex-col gap-1 p-4 rounded shadow mb-3"
                    >
                      <h3 className="text-lg mb-0 dark:text-neutral-100 capitalize">
                        {i.clientName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-neutral-300">
                        {i.clientEmail}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-neutral-300 capitalize">
                        Statut: {getStatusLabel(i.status)}
                      </p>

                      <h3 className="text-lg dark:text-white">
                        Informations de contact
                      </h3>
                      <p>Nom du client - {i?.clientName}</p>
                      <p>Adresse e-mail du client - {i?.clientEmail}</p>
                      <p>Téléphone du client - {i?.clientPhone}</p>
                      <p data-no-translate>
                        Date de l’événement -{" "}
                        {moment(i?.eventDate).format("DD MMM YYYY")}
                      </p>
                    </div>
                  ))
                ),
              },
            ]}
          />
        </div>
  

      {/* MODALS */}
      <CreateListModal active={ListModal} setActive={setListModal} />
      <RecommendationModal active={showModal} setActive={setShowModal} />
    </>
  );
};

export default Recommendations;
