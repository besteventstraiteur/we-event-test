import { useEffect, useState } from "react";
import {
  Play,
  Lock,
  Clock,
  CheckCircle2,
  Circle,
  X,
  Download,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import Eventthumb from "../../assets/images/event.webp";
import Button from "../../components/ui/Button";

import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useNavigate } from "react-router-dom";
import OuterModal from "../../components/Custommodal/OuterModal";

type Subscription = {
  status?: string;
  [key: string]: any;
};

type CourseItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  isFreeAccess: boolean;
  isPublished: boolean;
  _count?: {
    modules?: number;
  };
  progress?: {
    progress?: number;
    percentage?: number;
    isCompleted?: boolean;
  } | null;
};

type ModuleItem = {
  id: string;
  title: string;
  content?: string;
  orderNo: number;
  lengthSeconds: number;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  bunnyStorageUrl?: string;
  isCompleted?: boolean;
  attachments?: string[];
};

interface Props {
  subscription: Subscription | null;
}
const downloadFile = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const getFileName = (url: string) => {
  try {
    return decodeURIComponent(url.split("/").pop() || "fichier");
  } catch {
    return "fichier";
  }
};

const ELearningList = ({ subscription }: Props) => {
  const navigate = useNavigate();
  

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [activeAttachments, setActiveAttachments] = useState<string[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);

  const [startingId, setStartingId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const isSubscribed = subscription;

  const fetchCourses = async (p = 1, l = 10, searchTerm = "") => {
    try {
      setLoading(true);

      const res = await getRequest(
        `${PROVIDER.TRAINING_COURSE_LIST}?page=${p}&limit=${l}&search=${searchTerm}`
      );

      const responseData = res?.data?.data;
      const items: CourseItem[] = responseData?.items ?? [];    
      setCourses(items);
      setPage(responseData?.page ?? 1);
      setTotalPages(responseData?.pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1, limit, "");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchCourses(1, limit, search.trim());
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const trackLearningAnalytics = async (
    entityType: "learning_course" | "learning_module",
    entityId: string | number,
    action: "view" | "download"
  ) => {
    try {
      await postRequest(PROVIDER.ANLYTICS_TRACK, {
        entityType,
        entityId: Number(entityId),
        action,
      });
    } catch (error) {
      // silent fail
      console.error("Analytics failed:", error);
    }
  };
  const startCourse = async (course: CourseItem) => {
    const locked = !course.isFreeAccess && !isSubscribed;

    if (locked) {
      navigate("/provider/plans");
      return;
    }

    try {
      setStartingId(course.id);
      trackLearningAnalytics("learning_course", course.id, "view");

      await postRequest(PROVIDER.TRAINING_COURSE_START, {
        learningId: course.id,
      });

      setActiveCourse(course);
      setOpenModal(true);
      await loadModules(course.id);
    } catch (err) {
      console.error("Échec du démarrage du cours", err);
    } finally {
      setStartingId(null);
    }
  };
  const loadModules = async (courseId: string) => {
    try {
      setModulesLoading(true);
      setModules([]);
      setActiveModule(null);

      const res = await getRequest(
        `${PROVIDER.GET_COURSE_BY_ID}/${courseId}/modules`
      );

      const mods: ModuleItem[] = res?.data?.data?.modules ?? [];
      setModules(mods);

      if (mods.length > 0) setActiveModule(mods[0]);
    } catch (err) {
      console.error("Échec du chargement des modules", err);
    } finally {
      setModulesLoading(false);
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!activeModule) return;

    try {
      setCompleting(true);

      await getRequest(
        `${PROVIDER.COMPLETE_COURSE_MODULE}/${moduleId}/complete`
      );

      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, isCompleted: true } : m))
      );

      setOpenModal(false);
      setActiveCourse(null);
      setModules([]);
      setActiveModule(null);

      await fetchCourses(page, limit, search);
    } catch (err) {
      console.error("Échec de la complétion du module", err);
    } finally {
      setCompleting(false);
    }
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-darkmode rounded-2xl p-4 animate-pulse flex flex-col gap-3"
        >
          <div className="h-32 bg-gray-200 dark:bg-neutral-600 rounded-2xl" />
          <div className="h-4 bg-gray-200 dark:bg-neutral-600 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-neutral-600 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-neutral-600 rounded mt-3" />
        </div>
      ))}
    </div>
  );

  const handleModuleDownload = async (module: ModuleItem) => {
    try {
      trackLearningAnalytics("learning_module", module.id, "download");

      const res = await getRequest(
        `${PROVIDER.TRAINING_COURSE}/${module.id}/download`
      );

      const downloadUrl = res?.data?.data?.downloadUrl;
      if (!downloadUrl) return;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Échec du téléchargement du module :", error);
    }
  };
  return (
    <>
      

      {loading ? (
        renderSkeletons()
      ) : courses.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-300">No learning courses found.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const modulesCount = course._count?.modules ?? 0;
            const progressPercent =
              course.progress?.progress ?? course.progress?.percentage ?? 0;

            const locked = !course.isFreeAccess && !isSubscribed;

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-darkmode rounded-2xl flex flex-col justify-between relative top-0 hover:-top-2 transition-all shadow-sm overflow-hidden"
              >
                <div>
                  {/* Thumbnail */}
                  <div
                    className="h-40 bg-cover bg-center rounded-t-2xl relative flex justify-between items-start p-4 text-white before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/40 before:rounded-t-2xl"
                    style={{
                      backgroundImage: `url("${encodeURI(course?.thumbnail)}")`,
                    }}
                  >
                    <span className="bg-secondary rounded-md text-xs px-3 py-1 relative z-10 capitalize">
                      {course.category}
                    </span>

                    {locked && (
                      <div className="relative z-10">
                        <div className="bg-black/50 rounded-full p-2">
                          <Lock size={20} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="px-4 pt-4">
                    <h2 className="text-lg font-semibold dark:text-neutral-100 capitalize">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-300 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 mt-2">
                  <p className="text-xs text-gray-600 dark:text-neutral-400">
                    {modulesCount} module{modulesCount !== 1 && "s"}
                  </p>

                  <div className="w-full h-2 bg-gray-200 rounded-full my-2">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-600 dark:text-neutral-400">
                    {progressPercent}% Complété
                  </p>

                  {/* Button */}
                  <Button
                    className="w-full mt-4"
                    loading={startingId === course.id}
                    onClick={() => startCourse(course)}
                  >
                    {locked ? (
                      <>
                        <Lock size={18} /> Abonnement nécessaire
                      </>
                    ) : (
                      <>
                        <Play size={18} fill="white" />
                        {progressPercent > 0 ? "Continue" : "Start"}
                      </>
                    )}
                  </Button>
                  {Array.isArray(course.attachments) &&
                    course.attachments.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          // 🔹 SINGLE FILE → direct download
                          if (course.attachments.length === 1) {
                            trackLearningAnalytics(
                              "learning_course",
                              course.id,
                              "download"
                            );
                            downloadFile(course.attachments[0]);
                            return;
                          }

                          // 🔹 MULTIPLE FILES → open modal
                          setActiveAttachments(course.attachments);
                          setActiveCourseId(course.id);
                          setAttachmentsModalOpen(true);
                        }}
                      >
                        {course.attachments.length === 1
                          ? "Télécharger la pièce jointe"
                          : `Télécharger les pièces jointes (${course.attachments.length})`}
                      </Button>
                    )}
                </div>
              </div>
            );
          })}
          </div>
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 w-full">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => fetchCourses(page - 1, limit, search)}
              >
                <ArrowLeft size={18} /> Précédent
              </Button>

              {/* <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span> */}

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => fetchCourses(page + 1, limit, search)}
              >
                Suivant <ArrowRight size={18} />
              </Button>
            </div>
          )}
          </>
        
      )}

      {openModal && activeCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl w-[1100px] h-[620px] shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">{activeCourse.title}</h2>
                <p className="text-sm text-gray-500">{activeCourse.category}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  setActiveModule(null);
                  setModules([]);
                  setActiveCourse(null);
                }}
              >
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside className="w-80 border-r bg-gray-50 h-full overflow-y-auto">
                <div className="px-4 py-4">
                  <h3 className="text-sm font-semibold mb-3">Contenu du cours</h3>

                  {modulesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-gray-200 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {modules.map((m) => {
                        const isActive = activeModule?.id === m.id;
                        const minutes = Math.round((m.lengthSeconds || 0) / 60);

                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setActiveModule(m)}
                            className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span>
                              {m.isCompleted ? (
                                <CheckCircle2
                                  className="text-green-500"
                                  size={18}
                                />
                              ) : (
                                <Circle size={18} className="text-gray-400" />
                              )}
                            </span>

                            <div className="flex-1">
                              <div className="font-medium">{m.title}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                {minutes} minutes
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </aside>

              <main className="flex-1 bg-[#182131] flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  {activeModule?.bunnyLibraryId &&
                  activeModule?.bunnyVideoId ? (
                    <iframe
                      key={activeModule.id}
                      src={`https://iframe.mediadelivery.net/embed/${activeModule.bunnyLibraryId}/${activeModule.bunnyVideoId}?autoplay=true&controls=true`}
                      loading="lazy"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="w-full h-full border-0 rounded-none"
                    />
                  ) : activeModule?.bunnyStorageUrl ? (
                    <video
                      key={activeModule.id}
                      src={activeModule.bunnyStorageUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <div className="text-white text-sm">
                      Aucune vidéo disponible.
                    </div>
                  )}
                </div>

                {activeModule && (
                  <div className="p-4 border-t bg-[#111822]">
                    <Button
                      className="w-full"
                      loading={completing}
                      disabled={activeModule.isCompleted}
                      onClick={() => completeModule(activeModule.id)}
                    >
                      {activeModule.isCompleted
                        ? "Terminé"
                        : "Marquer comme terminé"}
                    </Button>
                    {activeModule?.attachments &&
                      activeModule.attachments.length > 0 && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => {
                            if (activeModule.attachments!.length === 1) {
                              trackLearningAnalytics(
                                "learning_module",
                                activeModule.id,
                                "download"
                              );
                              downloadFile(activeModule.attachments![0]);
                              return;
                            }
                            setActiveAttachments(activeModule.attachments!);
                            setActiveCourseId(activeModule.id); // reuse id
                            setAttachmentsModalOpen(true);
                          }}
                        >
                          {activeModule.attachments.length === 1
                            ? "Télécharger la pièce jointe"
                            : `Télécharger les pièces jointes (${activeModule.attachments.length})`}
                        </Button>
                      )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      )}
      <OuterModal
        active={attachmentsModalOpen}
        setActive={setAttachmentsModalOpen}
        showClose
      >
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#111418] rounded-2xl p-6">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold dark:text-neutral-300">
              Pièces jointes du cours
            </h2>

            <p className="text-sm text-gray-600">
              Sélectionnez un fichier à télécharger
            </p>
          </div>

          <div className="space-y-3">
            {activeAttachments.map((url, index) => (
              <button
                key={index}
                className="w-full bg-gray-200 hover:bg-gray-300 flex justify-between gap-2 p-3 rounded text-sm cursor-pointer transition-all duration-300"
                onClick={() => {
                  if (activeCourseId) {
                    trackLearningAnalytics(
                      "learning_course",
                      activeCourseId,
                      "download"
                    );
                  }
                  downloadFile(url);
                }}
              >
                <p className="truncate max-w-11/12">📄 {getFileName(url)}</p>
                <Download size={18} className="shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="secondary"
              onClick={() => setAttachmentsModalOpen(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default ELearningList;
