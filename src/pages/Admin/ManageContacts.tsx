import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import CustomModal from "../../components/Custommodal";
import { getRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import { format } from "date-fns";
import OuterModal from "../../components/Custommodal/OuterModal";
import { X } from "lucide-react";

type ContactEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string | null;
  createdAt: string;
};

type ContactAPI = {
  data: ContactEnquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const RowSkeleton = () => (
  <tr>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
  </tr>
);

function ManageContacts() {
  
  // Modal state and selection
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<ContactEnquiry | null>(null);

  // Data/ux state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rows, setRows] = useState<ContactEnquiry[]>([]);
  const [meta, setMeta] = useState<
    Pick<ContactAPI, "total" | "page" | "limit" | "totalPages">
  >({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchContactEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await getRequest(`${ADMIN.CONTACT_ENQUIRES}`);

      // Server shape is: resp.data.data = { data: ContactEnquiry[], total, page, limit, totalPages }
      const container = resp?.data?.data ?? resp?.data ?? resp;

      const list: ContactEnquiry[] = container?.data ?? [];
      const total = container?.total ?? 0;
      const page = container?.page ?? 1;
      const limit = container?.limit ?? list.length ?? 10;
      const totalPages = container?.totalPages ?? 1;

      setRows(Array.isArray(list) ? list : []);
      setMeta({ total, page, limit, totalPages });
    } catch (e: any) {
      setError(e?.message || "Failed to fetch contact enquiries.");
      setRows([]);
      setMeta({ total: 0, page: 1, limit: 10, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Lock body scroll when modal active
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active]);

  // Initial fetch
  useEffect(() => {
    fetchContactEnquiries();
  }, []);

  // Handlers
  const handleOpenDetails = (item: ContactEnquiry) => {
    setSelected(item);
    setActive(true);
  };

  const handleCloseModal = () => {
    setActive(false);
    // keep selection or clear — clearing here is fine so residual data is not shown on next open
    setSelected(null);
  };

  return (
    <>
      
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-semibold dark:text-neutral-100 mb-0">Demandes de renseignements</h1>
          <p className="text-gray-600 dark:text-neutral-300">Vérifier les demandes de contact</p>
        </div>

        <div className="guest mb-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm border border-red-200 rounded px-3 py-2 bg-red-50">
              {error}
            </div>
          )}

         

          <div className="guest__table" aria-busy={loading}>
            <div className="overflow-x-auto rounded-3xl border border-borderlight dark:border-neutral-700">
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
                      Numéro de téléphone
                    </th>
                    <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                     Adresse
                    </th>
                    <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                     Créé
                    </th>
                    <th className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium">
                    Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <RowSkeleton key={i} />
                      ))}
                    </>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm"
                        colSpan={6}
                      >
                        Aucun enregistrement trouvé
                      </td>
                    </tr>
                  ) : (
                    rows.map((e) => (
                      <tr key={e.id}>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm capitalize">
                          {e.name || "—"}
                        </td>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          {e.email || "—"}
                        </td>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          {e.phone || "—"}
                        </td>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          {e.address || "—"}
                        </td>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          {formatDate(e.createdAt)}
                        </td>
                        <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleOpenDetails(e)}
                          >
                           Voir
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && (
              <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                <span className="dark:text-neutral-300">
                    Affichage {rows.length} de {meta?.total ?? 0}
                </span>
              
              </div>
            )}
          </div>

          
        </div>
      

      {/* Details / Add modal */}

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button onClick={() => setActive(false)} className="absolute top-4 right-4 cursor-pointer">
           <X
            className=" dark:text-neutral-300"            
          />
          </button>  

          <h2 className="text-2xl font-semibold mb-6 dark:text-neutral-100">
            Demandes de renseignements
          </h2>

          {/* Content */}

          {selected ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold mr-3 dark:text-neutral-300">
                  Nom:
                </span>
                <span className="text-gray-700 dark:text-gray-100">
                  {selected.name || "—"}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold mr-3 dark:text-neutral-300">
                 E-mail:
                </span>
                <span className="text-gray-700 dark:text-gray-100 break-all">
                  {selected.email || "—"}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold mr-3 dark:text-neutral-300">
                  Numéro de téléphone:
                </span>
                <span className="text-gray-700 dark:text-gray-100">
                  {selected.phone || "—"}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold mr-3 dark:text-neutral-300">
                 Adresse:
                </span>
                <span className="text-gray-700 dark:text-gray-100 text-right">
                  {selected.address || "—"}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold mr-3 dark:text-neutral-300">
                 Créé:
                </span>
                <span className="text-gray-700 dark:text-gray-100">
                  {formatDate(selected.createdAt)}
                </span>
              </div>

              <div className="pt-4">
                <span className="block font-semibold mb-3 dark:text-neutral-300">
                 Message
                </span>
                <div className="rounded-lg border border-borderlight dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-3 text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                  {selected.message?.trim() || "—"}
                </div>
              </div>
            </div>
          ) : (
            // Placeholder for future create form
            <div className="text-center text-gray-600 dark:text-gray-200">
             Aucune demande sélectionnée.s
            </div>
          )}
        </div>
      </OuterModal>
    </>
  );
}

export default ManageContacts;
