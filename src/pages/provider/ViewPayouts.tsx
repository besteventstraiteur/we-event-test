import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useToast } from "../../utils/toast";
import { Search, Loader2 } from "lucide-react";
import DataTable from "../../components/ui/Datatable";

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ReferralPayoutsPartner() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [note, setNote] = useState("");

  const statusOptions = [
    { value: "", label: "Tout" },
    { value: "pending", label: "En attente" },
    { value: "processing", label: "En cours de traitement" },
    { value: "paid", label: "Payé" },
    { value: "rejected", label: "Rejeté" },
  ];

  // Fetch payouts
  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: debouncedSearch || "",
        ...(status ? { status } : {}),
      }).toString();

      const res = await getRequest(`${PROVIDER.PAYOUT}?${params}`);
      if (res?.data?.success) {
        const data = res.data.data;
        setRows(data.payouts || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setRows([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch payouts:", err);
      toast.error("Échec du chargement des paiements");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, status, toast]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  // Update payout status
  const handleStatusUpdate = async (status: string) => {
    if (!selectedPayout) return;
    setUpdateLoading(true);
    try {
      const payload = {
        payoutId: selectedPayout.id,
        status,
        note,
      };
      const res = await patchRequest(PROVIDER.CHANGE_PAYOUT_STATUS, payload);
      if (res?.data?.success) {
        toast.success("Le statut du paiement a été mis à jour avec succès");
        setEditModal(false);
        fetchPayouts();
      } else {
        toast.error(res?.data?.message || "Échec de la mise à jour du paiement");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du paiement:", err);
      toast.error("Échec de la mise à jour du statut du paiement");
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID de paiement",
        render: (i: any) => <span className="font-medium">#{i.id}</span>,
      },
      {
        key: "userId",
        label: "ID de l'utilisateur",
        render: (i: any) => (
          <span className="text-gray-700 font-medium">{i.userId}</span>
        ),
      },
      {
        key: "amount",
        label: "Montant (€)",
        render: (i: any) => <span className="font-semibold">{i.amount}</span>,
      },
      {
        key: "bankName",
        label: "Informations bancaires",
        render: (i: any) => (
          <div>
            <div className="font-medium">{i.bankName}</div>
            <div className="text-xs text-gray-500">
              {i.accountNumber
                ?.slice(-4)
                ?.padStart(i.accountNumber.length, "•")}
            </div>
          </div>
        ),
      },
      {
        key: "status",
        label: "Statut",
        render: (i: any) => {
          const cls =
            i.status === "paid"
              ? "bg-green-100 text-green-700"
              : i.status === "processing"
              ? "bg-yellow-100 text-yellow-700"
              : i.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700";
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${cls}`}
            >
              {i.status}
            </span>
          );
        },
      },
      {
        key: "createdAt",
        label: "Demandé le",
        render: (i: any) =>
          new Date(i.createdAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
      {
        key: "actions",
        label: "Actes",
        render: (i: any) => (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="text-xs bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => {
                setViewData(i);
                setViewModal(true);
              }}
            >
              Voir
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Rémunération des parrainages</h1>
        <p className="text-gray-600 mt-1 dark:text-neutral-300">
          Consultez l'historique de vos paiements de parrainage.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 my-6 items-start md:items-center">
        {/* <div className="relative w-full flex-2">
          <Search className="absolute left-3 top-4 text-gray-400" size={20} />
          <InputGroup
            type="text"
            placeholder="Search by user ID or bank..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="ps-10 bg-white w-full md:min-w-80"
          />
        </div> */}

        <CustomSelect
          options={statusOptions}
          value={
            statusOptions.find((o) => o.value === status) || statusOptions[0]
          }
          onChange={(opt: any) => setStatus(opt?.value || "")}
          placeholder="Filtrer par statut"
          className="w-1/2 md:w-96"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              height={40}
              className="rounded-md dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={rows}
          loading={loading}
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
          columns={columns}
        />
      )}

      {/* Edit Modal */}
      <OuterModal
        active={editModal}
        setActive={setEditModal}
        showClose
        title="Update Payout Status"
      >
        <div className="max-w-lg mx-auto bg-white dark:bg-darkmode p-6 rounded-xl shadow-lg mt-10">
          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
            Paiement #{selectedPayout?.id}
          </h2>
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              ID utilisateur: <strong>{selectedPayout?.userId}</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              Montant: <strong>€{selectedPayout?.amount}</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              Banque:{" "}
              <strong>
                {selectedPayout?.bankName} ({selectedPayout?.accountNumber})
              </strong>
            </p>
          </div>

          <CustomSelect
            label="Sélectionner un nouveau statut"
            options={[
              { label: "En cours de traitement", value: "processing" },
              { label: "Payé", value: "paid" },
              { label: "Rejeté", value: "rejected" },
            ]}
            value={
              selectedPayout?.status
                ? { label: selectedPayout.status, value: selectedPayout.status }
                : null
            }
            onChange={(opt: any) =>
              setSelectedPayout((prev: any) => ({
                ...prev,
                status: opt?.value,
              }))
            }
            placeholder="Sélectionner un statut"
          />

          <div className="mt-4">
            <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
              Note (facultatif)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full dark:bg-darkmode dark:text-neutral-300"
              placeholder="Saisir une note…"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setEditModal(false)}>Cancel</Button>
            <Button
              onClick={() => handleStatusUpdate(selectedPayout?.status || "")}
              loading={updateLoading}
            >
              {updateLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </div>
      </OuterModal>

      {/* View Details Modal */}
      <OuterModal
        active={viewModal}
        setActive={setViewModal}
        showClose
        title="Détails du paiement"
      >
        <div className="max-w-lg mx-auto bg-white dark:bg-darkmode p-6 rounded-xl shadow-lg mt-10">
          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
            Paiement #{viewData?.id}
          </h2>

          <div className="space-y-2 text-sm dark:text-gray-300">
            <p>
              <strong>ID utilisateur:</strong> {viewData?.userId}
            </p>
            <p>
              <strong>Montant:</strong> €{viewData?.amount}
            </p>
            <p>
              <strong>Statut:</strong>{" "}
              <span className="capitalize">{viewData?.status}</span>
            </p>
            <p>
              <strong>Nom de la banque:</strong> {viewData?.bankName}
            </p>
            <p>
              <strong>Numéro de compte:</strong> {viewData?.accountNumber}
            </p>
            <p>
              <strong>Code IFSC:</strong> {viewData?.ifscCode}
            </p>
            <p>
              <strong>Code SWIFT:</strong> {viewData?.swiftCode}
            </p>
            <p>
              <strong>Note:</strong>{" "}
              {viewData?.note ? (
                <span>{viewData.note}</span>
              ) : (
                <span className="text-gray-400">Aucune note fournie</span>
              )}
            </p>
            <p>
              <strong>Demandé le:</strong>{" "}
              {viewData?.createdAt
                ? new Date(viewData.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>
            <p>
              <strong>Dernière mise à jour:</strong>{" "}
              {viewData?.updatedAt
                ? new Date(viewData.updatedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setViewModal(false)}>Fermer</Button>
          </div>
        </div>
      </OuterModal>
    </div>
  );
}
