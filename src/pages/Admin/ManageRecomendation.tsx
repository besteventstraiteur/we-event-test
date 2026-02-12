import { useEffect, useState, useMemo } from "react";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { format } from "date-fns";
import DataTable from "../../components/ui/Datatable";
import Staticscard from "../provider/Sales/Statics-card";
import { CheckCircle, FileText, XCircle } from "lucide-react";
import CustomSelect from "../../components/ui-main/selectBox";

type Recommendation = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string | null;
  budget: number | null;
  status: string;
  createdAt: string;
  sender: string;
  partners: string[];
};
type RecommendationStats = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
};

export default function ManageRecomendation() {
  const [rows, setRows] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [userType, setUserType] = useState<string>("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const userTypeOptions = [
    { label: "Tous", value: "" },
    { label: "Prestataire", value: "partner" },
    { label: "Client", value: "client" },
  ];
  const fetchRecommendations = async (pageNo = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(pageNo),
        limit: String(limit),
        ...(userType ? { userType } : {}),
      }).toString();

      const res = await getRequest(`${PROVIDER.RECOMENDATION_ALL}?${params}`);

      const container = res?.data?.data;

      setRows(container?.data || []);
      setTotal(container?.total || 0);
      setPage(container?.page || 1);
      setLimit(container?.limit || 10);
      setStats(container?.stats || null);
    } catch (error) {
      
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [userType]);

  useEffect(() => {
    fetchRecommendations(page);
  }, [page,userType]);

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch {
      return "—";
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "clientName",
        label: "Nom du client",
      },
      {
        key: "clientEmail",
        label: "E-mail",
      },
      {
        key: "clientPhone",
        label: "Téléphone",
        render: (row: Recommendation) => row.clientPhone || "—",
      },
      {
        key: "budget",
        label: "Budget (€)",
        render: (row: Recommendation) => (row.budget ? `€${row.budget}` : "—"),
      },
      {
        key: "eventDate",
        label: "Date de l'événement",
        render: (row: Recommendation) => formatDate(row.eventDate),
      },
      {
        key: "createdAt",
        label: "Créé",
        render: (row: Recommendation) => formatDate(row.createdAt),
      },
      {
        key: "sender",
        label: "Expéditeur",
      },
      {
        key: "partners",
        label: "Partenaires",
        render: (row: Recommendation) =>
          row.partners?.length ? row.partners.join(", ") : "—",
      },
      {
        key: "status",
        label: "Statut",
        render: (row: Recommendation) => (
          <span
            className={`px-3 py-1 rounded-full text-xs leading-4 capitalize ${
              row.status === "accepted"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {row.status}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-6">
      Recommandations
      </h2>
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Staticscard
            heading="Recommandations totales"
            value={stats.total}
            subheading="Toutes les recommandations reçues"
            icon={<FileText size={18} />}
            bgcolor="bg-blue-100"
            iconcolor="text-blue-600"
          />

          <Staticscard
            heading="Accepté"
            value={stats.accepted}
            subheading="Recommandations approuvées"
            icon={<CheckCircle size={18} />}
            bgcolor="bg-green-100"
            iconcolor="text-green-600"
          />

          <Staticscard
            heading="Refusé"
            value={stats.rejected}
            subheading="Recommandations refusées"
            icon={<XCircle size={18} />}
            bgcolor="bg-red-100"
            iconcolor="text-red-600"
          />
        </div>
      )}
      <div className="flex gap-3 mb-4">
        <CustomSelect
          options={userTypeOptions}
          placeholder="Filtrer par type d'utilisateur"
          className="w-full sm:w-64"
          value={userTypeOptions.find((o) => o.value === userType)}
          onChange={(opt: any) => setUserType(opt?.value || "")}
        />
      </div>
      <DataTable<Recommendation>
        columns={columns}
        data={rows}
        loading={loading}
        skeletonRows={8}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => setPage(p)}
        emptyText="Aucune recommandation trouvée"
      />
    </>
  );
}
