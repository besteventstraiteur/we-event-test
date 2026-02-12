// src/components/provider-training/SessionLiveList.tsx

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Lock,
  X,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useNavigate } from "react-router-dom";
import OuterModal from "../../components/Custommodal/OuterModal";

const isSessionEnded = (startTime: string, durationMin: number) => {
  const start = new Date(startTime).getTime();
  const end = start + durationMin * 60 * 1000; // minutes → ms
  return Date.now() > end;
};

const SessionLiveList = ({ subscription }) => {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);

  const isSubscribed = subscription;

  // -----------------------
  // FETCH LIVE SESSIONS
  // -----------------------
  const fetchSessions = async (pageNum = page) => {
    try {
      setLoading(true);

      const res = await getRequest(
        `${PROVIDER.TRAINING_LIVE_SESSION_LIST}?page=${pageNum}&limit=${limit}`,
      );

      const data = res?.data?.data;

      setSessions(data?.sessions ?? []);
      setPage(data?.page ?? 1);
      setTotalPages(data?.pages ?? 1);
    } catch (err) {
      console.error("Failed to load live sessions", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(1);
  }, []);

  const handleAction = async (session: any) => {
    const locked = !session.isFreeAccess && !isSubscribed;
    const ended = isSessionEnded(session.startTime);

    if (ended) return;

    if (locked) {
      setActiveSession(session);
      setShowUpgradeModal(true);
      return;
    }

    if (session.isJoined) {
      setActiveSession(session);
      setOpenModal(true);
      return;
    }

    // Not joined → register first
    try {
      setRegisteringId(session.id);

      await postRequest(
        `${PROVIDER.TRAINING_LIVE_SESSION_REGISTER}/${session.id}`,
        {},
      );

      setActiveSession({ ...session, isJoined: true });
      setOpenModal(true);

      fetchSessions(page); // refresh joined state
    } catch (err) {
      console.error("Failed to register webinar:", err);
    } finally {
      setRegisteringId(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <>
      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500 dark:text-neutral-300">
          Chargement des sessions en direct...
        </p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-300">
          Aucune session en direct disponible.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sessions.map((session) => {
            const locked = !session.isFreeAccess && !isSubscribed;
            const ended = isSessionEnded(session.startTime);

            return (
              <div
                key={session.id}
                className="p-7 bg-white dark:bg-darkmode rounded-2xl flex flex-col gap-5 relative"
              >
                {/* LOCK BADGE */}
                {locked && (
                  <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-full">
                    <Lock size={20} className="text-white" />
                  </div>
                )}

                <h2 className="text-lg font-semibold dark:text-neutral-100 capitalize">
                  {session.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-300 line-clamp-2">
                  {session.description}
                </p>

                <div className="flex justify-between text-sm text-gray-600 dark:text-neutral-400">
                  <span className="flex items-center gap-2 dark:text-neutral-300">
                    <Calendar size={16} /> {formatDate(session.startTime)}
                  </span>
                  <span className="flex items-center gap-2 dark:text-neutral-300">
                    <Clock size={16} /> {session.duradtionMin} min
                  </span>
                  <span className="flex items-center gap-2 dark:text-neutral-300">
                    <Users size={16} /> {session.registeredCount}/
                    {session.maxAttendees}
                  </span>
                </div>

                <Button
                  className="w-full"
                  loading={registeringId === session.id}
                  disabled={ended}
                  onClick={() => handleAction(session)}
                >
                  {ended
                    ? "Session terminée"
                    : session.isJoined
                      ? "Voir les détails"
                      : locked
                        ? "Abonnement requis"
                        : "S’inscrire"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10 w-full">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchSessions(page - 1)}
          >
            <ArrowLeft size={18} /> Précédent
          </Button>

          {/* <span className="text-sm text-gray-600 self-center">
            Page {page} of {totalPages}
          </span> */}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => fetchSessions(page + 1)}
          >
            Suivant <ArrowRight size={18} />
          </Button>
        </div>
      )}

      {openModal && activeSession && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-5">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-2xl mx-auto rounded-2xl p-5 md:p-8 relative">
            {/* CLOSE */}
            <X
              size={22}
              className="absolute right-4 top-4 cursor-pointer text-gray-600 dark:text-neutral-300"
              onClick={() => {
                setOpenModal(false);
                setActiveSession(null);
              }}
            />

            <div className="mb-6 space-y-4">
              <h2 className="text-xl font-semibold mb-0 capitalize dark:text-neutral-100">
                {activeSession.title}
              </h2>
              <p className="text-gray-600 dark:text-neutral-300">
                {activeSession.description}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              {activeSession.meetingId && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-neutral-300">ID de la réunion:</span>
                  <span className="font-semibold">
                    {activeSession.meetingId}
                  </span>
                </div>
              )}

              {activeSession.meetingPass && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-neutral-300">Mot de passe:</span>
                  <span className="font-semibold">
                    {activeSession.meetingPass}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-500 dark:text-neutral-300 block mb-1">
                  Lien de la réunion:
                </span>
                <a
                  href={activeSession.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white inline-flex items-center gap-1 px-3 py-1 transition-colors duration-300 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  Lien de connexion <ExternalLink size={15} />
                </a>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => window.open(activeSession.meetingUrl, "_blank")}
            >
              Rejoindre la réunion
            </Button>
          </div>
        </div>
      )}

      <OuterModal
        active={showUpgradeModal}
        setActive={setShowUpgradeModal}
        showClose={false}
      >
        <div className="max-w-md mx-auto bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 md:p-8">
          <div className="mb-6 space-y-4">
            <h2 className="text-xl dark:text-neutral-100 font-semibold mb-0">
            Fonctionnalité non disponible
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Cette session en direct n’est pas incluse dans votre abonnement
            actuel. Veuillez mettre à niveau votre formule pour accéder à toutes
            les sessions de formation premium.
          </p>

          </div>    

          <div className="flex gap-3 mt-10">
            <Button
              className="w-full"
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/provider/plans");
              }}
            >
              Aller aux formules
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowUpgradeModal(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default SessionLiveList;
