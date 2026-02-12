import { useEffect, useState, useCallback } from "react";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { ADMIN, PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import {
  Users,
  DollarSign,
  Trophy,
  Search,
  Award,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InputGroup from "../../components/ui-main/InputGroup";
import OuterModal from "../../components/Custommodal/OuterModal";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function AdminAffiliateDashboard() {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ambassadors");
  const [stats, setStats] = useState<any>(null);
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🆕 Sponsor Code Update Modal
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [savingCode, setSavingCode] = useState(false);
  const [manualSponsorCode, setManualSponsorCode] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await getRequest(ADMIN.AFFILATE_DASHBOARD);
      if (res?.data?.success) setStats(res.data.data);
    } catch {
      toast.error("Impossible de récupérer les statistiques");
    }
  }, [toast]);

  const fetchAmbassadors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${ADMIN.AFFILATE_USER}?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      if (res?.data?.success && Array.isArray(res.data.data.data)) {
        setAmbassadors(res.data.data.data);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        setAmbassadors([]);
      }
    } catch {
      toast.error("Échec de la récupération des ambassadeurs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, toast]);

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${ADMIN.COMMINSION_HISTORY}?page=${page}&limit=${limit}`
      );
      if (res?.data?.success && Array.isArray(res.data.data.commissions)) {
        setCommissions(res.data.data.commissions);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        setCommissions([]);
      }
    } catch {
      toast.error("Échec de la récupération des commissions.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, toast]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${ADMIN.LEADERBOARD}?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      if (res?.data?.success && Array.isArray(res.data.data.leaderboard)) {
        setLeaderboard(res.data.data.leaderboard);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        setLeaderboard([]);
      }
    } catch {
      toast.error("Échec du chargement du classement.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "ambassadors") fetchAmbassadors();
    else if (activeTab === "commissions") fetchCommissions();
    else fetchLeaderboard();
  }, [
    activeTab,
    page,
    searchTerm,
    fetchAmbassadors,
    fetchCommissions,
    fetchLeaderboard,
  ]);

  // ------------------ COMPONENTS ------------------
  const SummaryCard = ({ title, value, icon }: any) => (
    <div className="bg-white dark:bg-darkmode rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold dark:text-neutral-300">{value}</h3>
          {icon}
        </div>
      </div>
    </div>
  );

  const LoadingSkeletons = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={80} className="rounded-xl" />
      ))}
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center mt-6 gap-3">
      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
        className={`flex items-center gap-1 px-3 py-1 rounded-md dark:text-neutral-300 border ${
          page <= 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <ChevronLeft size={16} /> Précédent
      </button>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage((p) => p + 1)}
        className={`flex items-center gap-1 px-3 py-1 rounded-md border ${
          page >= totalPages
            ? "opacity-40 cursor-not-allowed dark:text-neutral-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-neutral-300"
        }`}
      >
        Suivant <ChevronRight size={16} />
      </button>
    </div>
  );

  // ------------------ SPONSOR CODE UPDATE ------------------
  const openSponsorModal = (user: any) => {
    setSelectedUser(user);
    setManualSponsorCode("");
    setShowSponsorModal(true);
  };

  const handleSponsorCodeSave = async () => {
    if (!selectedUser || !manualSponsorCode.trim()) {
      toast.error("Please enter a sponsor code");
      return;
    }

    try {
      setSavingCode(true);
      const checkRes = await getRequest(
        `${PROVIDER.CHECK_CODE}?referralCode=${manualSponsorCode}`
      );
      
      if (!checkRes?.data?.data?.valid) {
        toast.error("Le code de parrainage n’est pas valide.");
        return;
      }
      const payload = {
        sponsorCode: manualSponsorCode,
        userId: selectedUser.user_id,
      };
      const saveRes = await postRequest(
        `${ADMIN.ASSIGN_SPONSAR_CODE}`,
        payload
      );

      if (saveRes?.data?.success) {
        toast.success("Code sponsor mis à jour avec succès !");
        setShowSponsorModal(false);
        fetchAmbassadors();
      } else {
        toast.error(saveRes?.data?.message || "Échec de la mise à jour du code sponsor");
      }
    } catch (err) {
      
      toast.error("Erreur lors de la mise à jour du code sponsore");
    } finally {
      setSavingCode(false);
    }
  };

  const filteredAmbassadors = ambassadors.filter((a) =>
    `${a.firstName} ${a.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredLeaderboard = leaderboard.filter((a) =>
    `${a.firstName} ${a.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
         Tableau de bord des affiliés
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
        Tableau de bord des affiliés
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total des ambassadeurs"
          value={
            stats?.rank_counts?.reduce(
              (sum: number, rank: any) => sum + rank.total_users,
              0
            ) || 0
          }
          icon={<Users size={22} className="text-gray-400" />}
        />
        <SummaryCard
          title="Total des commissions"
          value={`${stats?.total_commission_distributed || 0}€`}
          icon={<DollarSign size={22} className="text-gray-400" />}
        />
        <SummaryCard
          title="Meilleur contributeur"
          value={
            stats?.top_performer
              ? `${stats.top_performer.firstName} ${stats.top_performer.lastName}`
              : "N/A"
          }
          icon={<Trophy size={22} className="text-gray-400" />}
        />
      </div>

      <div className="flex gap-2 border-b border-borderlight dark:border-neutral-700 mb-5">
        {[
          { id: "ambassadors", label: "Ambassadeurs" },
          { id: "commissions", label: "Commissions" },
          { id: "leaderboard", label: "Classement" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-t-lg ${
              activeTab === tab.id
                ? "bg-white border border-b-0 border-borderlight dark:border-neutral-700 dark:bg-neutral-800  dark:text-neutral-300"
                : "bg-gray-100 text-gray-500 hover:text-mainclr dark:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "commissions" && (
        <div className="relative mb-4 w-full sm:w-80">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <InputGroup
            type="text"
            placeholder="Rechercher par nom…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      )}

      {loading ? (
        <LoadingSkeletons />
      ) : activeTab === "ambassadors" ? (
        <div>
          {filteredAmbassadors.length === 0 ? (
            <p className="text-gray-500">Aucun ambassadeur trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAmbassadors.map((a, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 dark:text-neutral-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg capitalize font-semibold dark:text-neutral-300">
                      {a.firstName} {a.lastName}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize ${
                        a.role === "client"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {a.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{a.email}</p>
                  <span className="text-sm">
                    <strong>Code de parrainage:</strong>{" "}
                    <span className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-500">
                      {a.referralCode || "N/A"}
                    </span>
                  </span>
                  <div className="space-y-1 text-sm mb-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>Code sponsor:</strong>{" "}
                        <span className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-500">
                          {a.referredByCode || "N/A"}
                        </span>
                      </span>
                      {!a.referredByCode && (
                        <button
                          onClick={() => openSponsorModal(a)}
                          className="cursor-pointer text-blue-500 text-xs flex items-center gap-1 hover:underline"
                        >
                          <RefreshCw size={14} /> Changer le code
                        </button>
                      )}
                    </div>
                    <div>
                      Parrainages: {a.total_direct_referrals}
                    </div>
                    <div>Parrainé par: {a.referredByName || "--"}</div>
                    <div>
                      Taille du réseau: {a.total_network_size}
                    </div>
                    <div>
                      Gains totaux: {a.total_earning}€
                    </div>
                    <div>
                      Gains en attente: {a.balance}€
                    </div>
                    <div>Rang: {a.rank_name}</div>
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      navigate(`/admin/view-refferal/${a.user_id}`)
                    }
                  >
                    Voir le réseau
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Pagination />
        </div>
      ) : activeTab === "commissions" ? (
        <div className="bg-white dark:bg-darkmode p-4 rounded-xl">
          <h3 className="text-xl heading-font font-semibold mb-4 dark:text-neutral-100">
          Historique des commissions
          </h3>
          {commissions.length === 0 ? (
            <p className="text-gray-500 text-sm">
             Aucune commission trouvée
            </p>
          ) : (
            <div className="space-y-3">
              {commissions.map((c, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center rounded-xl p-3 bg-gray-100 dark:bg-neutral-800"
                >
                  <div>
                    <h4 className="font-semibold dark:text-neutral-300 capitalize">
                      {c.firstName} {c.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      €{c.commission} Montant de la commission
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status === "paid" ? "Payé" : "En attente"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Pagination />
        </div>
      ) : (
        <div className="bg-white dark:bg-darkmode p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-neutral-100">
            <Award className="text-gray-600 dark:text-neutral-300" size={20} />{" "}
            Meilleurs ambassadeurs
          </h3>
          {filteredLeaderboard.length === 0 ? (
            <p className="text-gray-600 dark:text-neutral-300 text-sm">
              Aucun classement disponible.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredLeaderboard.map((l, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center rounded-xl p-3 bg-gray-100 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-bold">
                      {idx + 1 + (page - 1) * limit}
                    </div>
                    <div>
                      <p className="font-semibold capitalize dark:text-neutral-300">
                        {l.firstName} {l.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Parrainages: {l.total_direct_referrals}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {l.total_earning}€
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination />
        </div>
      )}

      {/* Sponsor Manual Entry Modal */}

      <OuterModal
        active={showSponsorModal}
        setActive={setShowSponsorModal}
      
      >
        <div className="max-w-2xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative text-center">

           <button className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowSponsorModal(false)} aria-label="Fermer la fenêtre de mise à niveau">
            <X
            className="dark:text-neutral-300"
           
          />
           </button>
           

          <div className="mb-6 space-y-4">
            <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-300">
           Saisir le nouveau code de parrainage
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Attribuer un nouveau code de parrainage pour{" "}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
          </p>
          </div>
          

          <InputGroup
            type="text"
            placeholder="Saisir le code de parrainage"
            value={manualSponsorCode}
            onChange={(e) => setManualSponsorCode(e.target.value)}
            className="text-center"
          />

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button className="flex-1"
            variant="outline"
             onClick={() => setShowSponsorModal(false)}>Annuler</Button>

            <Button
              className="flex-1"
              onClick={handleSponsorCodeSave}
              loading={savingCode}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
}
