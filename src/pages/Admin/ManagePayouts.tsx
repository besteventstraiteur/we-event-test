import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useToast } from "../../utils/toast";
import { Search, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import DataTable from "../../components/ui/Datatable";

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ReferralPayouts() {
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

  // Modal States
  const [editModal, setEditModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
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

      const res = await getRequest(`${ADMIN.GET_PAYOUTS}?${params}`);
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
      const res = await patchRequest(ADMIN.CHANGE_PAYOUT_STATUS, payload);
      if (res?.data?.success) {
        toast.success("Statut de paiement mis à jour avec succès");
        setEditModal(false);
        fetchPayouts();
      } else {
        toast.error(res?.data?.message || "Failed to update payout");
      }
    } catch (err) {
      console.error("Error updating payout:", err);
      toast.error("Échec de la mise à jour du statut de paiement");
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID de paiement",
        render: (i: any) => (
          <span className="font-medium dark:text-neutral-300">#{i.id}</span>
        ),
      },
      {
        key: "userId",
        label: "ID de l'utilisateur",
        render: (i: any) => (
          <span className="text-gray-700 dark:text-neutral-300 font-medium">
            {i.userId}
          </span>
        ),
      },
      {
        key: "amount",
        label: "Montant (€)",
        render: (i: any) => (
          <span className="font-semibold dark:text-neutral-300">
            {i.amount}
          </span>
        ),
      },
      {
        key: "bankName",
        label: "Informations bancaires",
        render: (i: any) => (
          <div>
            <div className="font-medium">{i.bankName}</div>
            <div className="text-xs text-gray-500 dark:text-neutral-300">
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
        label: "Actions",
        render: (i: any) =>
          i.status === "paid" ? (
            <span className="text-gray-400 dark:text-neutral-300 text-sm">
              Déjà payé
            </span>
          ) : (
            <Button
              className="text-sm bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedPayout(i);
                setNote("");
                setEditModal(true);
              }}
            >
              Mettre à jour le statut
            </Button>
          ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Rémunération des parrainages
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérer et mettre à jour les demandes de paiement de parrainage des
          utilisateurs.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-6">
        <CustomSelect
          options={statusOptions}
          value={
            statusOptions.find((o) => o.value === status) || statusOptions[0]
          }
          onChange={(opt: any) => setStatus(opt?.value || "")}
          placeholder="Filtrer par statut"
          className="w-1/2 md:w-96 flex-1"
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

      <OuterModal active={editModal} setActive={setEditModal}>
        <div className="max-w-lg mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => setEditModal(false)}
            aria-label="Fermer la fenêtre de mise à niveau"
          >
            <X className="dark:text-neutral-300" />
          </button>

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
            label="Sélectionner le nouveau statut"
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
            placeholder="Sélectionner le statut"
            className="capitalize"
          />
          <div className="mt-4">
            <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
              Note (facultatif)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-300 dark:border-neutral-700 rounded-lg p-2 w-full dark:bg-neutral-800 dark:text-neutral-300"
              placeholder="Saisir une note..."
              rows={3}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setEditModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
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
    </>
  );
}
