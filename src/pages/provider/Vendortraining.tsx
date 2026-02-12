import { useEffect, useState } from "react";
import { Award, PlayCircle, BookOpen, Video, Briefcase } from "lucide-react";

import ReplaysList from "./ReplaysList";
import ELearningList from "./ELearningList";
import SessionLiveList from "./SessionLiveList";
import BusinessList from "./BusinessList";
import CertificatesList from "./CertificatesList";
import TrainingTabs from "./TrainingTabs";

import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";

const Vendortraining = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("Rediffusions");
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { name: "Rediffusions", icon: <PlayCircle size={18} /> },
    { name: "Apprentissage en ligne", icon: <BookOpen size={18} /> },
    { name: "Session en direct", icon: <Video size={18} /> },
    { name: "Entreprise", icon: <Briefcase size={18} /> },
    { name: "Certificats", icon: <Award size={18} /> },
  ];

  const fetchSubscription = async () => {
    try {
      const res = await getRequest(PROVIDER.MY_SUBSCRIPTION);

      if (res?.data?.success) {
        const sub = res.data.data;
        setIsActiveSubscription(sub?.status === "active");
      }
    } catch (err) {
      console.error("Subscription fetch failed:", err);
      toast.error("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading trainings...
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          La formation continue
        </h1>

        <p className="text-gray-600 dark:text-neutral-300">
          Développez vos compétences et dynamisez votre entreprise
        </p>
      </div>

      {/* TABS */}

      <TrainingTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* CONTENT */}
      <div className="mt-5">
        {activeTab === "Rediffusions" && (
          <ReplaysList subscription={isActiveSubscription} />
        )}

        {activeTab === "Apprentissage en ligne" && (
          <ELearningList subscription={isActiveSubscription} />
        )}

        {activeTab === "Session en direct" && (
          <SessionLiveList subscription={isActiveSubscription} />
        )}

        {activeTab === "Entreprise" && <BusinessList />}

        {activeTab === "Certificats" && <CertificatesList />}
      </div>
    </>
  );
};

export default Vendortraining;
