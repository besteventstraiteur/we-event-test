import {
  Eye,
  FileOutput,
  FileStack,
  FileUp,
  FileX,
  Filter,
  FolderClock,
  Pencil,
  Plus,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Globaltabs from "./Globaltabs";
import Staticscard from "./Statics-card";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelRequest,
  getRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import CustomDatePicker from "../../../components/DatePicker";
import DataTable from "../../../components/ui/Datatable";
import DocumentTab from "./Documenttab";

export const DOCUMENT_TYPES = {
  quote: "quote",
  invoice: "invoice",
  credit_note: "credit_note",
  purchase_order: "purchase_order",
  delivery_note: "delivery_note",
};

export const DOCUMENT_STATUS_OPTIONS = [
  { label: "Brouillon", value: "draft" },
  { label: "Envoyé", value: "sent" },
  { label: "Accepté", value: "accepted" },
  { label: "Refusé", value: "refused" },
  { label: "Expiré", value: "expired" },
  { label: "Payé", value: "paid" },
  { label: "Paiement partiel", value: "partial_payment" },
  { label: "Annulé", value: "cancelled" },
];

export const useDocuments = (type: string, filters: any) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    cancelRequest();

    const params = new URLSearchParams({
      type,
      page: String(page),
      limit: "10",
      ...(filters.status && { status: filters.status }),
      ...(filters.client && { client: filters.client }),
      ...(filters.minAmount && { minAmount: filters.minAmount }),
      ...(filters.createdDate && {
        createdDate: filters.createdDate,
      }),
      ...(filters.eventDate && {
        eventDate: filters.eventDate,
      }),
    });

    try {
      const res: any = await getRequest(
        `${PROVIDER.DOCUMENT}?${params.toString()}`,
      );
      setData(res.data.data.docs);
      setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line
  }, [type, page, filters]);

  return {
    data,
    page,
    total,
    loading,
    setPage,
  };
};
const safePercent = (num: number, den: number) => {
  if (!den || den === 0) return null;
  return Math.round((num / den) * 100);
};

const percentText = (num: number, den: number, label: string) => {
  const pct = safePercent(num, den);
  return pct === null ? "N/A" : `${pct}% ${label}`;
};

const countText = (val: number) => {
  return val > 0 ? val : 0;
};

export const useDocumentStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res: any = await getRequest(`${PROVIDER.DOCUMENT}/stats`);
      setStats(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading };
};

