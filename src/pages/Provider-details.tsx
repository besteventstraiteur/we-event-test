import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "../styles/provider-details.css";
import {
  ArrowLeft,
  Clock,
  Facebook,
  Instagram,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Share2,
  ShieldCheck,
  Star,
  StarIcon,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import Button from "../components/ui/Button";
import { motion } from "motion/react";
import womenImage from "../../src/assets/images/women.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import OuterModal from "../components/Custommodal/OuterModal";
import InputGroup from "../components/ui-main/InputGroup";
import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { AUTH, PROVIDER } from "../utils/endPoints";
import { useSelector } from "react-redux";
import RequestForm from "./requestQuoteForm";
import ProviderShare from "../module/Provider/SocialShare";
import { useToast } from "../utils/toast";
import { RESPONSE_CODE } from "../utils/constants";
import MyFavorite from "../components/ui/MyFavorite";
import { useRef } from "react";
import { fakePartnerDetails } from "../data/fakePartnerDetails";

type ServiceItem = {
  businessId: string;
  serviceId: string;
  service: {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

type RatingOverview = {
  id: string;
  averageRating: number;
  totalCount: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
  createdAt: string;
  updatedAt: string;
  businessId: string;
};

type BusinessProfile = {
  id: string;
  userId: string;
  name: string | null;
  logo: string | null;
  description: string | null;
  size: string | null;
  budget: number | null;
  address: string | null;
  postcode: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phoneNumber: string | null;
  email: string | null;
  profileImg: string | null;
  lat: number | null;
  long: number | null;
  webUrl: string | null;
  inUrl: string | null; // Instagram
  xUrl: string | null; // Twitter/X
  fbUrl: string | null;
  ytUrl: string | null;
  liUrl: string | null; // LinkedIn
  portfolioImages: string[] | null;
  isVerified: boolean | null;
  isBlocked: boolean | null;
  createdAt: string;
  updatedAt: string;
  services: ServiceItem[] | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  ratingOverview: RatingOverview | null;
};

// Simple skeleton atoms
const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Providerdetails = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const apiCalled = useRef(false);
  const analyticsTracked = useRef(false);
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      // Already an embed URL
      if (url.includes("youtube.com/embed/")) {
        return url;
      }

      const parsedUrl = new URL(url);

      // youtu.be/<id>
      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      // youtube.com/watch?v=<id>
      if (parsedUrl.hostname.includes("youtube.com")) {
        const videoId = parsedUrl.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  const generateThumbnailFromUrl = (
    url: string,
    displayWidth: number,
    displayHeight: number,
  ) =>
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 2; // for retina/sharpness
        canvas.width = displayWidth * scale;
        canvas.height = displayHeight * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context not available");

        // Fill background with black
        ctx.fillStyle = "#ebe6e7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Scale proportionally (contain)
        const ratio = Math.min(
          canvas.width / img.width,
          canvas.height / img.height,
        );
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const xOffset = (canvas.width - newWidth) / 2;
        const yOffset = (canvas.height - newHeight) / 2;

        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };

      img.onerror = (err) => reject(err);
    });

  const [active, setActive] = useState(false);
  const [activeLogin, setActiveLogin] = useState(false);
  const [showShare, setshowShare] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const login = useSelector((state: any) => state.login);

  const [rating, setRating] = useState(0);
  const [ratingshow, setratingshow] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLimit] = useState(5);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewLoadingMore, setReviewLoadingMore] = useState(false);
  const [reviewText, setreviewtext] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const requireLoginOr = (callback: () => void) => {
    if (!login?.user?.email) {
      setActiveLogin(true);
      return;
    }
    callback();
  };
  // data state
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewloading, setReviewLoading] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const uId = login?.user?.id || null;
      const res = await getRequest(`${AUTH.BUSINESS_PROFILE}/${id}?uid=${uId}`);
      await fetchReviews(1, false);
      setReviewPage(1);

      const data: BusinessProfile | undefined = res?.data?.data;
      setProfile(data ?? null);
    } catch (err: any) {
      console.debug('API not available, using fake partner data');
      // Use fake data as fallback
      if (id && fakePartnerDetails[id]) {
        const fakeData = fakePartnerDetails[id];
        setProfile({
          id: fakeData.id,
          businessName: fakeData.businessName,
          businessDescription: fakeData.businessDescription,
          email: fakeData.email,
          phone: fakeData.phone,
          address: fakeData.address,
          city: fakeData.city,
          postalCode: fakeData.postalCode,
          country: fakeData.country,
          website: fakeData.website,
          isVerified: fakeData.isVerified,
          completedEvents: fakeData.completedEvents,
          portfolioImages: fakeData.portfolioImages,
          socialLinks: fakeData.socialLinks,
          services: fakeData.services,
          averageRating: fakeData.rating.averageRating,
          totalReviews: fakeData.rating.totalCount,
        } as any);
        setRatings(fakeData.reviews || []);
        setErrorMsg(null);
      } else {
        setErrorMsg(err?.response?.data?.message || "Failed to load profile.");
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (page = 1, append = false) => {
    try {
      setReviewLoadingMore(true);

      const res = await getRequest(
        `${AUTH.BUSINESS_RATING}/${id}?page=${page}&limit=${reviewLimit}`,
      );

      const data = res?.data?.data;

      setRatings((prev) =>
        append ? [...prev, ...data.ratings] : data.ratings,
      );

      setReviewTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setReviewLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (apiCalled.current) return;

    apiCalled.current = true;
    fetchPartnerDetails();
  }, [id]);

  const handleLogin = () => {
    navigate(`/login?providerId=${id}`);
  };

  // for input number
  const [value, setValue] = useState(1);
  // derived helpers
  const getName = useMemo(() => {
    const p = profile;
    if (!p) return "Provider";
    if (p.name && p.name.trim()) return p.name;
    const first = p.user?.firstName || "";
    const last = p.user?.lastName || "";
    const full = `${first} ${last}`.trim();
    return full || "Provider";
  }, [profile]);
  const getSafeAvatar = (img?: string | null) => {
    if (!img || typeof img !== "string") return null;
    return img.trim().length > 0 ? img : null;
  };
  const getAvatar = useMemo(() => {
    const p = profile;
    if (!p) return womenImage;
    return p.getProfileImage || womenImage;
  }, [profile]);

  const getDescription = useMemo(() => {
    const p = profile;
    return p?.description || "Aucune description fournie.";
  }, [profile]);

  const getServices = useMemo(() => {
    const p = profile;
    const svcs = p?.services?.map((s) => s.service?.name).filter(Boolean) || [];
    return svcs.length ? svcs : [];
  }, [profile]);

  const getLocation = useMemo(() => {
    const p = profile;
    const city = p?.city;
    const state = p?.state;
    const country = p?.country;
    const addr = p?.address;

    if (city && country) return `${city}, ${country}`;
    if (state && country) return `${state}, ${country}`;
    if (addr) return addr;
    return "Localisation non disponible";
  }, [profile]);

  const isVerified = !!profile?.isVerified;

  const getBudget = useMemo(() => {
    const b = profile?.budget;
    if (typeof b === "number" && !Number.isNaN(b)) return b;
    return null;
  }, [profile]);

  const getEmail = profile?.email || profile?.user?.email || null;
  const getPhone = profile?.phoneNumber || profile?.user?.phoneNumber || null;
  const getProfileImage = profile?.user?.profileImg || null;
  const ratingCount = profile?.ratingOverview?.totalCount ?? 0;
  const averageRating = profile?.ratingOverview?.averageRating ?? 0;
  console.log(profile, "sdjsdjsdjsjds");
  const social = useMemo(() => {
    const withProto = (u?: string | null) =>
      u
        ? u.startsWith("http://") || u.startsWith("https://")
          ? u
          : `https://${u}`
        : null;

    return {
      linkedin: withProto(profile?.liUrl),
      instagram: withProto(profile?.inUrl),
      website: withProto(profile?.webUrl),
      facebook: withProto(profile?.fbUrl),
      youtube: withProto(profile?.ytUrl),
    };
  }, [profile]);

  const portfolioImages = (profile?.portfolioImages || []).filter(Boolean);
  const [events, setEvents] = useState([]);
  const [showNoEventModal, setShowNoEventModal] = useState(false);
  const [eventLoading, seteventLoading] = useState(false);
  const [showProviderBlockModal, setShowProviderBlockModal] = useState(false);

  const fetchUserEvents = async () => {
    try {
      const res = await getRequest(PROVIDER.GET_EVENTS);
      return res?.data?.data?.events || [];
    } catch {
      return [];
    }
  };
  const handlerequestQuote = async () => {
    seteventLoading(true);
    if (!login?.user?.email) {
      setActiveLogin(true);
      return;
    }

    if (login?.user?.role === "partner") {
      setShowProviderBlockModal(true);
      return;
    }

    const userEvents = await fetchUserEvents();
    setEvents(userEvents);

    if (!userEvents || userEvents.length === 0) {
      setShowNoEventModal(true);
      return;
    }
    seteventLoading(false);
    setActive(true);
  };

  const toast = useToast();
  const submitreview = async () => {
    setReviewLoading(true);

    if (!rating) {
      return toast.error("Sélectionnez au moins une étoile pour continuer.");
    }
    if (!reviewText) {
      return toast.error("Veuillez entrer un texte");
    }
    const payload = {
      rating,
      comment: reviewText,
      ratingFrom: Number(login?.user?.id),
      ratingTo: Number(id),
    };
    try {
      const response = await postRequest(`${PROVIDER.REVIEW}`, payload);

      if (response.status === RESPONSE_CODE[201]) {
        setreviewtext("");
        setratingshow(false);
        setRating(0);
        toast.success("L'avis a été ajouté avec succès");
        fetchPartnerDetails();
      }
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
    setReviewLoading(false);
  };

  useEffect(() => {
    Fancybox.bind('[data-fancybox="portfolio"]', {
      zoomEffect: false,
      fadeEffect: false,
      dragToClose: false,
      hideScrollbar: false,
      Carousel: {
        Thumbs: false,
        transition: "fade",
        padding: [0, 50, 0, 50],
        Panzoom: false,
        Toolbar: {
          display: { left: ["counter"], right: ["autoplay", "close"] },
        },
      },
      Image: { fit: "contain" },
    });

    return () => Fancybox.unbind('[data-fancybox="portfolio"]');
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id || !portfolioImages.length) return;

    const run = async () => {
      try {
        const thumbs = await Promise.all(
          portfolioImages.map((url) => generateThumbnailFromUrl(url, 300, 300)),
        );
        setThumbnails(thumbs);
      } catch (error) {
        console.error("Thumbnail generation failed", error);
        setThumbnails(portfolioImages);
      }
    };

    run();
  }, [profile?.id]);

  const trackAnalytics = async (action: "view" | "contact_reveal") => {
    try {
      if (!profile?.id) return;

      const loggedUserId = login?.user?.id ?? null;

      if (loggedUserId && String(profile.userId) === String(loggedUserId)) {
        return;
      }

      await postRequest(PROVIDER.ANLYTICS_TRACK, {
        entityType: "business_profile",
        entityId: Number(profile.id),
        action,
        userId: loggedUserId,
      });
    } catch (error) {
      // silent fail – analytics should never break UX
      console.error("Analytics tracking failed:", error);
    }
  };
  const analyticsTrackedForId = useRef<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const key = `view_tracked_${profile.id}`;

    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    trackAnalytics("view");
  }, [profile?.id]);
  console.log("TRACK VIEW", profile?.id);
  const documents = profile?.BusinessDocument || [];

  return (
    <>
      <div className="pt-32 pb-12 md:pb-24 md:pt-36">
        <section className="profile">
          <div className="container-1180">
            <div className="flex justify-between items-center">
              {loading ? (
                <>
                  <Skel className="w-40 h-6" />
                  <Skel className="w-10 h-10 rounded-full" />
                </>
              ) : (
                <>
                  <Link to="/partners" className="text-sm text-gray-600">
                    <span className="flex gap-1 items-center">
                      <ArrowLeft /> Retour aux vendeurs
                    </span>
                  </Link>
                  <span
                    onClick={() => setshowShare(true)}
                    className="bg-gray-200 w-10 h-10 hidden items-center justify-center rounded-full cursor-pointer transition-all duration-300  hover:bg-primary hover:text-white"
                  >
                    <Share2 size={20} />
                  </span>
                </>
              )}
            </div>

            {/* Loading & Error */}
            {errorMsg && !loading && (
              <div className="mt-6 text-red-600">{errorMsg}</div>
            )}

            <div className="profile w-full mt-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="profile__left lg:col-span-2 w-full">
                  <div className="space-y-5">
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {loading ? (
                        <div className="rounded-2xl overflow-hidden max-h-96">
                          <Skel className="w-full h-72 md:h-96" />
                        </div>
                      ) : portfolioImages.length > 0 ? (
                        <Swiper
                          id="image-slider"
                          slidesPerView={1}
                          spaceBetween={10}
                          loop={true}
                          pagination={false}
                          autoplay={{
                            delay: 3000,
                            disableOnInteraction: true,
                          }}
                          navigation={true}
                          speed={800}
                          modules={[Pagination, Navigation, Autoplay]}
                        >
                          {portfolioImages.map((src, idx) => (
                            <SwiperSlide key={idx}>
                              <div className="media-slide rounded-2xl overflow-hidden w-full aspect-video bg-black/5">
                                {/* Wrap image with <a> for Fancybox */}
                                <a
                                  href={src}
                                  data-fancybox="portfolio" // group all images together
                                  // data-caption={`Portfolio ${idx + 1}`}
                                >
                                  <img
                                    src={thumbnails[idx] || src} // use thumbnail if ready
                                    alt={`portfolio-${idx + 1}`}
                                    className="w-full h-full object-cover cursor-pointer"
                                  />
                                </a>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                          Aucune image de portfolio
                        </div>
                      )}

                      {portfolioImages.length > 1 && (
                        <span className="absolute z-40 bg-white font-semibold px-3 text-sm py-2 rounded-lg  bottom-3 right-3 duration-300 transition-all cursor-pointer pointer-events-none group-hover:bg-gray-200">
                          Voir toutes les photos ({portfolioImages.length})
                        </span>
                      )}
                    </motion.div>

                    {!loading && profile?.BusinessVideo?.length > 0 && (
                      <motion.div
                        className="relative group"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: 0.4,
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <h3 className="text-2xl font-bold mb-3 capitalize">
                          Vidéos
                        </h3>

                        <Swiper
                          className="video-slider"
                          slidesPerView={1}
                          spaceBetween={0}
                          loop={true}
                          pagination={false}
                          navigation={true}
                          speed={600}
                          modules={[Pagination, Navigation, Autoplay]}
                          onSlideChange={() => {
                            // Pause MP4 videos
                            document
                              .querySelectorAll("video")
                              .forEach((video) => {
                                video.pause();
                              });

                            // Stop YouTube videos
                            document
                              .querySelectorAll("iframe")
                              .forEach((iframe) => {
                                iframe.src = iframe.src;
                              });
                          }}
                        >
                          {profile.BusinessVideo.map((vid) => {
                            const embedUrl = getYouTubeEmbedUrl(vid.url);
                            const isYouTube = !!embedUrl;

                            return (
                              <SwiperSlide key={vid.id}>
                                <div className="video-container">
                                  {/* YOUTUBE */}
                                  {isYouTube ? (
                                    <iframe
                                      src={embedUrl}
                                      title={vid.name || "YouTube video"}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  ) : (
                                    /* MP4 VIDEO */
                                    <video controls>
                                      <source src={vid.url} type="video/mp4" />
                                    </video>
                                  )}
                                </div>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-2xl font-bold mb-3 capitalize">
                        À propos
                      </h3>
                      {loading ? (
                        <div className="space-y-2">
                          <Skel className="h-4 w-full" />
                          <Skel className="h-4 w-11/12" />
                          <Skel className="h-4 w-10/12" />
                          <Skel className="h-4 w-9/12" />
                        </div>
                      ) : (
                        <div
                          className="prose prose-sm md:prose-base text-gray-600"
                          dangerouslySetInnerHTML={{ __html: getDescription }}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-2xl font-bold mb-3 capitalize">
                        Services
                      </h3>
                      {loading ? (
                        <div className="space-y-3">
                          <Skel className="h-4 w-40" />
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Skel className="h-8 w-24 rounded-full" />
                            <Skel className="h-8 w-28 rounded-full" />
                            <Skel className="h-8 w-20 rounded-full" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600">
                            {getServices.length
                              ? `Services disponibles:`
                              : "Aucun service répertorié."}
                          </p>

                          <div className="flex flex-wrap gap-2 capitalize mt-5">
                            {getServices.length ? (
                              getServices.map((svc) => (
                                <span
                                  key={svc}
                                  className="bg-gray-200 px-4 py-1 rounded-full"
                                >
                                  {svc}
                                </span>
                              ))
                            ) : (
                              <span className="bg-gray-200 px-4 py-1 rounded-full">
                                N/A (tu peux garder tel quel, ou mettre N/D pour
                                « non disponible »)
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>

                    {/* Review */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="border border-gray-200 rounded-xl p-6 scroll-mt-20"
                      id="review"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold mb-3 capitalize">
                          Avis
                        </h3>

                        {!ratingshow && !profile?.isReviewed && (
                          <Button
                            variant="primary"
                            size="medium"
                            onClick={() => {
                              if (login?.user?.email) {
                                setratingshow(true);
                              } else {
                                setActiveLogin(true);
                              }
                            }}
                          >
                            Écrire un avis
                          </Button>
                        )}
                      </div>

                      <div>
                        {ratings?.length === 0 && (
                          <p className="text-gray-600">
                            Aucun avis pour le moment
                          </p>
                        )}
                      </div>

                      {ratingCount === 0 && !loading && (
                        <div className="text-center flex flex-col items-center p-10 gap-5"></div>
                      )}
                      <div
                        className={`write-review space-y-7 mb-10 ${
                          ratingshow ? "visible" : "hidden"
                        }`}
                      >
                        <div className="flex justify-center space-x-2 mb-5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star
                                size={10}
                                className={`w-8 h-8 transition-colors ${
                                  star <= rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="w-full">
                          <InputGroup
                            type="textarea"
                            label="Écrire un avis"
                            placeholder="Écrire un avis"
                            inputProps={{
                              value: reviewText,
                              onChange: (e) => setreviewtext(e.target.value),
                            }}
                          />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            size="medium"
                            className="flex-1"
                            onClick={() => setratingshow(false)}
                          >
                            Annuler
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            size="medium"
                            loading={reviewloading}
                            className="flex-1"
                            onClick={submitreview}
                          >
                            Écrire un avis
                          </Button>
                        </div>
                      </div>
                      {ratings?.length > 0 && (
                        <div className="space-y-4 divide-y divide-gray-200 mt-5">
                          {ratings.map((data) => {
                            const {
                              id,
                              rating,
                              comment,
                              displayName,
                              profileImage,
                            } = data;

                            const userInitial = displayName
                              ?.charAt(0)
                              ?.toUpperCase();

                            return (
                              <div key={id} className="pb-4">
                                <div className="flex gap-3 items-center">
                                  {getSafeAvatar(profileImage) ? (
                                    <img
                                      src={profileImage}
                                      alt={displayName}
                                      className="w-12 h-12 object-cover rounded-full"
                                      onError={(e) => {
                                        // fallback if Google image expires or fails
                                        (
                                          e.currentTarget as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold text-lg"
                                      style={{ backgroundColor: "#D6BE7D" }}
                                    >
                                      {userInitial}
                                    </div>
                                  )}

                                  <div>
                                    <span className="text-lg font-semibold capitalize block">
                                      {displayName}
                                    </span>

                                    <div className="flex gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          size={16}
                                          className={
                                            i < rating
                                              ? "text-yellow-500 fill-yellow-500"
                                              : "text-gray-300"
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {comment && (
                                  <div className="mt-4">
                                    <p className="text-gray-600 text-sm whitespace-pre-line">
                                      {comment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {reviewPage < reviewTotalPages && (
                            <div className="flex justify-center mt-6">
                              <Button
                                variant="outline"
                                size="medium"
                                loading={reviewLoadingMore}
                                onClick={() => {
                                  const nextPage = reviewPage + 1;
                                  setReviewPage(nextPage);
                                  fetchReviews(nextPage, true);
                                }}
                              >
                                Voir plus d’avis
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                <div className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="border border-gray-200 rounded-xl p-3 w-full"
                  >
                    <div className="w-full h-48 overflow-hidden rounded-2xl relative">
                      {loading ? (
                        <Skel className="absolute inset-0" />
                      ) : (
                        <>
                          {isVerified && (
                            <span className="absolute top-3 right-3 flex gap-1 items-center text-sm rounded-sm bg-[#093B56] px-2 py-1 text-white shadow-lg">
                              <ShieldCheck size={16} /> Vérifié
                            </span>
                          )}

                          <MyFavorite
                            isFavorite={profile?.isFavorite}
                            setLoginActive={setActiveLogin}
                            id={id}
                          />

                          <img
                            src={
                              getProfileImage
                                ? getProfileImage
                                : portfolioImages[0]
                            }
                            alt={getName}
                            className="w-full h-full object-cover"
                          />
                        </>
                      )}
                    </div>
                    <div className="text-center my-3">
                      {loading ? (
                        <>
                          <Skel className="h-6 w-48 mx-auto" />
                          <div className="flex justify-center gap-2 mt-2">
                            <Skel className="h-4 w-24" />
                            <Skel className="h-4 w-40" />
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-semibold">
                            {getName}
                          </span>
                          <div className="flex flex-wrap justify-center gap-2">
                            <span className="text-gray-600 text-sm">
                              {getServices[0] || "Prestataire"}
                            </span>
                            <span className="text-gray-600 text-sm flex items-center gap-1">
                              <MapPin size={16} /> {getLocation}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      {/* CONTACT DETAILS */}
                      <Button
                        variant="outline"
                        size="medium"
                        onClick={() =>
                          requireLoginOr(() => {
                            setShowContact((prev) => {
                              const next = !prev;

                              if (!prev && next) {
                                trackAnalytics("contact_reveal");
                              }

                              return next;
                            });

                            setShowSocial(false);
                          })
                        }
                      >
                        Voir les coordonnées
                      </Button>
                      {showContact && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="my-3 border border-gray-200 rounded-lg p-3 text-sm space-y-2 bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{getEmail || "Email not available"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <PhoneCall size={16} />
                            <span>{getPhone || "Phone not available"}</span>
                          </div>

                          {social.website && (
                            <a
                              href={social.website}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <Link2 size={16} />
                              <span>Visiter le site web</span>
                            </a>
                          )}

                          {/* INSTAGRAM */}
                          {social.instagram && (
                            <a
                              href={social.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <Instagram size={16} />
                              Instagram
                            </a>
                          )}

                          {/* LINKEDIN */}
                          {social.linkedin && (
                            <a
                              href={social.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <Linkedin size={16} />
                              LinkedIn
                            </a>
                          )}

                          {social.facebook && (
                            <a
                              href={social.facebook}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <Facebook size={16} />
                              Facebook
                            </a>
                          )}
                          {social.youtube && (
                            <a
                              href={social.youtube}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <Youtube size={16} />
                              youtube
                            </a>
                          )}
                          {/* FALLBACK */}
                          {!social.website &&
                            !social.instagram &&
                            !social.linkedin && (
                              <p className="text-gray-500 text-sm">
                                Aucun site web ou réseau social disponible.
                              </p>
                            )}
                        </motion.div>
                      )}
                    </div>
                    <Button
                      onClick={() => handlerequestQuote()}
                      variant="primary"
                      size="medium"
                      className="w-full !rounded-xl mt-2 mb-5"
                      disabled={eventLoading}
                    >
                      Demander un devis
                    </Button>

                    <div className="flex flex-col gap-4">
                      {loading ? (
                        <>
                          <Skel className="h-5 w-56" />
                          <Skel className="h-5 w-64" />
                          <Skel className="h-5 w-24" />
                          <Skel className="h-5 w-40" />
                        </>
                      ) : (
                        <>
                          <a href="#review">
                            <span className="text-gray-600 text-sm flex items-center gap-1">
                              <StarIcon
                                size={16}
                                className="text-yellow-500 fill-yellow-500"
                              />
                              {ratingCount} avis
                            </span>
                          </a>
                        </>
                      )}
                    </div>

                    <div className="flex justify-center gap-4 mt-4 border-t border-gray-200 py-4">
                      {loading ? (
                        <>
                          <Skel className="w-10 h-10 rounded-full" />
                          <Skel className="w-10 h-10 rounded-full" />
                          <Skel className="w-10 h-10 rounded-full" />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="border border-gray-200 rounded-xl p-3 mt-4"
                  >
                    <span className="text-xl font-semibold">Statistiques</span>

                    <div className="space-y-2 mt-3">
                      {loading ? (
                        <>
                          <div className="flex gap-2 text-gray-600 justify-between">
                            <Skel className="h-4 w-40" />
                            <Skel className="h-4 w-12" />
                          </div>
                          <div className="flex gap-2 text-gray-600 justify-between">
                            <Skel className="h-4 w-40" />
                            <Skel className="h-4 w-12" />
                          </div>
                          <div className="flex gap-2 text-gray-600 justify-between">
                            <Skel className="h-4 w-40" />
                            <Skel className="h-4 w-12" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 text-gray-600 justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Clock size={16} /> Délai de réponse
                            </span>
                            <span>2 h</span>
                          </div>

                          <div className="flex gap-2 text-gray-600 justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              <UsersRound size={16} /> Événements réalisés
                            </span>
                            <span>10+</span>
                          </div>

                          <div className="flex gap-2 text-gray-600 justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              <ShieldCheck size={16} />
                              Membre depuis
                            </span>
                            <span>
                              {profile?.createdAt
                                ? new Date(profile.createdAt).getFullYear()
                                : "N/A"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                  {documents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="border border-gray-200 rounded-xl p-3 mt-4"
                    >
                      <span className="text-xl font-semibold">Documents</span>

                      <div className="space-y-3 mt-4">
                        {loading ? (
                          <>
                            <Skel className="h-5 w-full" />
                            <Skel className="h-5 w-5/6" />
                          </>
                        ) : documents.length > 0 ? (
                          documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600">
                                  📄
                                </div>

                                {/* Info */}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {doc.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Importé le{" "}
                                    {new Date(
                                      doc.uploadedAt,
                                    ).toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-secondary hover:underline"
                                >
                                  Voir
                                </a>
                              </div>
                            </div>
                          ))
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Request Quote Modal (unchanged form; kept functional) */}

      <OuterModal showClose={false} active={active} setActive={setActive}>
        <div className="w-full max-w-3xl mx-auto p-5 md:p-8 rounded-2xl bg-white relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            }}
          />
          <h1 className="text-2xl font-bold text-center mb-3">
            Demander un devis
          </h1>
          <RequestForm
            profile={profile}
            events={events}
            setActive={setActive}
          />
        </div>
      </OuterModal>

      <OuterModal
        active={showProviderBlockModal}
        setActive={setShowProviderBlockModal}
      >
        <div className="w-full max-w-xl mx-auto p-8 border-2 border-secondary rounded-2xl bg-white">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Action non autorisée
          </h2>
          <p className="text-gray-600 text-center">
            Vous ne pouvez pas demander de devis car vous êtes enregistré
            comme prestataire.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setShowProviderBlockModal(false)}>OK</Button>
          </div>
        </div>
      </OuterModal>

      {/* Modal: No events */}
      <OuterModal active={showNoEventModal} setActive={setShowNoEventModal}>
        <div className="w-full max-w-xl mx-auto p-8 border-2 border-secondary rounded-2xl bg-white">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Aucun événement trouvé
          </h2>
          <p className="text-gray-600 text-center">
            Vous n'avez pas d'événement. Veuillez en créer un pour demander un
            devis.
          </p>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => navigate("/client/multi-events")}
              variant="primary"
              className="w-full"
            >
              Créer un événement
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal
        showClose={false}
        active={activeLogin}
        setActive={setActiveLogin}
      >
        <div className="w-full max-w-xl mx-auto p-5 md:p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <div className="text-center">
            <span className="block font-semibold text-2xl mb-2">
              Connexion requise
            </span>
            <p className="text-gray-600">
              Vous devez vous connecter pour utiliser cette fonctionnalité
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-between mt-10">
            <Button
              type="button"
              variant="outline"
              size="medium"
              className="flex-1"
              onClick={() => setActiveLogin(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              className="flex-1"
              onClick={() => handleLogin()}
            >
              Connexion
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal showClose={true} active={showShare} setActive={setshowShare}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <ProviderShare provider={profile} />
        </div>
      </OuterModal>
    </>
  );
};

export default Providerdetails;
