import { useEffect, useState } from "react";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";

function ClientRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const { id } = useParams();

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${PROVIDER.REQUEST_QUOTE}?eventId=${id || ""}`
      );
      setRequests(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };
  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "accepted", label: "Accepté" },
    { value: "rejected", label: "Rejeté" },
    { value: "completed", label: "Terminé" },
  ];

  const fetchRequestDetails = async (id: string) => {
    try {
      setViewLoading(true);
      setModalOpen(true);
      const res = await getRequest(`${PROVIDER.GET_BY_ID_DETAILS}/${id}`);
      setSelectedRequest(res?.data?.data);
    } catch (err) {
      console.error("Error fetching details", err);
    } finally {
      setViewLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const totalRequests = requests.length;
  const onHold = requests.filter((r) => r.status === "pending").length;
  const contractsSigned = requests.filter(
    (r) => r.status === "accepted"
  ).length;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
         Demandes Clients
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
         Gérez vos prospects et convertissez-les en clients
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="space-y-3 text-center rounded-2xl bg-sky-300 p-5 dark:bg-darkmode dark:text-neutral-300">
          <div className="text-3xl font-bold">{totalRequests}</div>
          <div>Demandes Totales</div>
        </div>

        <div className="space-y-3 text-center rounded-2xl bg-amber-100 p-5 dark:bg-darkmode dark:text-neutral-300">
          <div className="text-3xl font-bold">{onHold}</div>
          <div>En Attente</div>
        </div>

        <div className="space-y-3 text-center rounded-2xl bg-stone-400 p-5 text-white dark:bg-darkmode">
          <div className="text-3xl font-bold">{contractsSigned}</div>
          <div>Contrats Signés</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-borderlight">
        {loading ? (
          <Skeleton count={6} height={40} />
        ) : requests.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">
            No requests found
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300 text-sm">
                  Nom de l’entreprise
                </th>
                <th className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300 text-sm">
                  Statut
                </th>
                <th className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300 text-sm">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300 capitalize">
                    {req.business?.name}
                  </td>

                  <td className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${
                        statusColors[req.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-3 py-4 border-b bg-white dark:bg-[#121417] dark:text-neutral-300">
                    <button
                      onClick={() => fetchRequestDetails(req.id)}
                      className="text-mainclr dark:text-neutral-300 text-sm hover:text-secondary cursor-pointer"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <OuterModal active={modalOpen} setActive={setModalOpen}>
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          {viewLoading ? (
            <p className="text-center text-gray-500">Chargement…</p>
          ) : selectedRequest ? (
            <>
             <button
                                    className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
                                    onClick={() => setModalOpen(false)}
                                  >
                                    <X />
                                  </button>
               <h2 className="text-2xl font-bold mb-4 dark:text-neutral-100">
                 Détails de la demande
              </h2>

              {/* Event Info */}

              <p className="mb-2 dark:text-gray-200">
                <span>Événement:</span> {selectedRequest?.event?.name}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Catégorie:</span>{" "}
                {selectedRequest?.event?.categoryName || "—"}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Lieu:</span> {selectedRequest?.event?.address || "—"}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Date de Début:</span>{" "}
                {selectedRequest?.event?.startDateTime
                  ? new Date(
                      selectedRequest.event.startDateTime
                    ).toLocaleString()
                  : "—"}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Date de fin:</span>{" "}
                {selectedRequest?.event?.endDateTime
                  ? new Date(selectedRequest.event.endDateTime).toLocaleString()
                  : "—"}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Nombre d’invités:</span>{" "}
                {selectedRequest?.event?.totalGuests ?? "—"}
              </p>

              <hr className="my-4 border-borderlight dark:border-neutral-700" />

              {/* Budget Info */}
              <p className="mb-2 dark:text-gray-200">
                <span>Budget:</span>{" "}
                {selectedRequest?.budget?.total
                  ? `${selectedRequest.budget.total} €`
                  : "—"}
              </p>

              <hr className="my-4 border-borderlight dark:border-neutral-700" />

              {/* Status */}
              <p className="mb-2 dark:text-gray-200">
                <span>Statut:</span>{" "}
                {
                  statusOptions.find(
                    (opt) => opt.value === selectedRequest?.status
                  )?.label
                }
              </p>
            </>
          ) : (
            <p className="text-center text-gray-500">Aucun détail trouvé</p>
          )}
        </div>
      </OuterModal>
    </div>
  );
}

export default ClientRequests;
