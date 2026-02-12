import { useEffect, useState } from "react";
import {
  Clock,
  Eye,
  PlayCircle,
  Lock,
  X,
  Download,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Eventthumb from "../../assets/images/event.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OuterModal from "../../components/Custommodal/OuterModal";

const SkeletonCard = () => (
  <div className="bg-white dark:bg-darkmode rounded-2xl shadow-sm p-4 animate-pulse">
    <div className="h-40 bg-gray-200 dark:bg-neutral-600 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-neutral-600 w-3/4 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-neutral-600 w-1/2 rounded"></div>
    <div className="h-10 bg-gray-200 dark:bg-neutral-600 w-full rounded mt-4"></div>
  </div>
);
const getFileName = (url: string) => {
  try {
    const cleanUrl = url.split("?")[0];
    return decodeURIComponent(
      cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1),
    );
  } catch {
    return "file";
  }
};

const downloadFile = async (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const ReplaysList = ({ subscription }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downLoadLoading, setDownLoadLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [activeAttachments, setActiveAttachments] = useState<string[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [openVideo, setOpenVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const login = useSelector((state) => state.login);
  const navigate = useNavigate();

  const isSubscribed = subscription ? true : false;
  const fetchVideos = async (query = "", pageNumber = page) => {
    try {
      setLoading(true);

      const url = `${
        PROVIDER.TRAINING_VIDEO_LIST
      }?page=${pageNumber}&limit=${limit}${query ? `&search=${query}` : ""}`;

      const res = await getRequest(url);
      const responseData = res?.data?.data;

      const all = responseData?.data || [];

      // Only published
      const published = all.filter((v) => v.status === "published");

      setVideos(published);
      setPage(responseData?.page ?? 1);
      setTotalPages(responseData?.pages ?? 1);
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos("", 1);
  }, []);

  // SEARCH HANDLER
  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    fetchVideos(text);
  };
  const trackVideoAnalytics = async (
    videoId: number,
    action: "view" | "download",
  ) => {
    try {
      if (!videoId) return;

      const loggedUserId = login?.user?.id ?? null;

      await postRequest(PROVIDER.ANLYTICS_TRACK, {
        entityType: "training_video",
        entityId: Number(videoId),
        action,
        userId: loggedUserId,
      });
    } catch (error) {
      // silent fail
      console.error("Video analytics failed:", error);
    }
  };

  const downloadAllAttachments = async (video: any) => {
    if (!Array.isArray(video.attachments) || video.attachments.length === 0)
      return;

    // Track analytics ONCE
    trackVideoAnalytics(video.id, "download");

    for (const url of video.attachments) {
      await downloadFile(url);

      // Small delay to avoid browser blocking
      await new Promise((res) => setTimeout(res, 300));
    }
  };

  const handleDownload = async (video: any) => {
    try {
      setLoading(true);
      trackVideoAnalytics(video.id, "download");

      const res = await getRequest(
        `${PROVIDER.TRAINING_VIDEO}/${video.id}/download`,
      );

      const downloadUrl = res?.data?.data?.downloadUrl;
      if (!downloadUrl) return;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", ""); // forces download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Search */}
      <div className="mb-5">
        <InputGroup
          type="text"
          placeholder="Je recherche une formation…"
          className="bg-white max-w-96 w-full"
          value={searchText}
          onChange={handleSearch}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-300">
          Aucune vidéo publiée trouvée.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {videos.map((video) => {
            const locked = !video.isFreeAccess && !isSubscribed;
            return (
              <div
                key={video.id}
                className="bg-white dark:bg-darkmode rounded-2xl shadow-sm flex flex-col justify-between relative top-0 hover:-top-2 transition-all overflow-hidden"
              >
                <div>
                  {/* Thumbnail */}
                  <div
                    className="h-40 bg-cover bg-center rounded-t-2xl relative p-4 text-white dark:text-neutral-100 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/40 before:rounded-t-2xl"
                    style={{
                      backgroundImage: `url("${encodeURI(video.thumbnail)}")`,
                    }}
                  >
                    <span className="bg-secondary rounded-md text-xs px-3 py-1 relative z-10 capitalize">
                      {video.category}
                    </span>

                    {/* Lock */}
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-black/50 p-3 rounded-full">
                          <Lock size={28} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Details */}
                  <div className="px-4 pt-4">
                    <h2 className="text-lg font-semibold dark:text-neutral-100 capitalize">
                      {video.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {video.excerpt}
                    </p>

                    <div className="flex justify-between text-xs text-gray-600 dark:text-neutral-400 mt-3">
                      <span className="flex items-center gap-2">
                        <Clock size={14} /> {video.lengthSeconds} sec
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye size={14} /> {video.views}
                        <Download size={14} /> {video.downloads}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4">
                  {!locked ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => {
                          trackVideoAnalytics(video.id, "view");
                          setVideoId({
                            lib: video.bunnyLibraryId,
                            vid: video.bunnyVideoId,
                          });
                          setOpenVideo(true);
                        }}
                      >
                        <PlayCircle size={18} /> Vues
                      </Button>
                      {/* ATTACHMENTS */}
                      {Array.isArray(video.attachments) &&
                        video.attachments.length > 0 && (
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => {
                              // SINGLE FILE → direct download
                              if (video.attachments.length === 1) {
                                trackVideoAnalytics(video.id, "download");
                                downloadFile(video.attachments[0]);
                                return;
                              }

                              setActiveAttachments(video.attachments);
                              setActiveVideoId(video.id);
                              setAttachmentsModalOpen(true);
                            }}
                          >
                            <Download size={16} />
                            {video.attachments.length === 1
                              ? "Télécharger la pièce jointe"
                              : `Télécharger les pièces jointes (${video.attachments.length})`}
                          </Button>
                        )}
                    </>
                  ) : (
                    <Button
                      className="w-full bg-indigo-200 text-indigo-800 border border-indigo-300"
                      onClick={() => navigate("/provider/plans")}
                    >
                      Abonnement requis
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10 w-full">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchVideos(searchText, page - 1)}
          >
            <ArrowLeft size={18} /> Précédent
          </Button>

          {/* <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span> */}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => fetchVideos(searchText, page + 1)}
          >
            Suivant <ArrowRight size={18} />
          </Button>
        </div>
      )}

      <OuterModal
        active={attachmentsModalOpen}
        setActive={setAttachmentsModalOpen}
        
      >
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 md:p-8">
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-semibold dark:text-neutral-100 mb-0">
              Pièces jointes
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Choisissez un fichier à télécharger
            </p>
          </div>

          <div className="space-y-3">
            {activeAttachments.map((url, index) => (
              <button
                key={index}
                className="w-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-700  flex items-center gap-3 p-3 rounded text-sm cursor-pointer transition-all"
                onClick={() => {
                  if (activeVideoId) {
                    trackVideoAnalytics(activeVideoId, "download");
                  }
                  downloadFile(url);
                }}
              >
                {/* Left icon */}
                <span className="shrink-0">📄</span>

                {/* Filename (THIS WAS THE BUG) */}
                <p className="flex-1 truncate text-gray-900 dark:text-neutral-300 text-left">
                  {getFileName(url)}
                </p>

                {/* Download icon */}
                <Download size={18} className="shrink-0 text-gray-700 dark:text-neutral-300" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button onClick={() => setAttachmentsModalOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </OuterModal>

      {/* Modal */}
      {openVideo && videoId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl w-[900px] h-[520px] relative p-2">
            <X
              className="absolute right-3 top-3 cursor-pointer"
              size={24}
              onClick={() => {
                setOpenVideo(false);
                setVideoId(null);
              }}
            />

            <iframe
              src={`https://iframe.mediadelivery.net/embed/${videoId.lib}/${videoId.vid}?autoplay=true&controls=true`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg border-0"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplaysList;
