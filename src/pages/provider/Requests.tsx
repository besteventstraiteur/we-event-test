import { useEffect, useState } from "react";
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import CustomSelect from "../../components/ui-main/selectBox";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import { X } from "lucide-react";

function Requests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const res = await getRequest(PROVIDER.REQUEST_QUOTE);
      setRequests(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetails = async (id: string) => {
    try {
      setViewLoading(true);
      setModalOpen(true);
      const res = await getRequest(`${PROVIDER.GET_BY_ID_DETAILS}/${id}`);
      setSelectedRequest(res?.data?.data);
    } catch (err) {
      console.error("Error fetching request details", err);
    } finally {
      setViewLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setStatusLoading(id);
      await patchRequest(`${PROVIDER.UPDATE_STATUS}/${id}/status`, { status });
      await fetchAllRequests();
    } catch (err) {
      console.error("Error updating status", err);
    } finally {
      setStatusLoading(null);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const totalRequests = requests.length;
  const onHold = requests.filter((r) => r.status === "pending").length;
  const contractsSigned = requests.filter(
    (r) => r.status === "accepted",
  ).length;

  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "accepted", label: "Accepté" },
    { value: "rejected", label: "Rejeté" },
    { value: "completed", label: "Terminé" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "36px",
      height: "36px",
      boxShadow: "none",
      paddingTop: "2px",
      fontSize: "14px",
      maxWidth: "200px",
      borderColor: state.isFocused ? "#d4d7e3" : "#d4d7e3",
      "&:hover": { borderColor: "#d4d7e3" },
    }),
  };
  const formatDateTime = (dateValue: any) => {
    if (!dateValue) return "—";

    const d = new Date(dateValue);

    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Demandes Clients
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérez vos prospects et convertissez-les en clients
        </p>
      </div>

      {/* Stats */}
      <div className="request-history">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <>
              <Skeleton height={100} />
              <Skeleton height={100} />
              <Skeleton height={100} />
              Customer Requests
            </>
          ) : (
            <>
              <div className="space-y-3 text-center rounded-2xl bg-sky-300 dark:bg-darkmode dark:text-neutral-300 p-5">
                <div className="text-3xl font-bold">{totalRequests}</div>
                <div className="capitalize">Demandes Totales</div>
              </div>
              <div className="space-y-3 text-center rounded-2xl bg-amber-100 dark:bg-darkmode dark:text-neutral-300 p-5">
                <div className="text-3xl font-bold">{onHold}</div>
                <div className="capitalize">En Attente</div>
              </div>
              <div className="space-y-3 text-center rounded-2xl bg-stone-400 dark:bg-darkmode text-white p-5">
                <div className="text-3xl font-bold">{contractsSigned}</div>
                <div className="capitalize">Contrats Signés</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-borderlight dark:border-neutral-700">
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
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Nom
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  E-mail
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Téléphone
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Événement
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Date de Début
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Statut
                </th>
                <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm capitalize">
                    {req?.user?.firstName} {req?.user?.lastName}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    {req?.user?.email}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    {req?.user?.phoneNumber}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    {req?.event?.name}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    {formatDateTime(req?.event?.startDateTime)}{" "}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    {statusLoading === req.id ? (
                      <span className="text-sm text-gray-500">Updating...</span>
                    ) : (
                      <CustomSelect
                        options={statusOptions}
                        styles={{
                          ...customStyles,
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                        value={statusOptions.find(
                          (opt) => opt.value === req.status,
                        )}
                        onChange={(val) =>
                          updateStatus(req.id, (val as any)?.value)
                        }
                        menuPortalTarget={document.body}
                      />
                    )}
                  </td>

                  <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                    <button
                      onClick={() => fetchRequestDetails(req.id)}
                      className="text-mainclr dark:text-neutral-300 hover:text-secondary cursor-pointer"
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

      {/* Modal */}
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

              {/* Customer Info */}
              <p className="mb-2 dark:text-gray-200 capitalize">
                <span>Nom:</span> {selectedRequest?.user?.firstName}{" "}
                {selectedRequest?.user?.lastName}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>E-mail:</span> {selectedRequest?.user?.email}
              </p>

              <p className="mb-2 dark:text-gray-200">
                <span>Téléphone:</span> {selectedRequest?.user?.phoneNumber}
              </p>

              <hr className="my-4 border-borderlight dark:border-neutral-700" />

              {/* Event Info */}
              <p className="mb-2 dark:text-gray-200 capitalize">
                <span>Événement:</span> {selectedRequest?.event?.name}
              </p>

              <p className="mb-2 dark:text-gray-200 capitalize">
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
                      selectedRequest.event.startDateTime,
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
                  ? ` €${selectedRequest.budget.total}`
                  : "—"}
              </p>

              <hr className="my-4 border-borderlight dark:border-neutral-700" />

              {/* Status */}
              <p className="mb-2 dark:text-gray-200">
                <span>Statut:</span>{" "}
                {
                  statusOptions.find(
                    (opt) => opt.value === selectedRequest?.status,
                  )?.label
                }
              </p>
            </>
          ) : (
            <p className="text-center text-gray-500">Aucun détail trouvé</p>
          )}
        </div>
      </OuterModal>
    </>
  );
}

export default Requests;