const Document = () => {
  const documentColumns = [
    {
      key: "number",
      label: "Numéro",
    },
    {
      key: "customerName",
      label: "Client",
    },
    {
      key: "status",
      label: "Statut",
      render: (row: any) => <span className="capitalize">{row.status}</span>,
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row: any) => `€ ${row.totalAmount}`,
    },
    {
      key: "createdAt",
      label: "Créé le",
      render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <button
          onClick={() => handleEdit(row)}
          className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
        >
          <Pencil size={14} className="text-gray-600 dark:text-neutral-300" />
          <span
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                             opacity-0 group-hover:opacity-100
                                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                                             transition-opacity duration-300 whitespace-nowrap"
          >
            Modifier
          </span>
        </button>
      ),
    },
  ];

  const [priorityValue, setPriorityValue] = useState("");

  const navigate = useNavigate();

  const handleEdit = (row: any) => {
    navigate(`/provider/document-editor/${row.id}`);
  };

  const [filters, setFilters] = useState({
    status: "",
    client: "",
    minAmount: "",
    createdDate: null,
    eventDate: null,
  });

  const { data, page, total, loading, setPage } = useDocuments(
    "quote",
    filters,
  );
  const { stats } = useDocumentStats();
  const totalDocs = stats?.stats?.total ?? 0;
  const sentDocs = stats?.stats?.sent ?? 0;
  const seenDocs = stats?.stats?.seen ?? 0;
  const acceptedDocs = stats?.stats?.accepted ?? 0;
  const refusedDocs = stats?.stats?.refused ?? 0;
  const expiredDocs = stats?.stats?.expired ?? 0;
  return (
    <>
      
        <div className="mb-6">
          <div className="flex flex-col items-start xl:flex-row xl:items-center gap-5 justify-between w-full">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold dark:text-neutral-100">
                Documents commerciaux
              </h1>
              <p className="text-gray-600 dark:text-neutral-300">
                Gérez tous vos documents professionnels : devis, factures, bons
                de commande et bons de livraison
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                size="medium"
                onClick={() => navigate("/provider/templates")}
              >
                <Plus size={18} />
                Nouveau Document
              </Button>

              <Button
                size="medium"
                variant="outline"
                onClick={() => navigate("/provider/finance")}
              >
                Gérer mes factures
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Globaltabs
            tabs={[
              {
                label: `À Traiter (${stats?.tabs?.quote ?? 0})`,
                content: (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                        <Staticscard
                          heading="Total"
                          value={countText(totalDocs)}
                          subheading={
                            totalDocs === 0 ? "Aucun document" : "Devis créés"
                          }
                          bgcolor="bg-blue-100"
                          icon={<FileStack size={20} />}
                          iconcolor="text-blue-600"
                        />

                        <Staticscard
                          heading="Envoyé"
                          value={countText(sentDocs)}
                          subheading={
                            totalDocs === 0
                              ? "N/A"
                              : percentText(sentDocs, totalDocs, "du total")
                          }
                          bgcolor="bg-green-100"
                          icon={<FileUp size={20} />}
                          iconcolor="text-green-600"
                        />

                        <Staticscard
                          heading="Vu"
                          value={countText(seenDocs)}
                          subheading={
                            sentDocs === 0
                              ? "N/A"
                              : percentText(
                                  seenDocs,
                                  sentDocs,
                                  "de ceux envoyés",
                                )
                          }
                          bgcolor="bg-yellow-100"
                          icon={<Eye size={20} />}
                          iconcolor="text-yellow-600"
                        />

                        <Staticscard
                          heading="Accepté"
                          value={countText(acceptedDocs)}
                          subheading={
                            sentDocs === 0
                              ? "N/A"
                              : percentText(
                                  acceptedDocs,
                                  sentDocs,
                                  "taux d’acceptation",
                                )
                          }
                          bgcolor="bg-purple-100"
                          icon={<FileOutput size={20} />}
                          iconcolor="text-purple-600"
                        />

                        <Staticscard
                          heading="Refusé"
                          value={countText(refusedDocs)}
                          subheading={
                            sentDocs === 0
                              ? "N/A"
                              : percentText(
                                  refusedDocs,
                                  sentDocs,
                                  "de ceux envoyés",
                                )
                          }
                          bgcolor="bg-red-100"
                          icon={<FileX size={20} />}
                          iconcolor="text-red-600"
                        />

                        <Staticscard
                          heading="Expiré"
                          value={countText(expiredDocs)}
                          subheading={
                            expiredDocs === 0
                              ? "Aucun expiré"
                              : "Délais dépassés"
                          }
                          bgcolor="bg-indigo-100"
                          icon={<FolderClock size={20} />}
                          iconcolor="text-indigo-600"
                        />
                      </div>

                      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                        <span className="flex items-center gap-2 text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-300">
                          <Filter size={20} /> Filtrer
                        </span>
                        <div className="flex flex-col md:flex-row gap-3">
                          <div className="flex-1">
                            <CustomSelect
                              label="Statut"
                              options={DOCUMENT_STATUS_OPTIONS}
                              value={filters.status}
                              onChange={(v) =>
                                setFilters((p) => ({
                                  ...p,
                                  status: v?.value,
                                }))
                              }
                              placeholder="Sélectionner un statut"
                            />
                          </div>

                          <div className="flex-1">
                            <InputGroup
                              label="Client"
                              type="text"
                              value={filters.client}
                              onChange={(e) =>
                                setFilters((p) => ({
                                  ...p,
                                  client: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="flex-1">
                            <InputGroup
                              label="Montant minimum"
                              type="number"
                              value={filters.minAmount}
                              onChange={(e) =>
                                setFilters((p) => ({
                                  ...p,
                                  minAmount: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                              Date de création
                            </label>
                            <CustomDatePicker
                              placeholderText="Sélectionner une date"
                              selected={filters.createdDate}
                              onChange={(date) =>
                                setFilters((p) => ({
                                  ...p,
                                  createdDate: date
                                    ? date.toISOString().split("T")[0]
                                    : null,
                                }))
                              }
                            />
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() =>
                            setFilters({
                              status: "",
                              client: "",
                              minAmount: "",
                              createdDate: null,
                              eventDate: null,
                            })
                          }
                        >
                          Réinitialiser le filtre
                        </Button>
                      </div>

                      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                        <DataTable
                          columns={documentColumns}
                          data={data}
                          loading={loading}
                          total={total}
                          page={page}
                          limit={10}
                          onPageChange={setPage}
                        />
                      </div>
                    </div>
                  </>
                ),
              },
              {
                label: `Facture (${stats?.tabs?.invoice ?? 0})`,
                content: (
                  <DocumentTab
                    type={DOCUMENT_TYPES.invoice}
                    handleEdit={handleEdit}
                  />
                ),
              },
              // {
              //   label: `Assets (${5})`,
              //   content: <DocumentTab type={DOCUMENT_TYPES.credit_note} />,
              // },
              // {
              //   label: `Purchase Orders (${5})`,
              //   content: <DocumentTab type={DOCUMENT_TYPES.purchase_order} />,
              // },
              // {
              //   label: `Delivery Notes (${5})`,
              //   content: <DocumentTab type={DOCUMENT_TYPES.delivery_note} />,
              // },
            ]}
          />
        </div>      
    </>
  );
};

export default Document;
