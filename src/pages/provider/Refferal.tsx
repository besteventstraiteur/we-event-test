import { useEffect, useState } from "react";
import {
  Award,
  BriefcaseBusinessIcon,
  Copy,
  Crown,
  Target,
} from "lucide-react";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useToast } from "../../utils/toast";
import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useNavigate } from "react-router-dom";

function Refferal() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("tab1");
  const [loading, setLoading] = useState(false);
  const [loadingPayout, setLoadingPayout] = useState(false);
  const login = useSelector((state) => state?.login?.user || {});
  const logindsd = useSelector((state) => state?.login || {});
  const [dashboard, setDashboard] = useState<any>(null);
  const [network, setNetwork] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  
  // MODALS
  const [showBankModal, setShowBankModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const navigate = useNavigate();
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [dashRes, netRes, rankRes, earnRes] = await Promise.all([
        getRequest(PROVIDER.OWN_AFFILATE_DATA),
        getRequest(PROVIDER.GET_NETWORK),
        getRequest(PROVIDER.GET_ALL_RANK),
        getRequest(
          `${PROVIDER.OWN_AFFILATE_DATA.replace("/dashboard", "/earning")}`
        ),
      ]);

      if (dashRes?.data?.success) {
        const dash = dashRes.data.data;
        if (!dash?.referralCode) {
          const codeRes = await postRequest(PROVIDER.GENERATE_CODE);
          if (codeRes?.data?.success) {
            dash.referralCode = codeRes.data.data.referralCode;
            toast.success("Referral code generated successfully");
          }
        }
        setDashboard(dash);
      }

      if (netRes?.data?.success) setNetwork(netRes.data.data?.data || []);
      if (rankRes?.data?.success) setRanks(rankRes.data.data || []);
      if (earnRes?.data?.success) setEarnings(earnRes.data.data);
    } catch (err) {
      console.error("Error fetching affiliate data:", err);
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle copy code
  const handleCopyCode = () => {
    if (dashboard?.referralCode) {
      navigator.clipboard.writeText(dashboard.referralCode);
      toast.success("Referral code copied!");
    } else {
      toast.error("No referral code to copy");
    }
  };

  const handleRequesPayout = async () => {
    setLoadingPayout(true);
    try {
      const res = await getRequest(`${PROVIDER.GET_BANKS}?page=1&limit=10`);
      if (res?.data?.success && res.data.data?.banks?.length > 0) {
        setBanks(res.data.data.banks);
        setShowBankModal(true);
      } else {
        setShowAddBankModal(true);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch banks");
    }
    setLoadingPayout(false);
  };

  const handleConfirmPayout = async () => {
    setLoadingPayout(true);

    if (!selectedBank) return toast.error("Please select a bank");
    if (!payoutAmount || payoutAmount <= 0)
      return toast.error("Enter valid amount");

    try {
      const payload = {
        bankId: selectedBank,
        amount: payoutAmount,
      };
      const res = await postRequest(PROVIDER.PAYOUT, payload);
      if (res?.data?.success) {
        toast.success("Payout request sent successfully");
        setShowBankModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to request payout");
      }
    } catch (err) {
      console.error("Error requesting payout:", err);
      toast.error(err?.response?.data?.message);
    }
    setLoadingPayout(false);
  };

  const bankSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank Name is required"),
    accountHolderName: Yup.string().required("Account Holder Name is required"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^[0-9]{8,18}$/, "Invalid Account Number"),
    // ifscCode: Yup.string(),
    swiftCode: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bankSchema),
  });

  const onAddBank = async (data: any) => {
    setLoadingPayout(true);

    try {
      const payload = {
        userId: login?.id,
        ...data,
      };
      const res = await postRequest(PROVIDER.GET_BANKS, payload);
      if (res?.data?.success) {
        toast.success("Bank added successfully!");
        reset();
        setShowAddBankModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to add bank");
      }
    } catch (error) {
      console.error("Add bank error:", error);
      toast.error("Something went wrong while adding bank");
    }
    setLoadingPayout(false);
  };

  if (loading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton height={40} />
        <Skeleton count={8} />
      </div>
    );

  const currentRank = dashboard?.currentRank || {};
  const rankName = currentRank?.name || "—";
  const referralCode = dashboard?.referralCode || "—";
  const directReferrals = dashboard?.directReferrals || 0;
  const totalNetwork = dashboard?.totalNetwork || 0;
  const networkTurnover = dashboard?.networkTurnover || "0.00";

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">Parrainages</h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Suivez les performances et les revenus de vos affiliés.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-darkmode rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr] gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-sm">
                Votre code d'affiliation
              </span>
              <span className="text-lg dark:text-neutral-300 flex items-center gap-2">
                {referralCode}
                <Copy
                  size={18}
                  className="text-gray-600 dark:text-neutral-300 cursor-pointer hover:text-secondary"
                  onClick={handleCopyCode}
                />
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-sm">Statut</span>
              <span className="flex items-center gap-1 text-lg dark:text-neutral-300">
                <Award size={20} className="text-orange-600" /> {rankName}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-sm">
                Passage au statut suivant
              </span>
              <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
                <div
                  className="progress h-full absolute left-0 top-0 bg-primary rounded-full"
                  style={{ width: "60%" }}
                />
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-xs">
                Prochain statut: {rankName} (progress evaluation soon)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-borderlight dark:border-lightbg/20 pt-6 mt-6">
            <div className="flex flex-col gap-1 text-center">
              <span className="font-semibold text-sm sm:text-2xl dark:text-neutral-300">
                {directReferrals}
              </span>
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-xs sm:text-sm">
                Recommandations directes
              </span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <span className="font-semibold text-sm sm:text-2xl dark:text-neutral-300">
                {totalNetwork}
              </span>
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-xs sm:text-sm">
                Taille du réseau
              </span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <span className="font-semibold text-sm sm:text-2xl dark:text-neutral-300">
                {networkTurnover} €
              </span>
              <span className="text-gray-600 dark:text-neutral-400 capitalize text-xs sm:text-sm">
                Chiffre d'affaires mensuel du réseau
              </span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white dark:bg-darkmode rounded-xl p-4">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex">
                {[
                  { id: "tab1", label: "Commissions" },
                  { id: "tab2", label: "Réseau" },
                  { id: "tab3", label: "Rangs" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-b-2 border-secondary text-secondary"
                        : "text-gray-600 dark:text-neutral-400 hover:text-secondary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button
                  loading={loadingPayout}
                  variant="outline"
                  onClick={() => handleRequesPayout()}
                >
                  Demande de paiement
                </Button>
                <Button
                  loading={loadingPayout}
                  onClick={() => navigate("/provider/view-payouts")}
                >
                  Consulter les gains
                </Button>
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="mt-6">
              {activeTab === "tab1" && (
                <div className="tab-content">
                  <h3 className="text-xl font-semibold mb-2 dark:text-neutral-100">
                    Détails de vos revenus
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col gap-2 bg-gray-100 dark:bg-[#121417] rounded-lg p-4 text-center">
                      <span className="text-gray-600 dark:text-neutral-400 text-sm">
                        Revenus totaux ce mois-ci
                      </span>
                      <span className="font-semibold text-lg dark:text-neutral-300">
                        {earnings?.thisMonth || 0} €
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 bg-gray-100 dark:bg-[#121417] rounded-lg p-4 text-center">
                      <span className="text-gray-600 dark:text-neutral-400 text-sm">Équilibre</span>
                      <span className="font-semibold text-lg dark:text-neutral-300">
                        {earnings?.totalBalance || 0} €
                      </span>
                    </div>
                  </div>

                  <h3 className="capitalize font-semibold text-lg mb-2 dark:text-neutral-100">
                    Détail par niveau
                  </h3>
                  <div className="space-y-3 dark:text-neutral-300">
                    {Object.entries(earnings?.earningsByLevel || {}).map(
                      ([level, amount]) => (
                        <div
                          key={level}
                          className="flex justify-between border border-borderlight dark:border-neutral-700 p-3 text-sm rounded-lg hover:bg-neutral-800"
                        >
                          <span>{level}</span>
                          <span className="font-semibold">{amount} €</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "tab2" && (
                <div className="tab-content">
                  <div className="flex flex-col gap-4 mb-4 items-start">
                    <h3 className="text-xl font-semibold capitalize dark:text-neutral-100">
                      Structure of your network
                    </h3>

                    <Button
                      onClick={() =>
                        navigate(`/provider/view-refferal/${login?.id}`)
                      }
                    >
                      Structure arborescente de l'affichage
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {network.length === 0 && (
                      <p className="text-gray-600 text-sm dark:text-neutral-300">
                        Pas encore de membres.
                      </p>
                    )}
                    {network.map((member) => (
                      <div
                        key={member.id}
                        className="border border-borderlight dark:border-neutral-700 p-3 rounded-lg flex justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Level {member.level}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-secondary">
                          {member.rankName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "tab3" && (
                <div className="tab-content">
                  <h3 className="text-xl font-semibold mb-4 capitalize dark:text-neutral-100">
                    Progression de rang
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ranks.map((rank) => (
                      <div
                        key={rank.id}
                        className="border border-borderlight dark:border-neutral-700 p-4 rounded-lg"
                      >
                        <span className="flex items-center gap-1 text-xl font-semibold capitalize dark:text-neutral-100">
                          {rank.name === "Manager" ? (
                            <BriefcaseBusinessIcon size={22} />
                          ) : rank.name === "Leader" ? (
                            <Crown size={22} />
                          ) : (
                            <Target size={22} />
                          )}
                          {rank.name}
                        </span>
                        <p className="text-gray-600 dark:text-neutral-400 text-sm my-3">
                          {rank.description}
                        </p>

                        {Object.entries(rank.requirements).map(
                          ([reqKey, reqValue]) => (
                            <div key={reqKey} className="mb-3">
                              <p className="text-sm mb-1 text-gray-600 dark:text-neutral-300 capitalize">
                                {reqKey.replace(/([A-Z])/g, " $1")}:{" "}
                                {rank.achieved[reqKey] || 0} / {reqValue}
                              </p>
                              <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
                                <div
                                  className="progress h-full absolute left-0 top-0 bg-primary rounded-full"
                                  style={{
                                    width: `${
                                      Math.min(
                                        (rank.achieved[reqKey] /
                                          (reqValue || 1)) *
                                          100,
                                        100
                                      ) || 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OuterModal active={showBankModal} setActive={setShowBankModal} showClose>
        <div className="max-w-2xl mx-auto border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] p-5 md:p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
            Sélectionner un compte bancaire
          </h2>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="border border-borderlight rounded-lg w-full p-2 mb-4"
          >
            <option value="">Sélectionner une banque</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bankName} - {b.accountNumber}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Saisir le montant"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(Number(e.target.value))}
            className="border border-borderlight rounded-lg w-full p-2 mb-4"
          />

          <div className="flex flex-col md:flex-row justify-between gap-3 mt-8">
            <Button variant="outline" className="flex-1" onClick={() => setShowBankModal(false)}>Annuler</Button>
            <Button  className="flex-1" onClick={handleConfirmPayout} loading={loadingPayout}>
              Confirmer
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal
        active={showAddBankModal}
        setActive={setShowAddBankModal}
        showClose
      >
        <div className="max-w-lg mx-auto bg-white dark:bg-darkmode p-6 rounded-xl shadow-lg mt-10">
          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
           Ajouter les coordonnées bancaires
          </h2>
          <form onSubmit={handleSubmit(onAddBank)} className="space-y-3">
            <div>
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">Nom de la banque</label>
              <input
                {...register("bankName")}
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.bankName?.message}
              </p>
            </div>

            <div>
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Nom du titulaire du compte
              </label>
              <input
                {...register("accountHolderName")}
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.accountHolderName?.message}
              </p>
            </div>

            <div>
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">Numéro de compte</label>
              <input
                {...register("accountNumber")}
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber?.message}
              </p>
            </div>

            {/* <div>
              <label className="text-sm dark:text-neutral-300">IFSC Code</label>
              <input
                {...register("ifscCode")}
                className="border border-borderlight rounded-lg w-full p-2"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.ifscCode?.message}
              </p>
            </div> */}

            <div>
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">Code SWIFT</label>
              <input
                {...register("swiftCode")}
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.swiftCode?.message}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
              <Button type="button"
              variant="outline"
               className="flex-1"
               onClick={() => setShowAddBankModal(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1"
                type="submit" loading={loadingPayout}>
                Enregistrer la banque
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
    </>
  );
}

export default Refferal;
