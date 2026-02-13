import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "../styles/provider-details-v2.css";
import {
  ArrowLeft,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Share2,
  ShieldCheck,
  Star,
  Youtube,
  CheckCircle2,
  Award,
  Heart,
  MessageCircle,
  X,
  FileText,
  Video,
  Download,
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
import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { AUTH, PROVIDER } from "../utils/endPoints";
import { useSelector } from "react-redux";
import RequestForm from "./requestQuoteForm";
import ProviderShare from "../module/Provider/SocialShare";
import { useToast } from "../utils/toast";
import { RESPONSE_CODE } from "../utils/constants";
import MyFavorite from "../components/ui/MyFavorite";
import { fakePartnerDetails } from "../data/fakePartnerDetails";
import PackagesSection from "../components/provider/PackagesSection";
import RatingSection from "../components/provider/RatingSection";
import PhotoGallery from "../components/gallery/PhotoGallery";
import BookingRequestModal, { BookingFormData } from "../components/bookings/BookingRequestModal";
import { Photo } from "../types/photo";
import { Package } from "../types/package";

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
  inUrl: string | null;
  xUrl: string | null;
  fbUrl: string | null;
  ytUrl: string | null;
  liUrl: string | null;
  portfolioImages: string[] | null;
  isVerified: boolean | null;
  isBlocked: boolean | null;
  createdAt: string;
  updatedAt: string;
  BusinessService: ServiceItem[];
  RatingOverview: RatingOverview | null;
  BusinessReview: any[];
  BusinessVideo: any[];
  BusinessDocument: any[];
  isFavourite?: boolean;
  getProfileImage?: string;
};

const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton ${className}`}></div>
);

const ProviderDetailsV2 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSelector((state: any) => state?.auth?.user || null);
  
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const apiCalled = useRef(false);

  // Handler for package selection
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowQuoteModal(true);
  };

  // Handler for booking submission
  const handleBookingSubmit = (bookingData: BookingFormData) => {
    console.log('Booking submitted:', bookingData);
    showToast('Demande de réservation envoyée avec succès !', 'success');
    setSelectedPackage(null);
    // TODO: Call API to create booking
  };

  // Convert portfolio images to Photo format
  const portfolioPhotos: Photo[] = useMemo(() => {
    if (!profile?.portfolioImages) return [];
    return profile.portfolioImages
      .filter((img) => img && img.trim())
      .map((url, index) => ({
        id: `photo-${index}`,
        url,
        title: `Photo ${index + 1}`,
        description: '',
        albumId: profile.id,
        uploaderId: profile.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
  }, [profile]);

  // Fetch partner data
  useEffect(() => {
    if (!id) return;
    if (apiCalled.current) return;
    apiCalled.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Use fake data for demo
        const fakeData = fakePartnerDetails[parseInt(id) - 1];
        if (fakeData) {
          setProfile(fakeData);
        } else {
          setErrorMsg("Prestataire non trouvé");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Initialize Fancybox
  useEffect(() => {
    Fancybox.bind("[data-fancybox='portfolio']", {
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
    });

    return () => {
      Fancybox.destroy();
    };
  }, [profile]);

  // Helper functions
  const getProviderName = () => {
    if (!profile) return "Prestataire";
    return profile.name?.trim() || "Prestataire";
  };

  const getLocation = () => {
    if (!profile) return "";
    const { city, state, country } = profile;
    if (city && country) return `${city}, ${country}`;
    if (state && country) return `${state}, ${country}`;
    if (country) return country;
    return "";
  };

  const getServices = useMemo(() => {
    if (!profile?.BusinessService) return [];
    return profile.BusinessService.map((s) => s.service.name);
  }, [profile]);

  const portfolioImages = useMemo(() => {
    if (!profile?.portfolioImages) return [];
    return profile.portfolioImages.filter((img) => img && img.trim());
  }, [profile]);

  const averageRating = profile?.RatingOverview?.averageRating || 0;
  const totalReviews = profile?.RatingOverview?.totalCount || 0;

  if (loading) {
    return (
      <div className="provider-v2">
        <div className="provider-v2-container">
          <Skel className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="provider-v2">
        <div className="provider-v2-container">
          <div className="error-message">{errorMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-v2">
      {/* Hero Section with Carousel */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <Link to="/partners" className="back-link">
              <ArrowLeft size={20} />
            </Link>
            
            <div className="hero-info">
              <motion.div
                className="hero-title-wrapper"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="hero-title">{getProviderName()}</h1>
                {profile?.isVerified && (
                  <div className="verified-badge">
                    <ShieldCheck size={20} />
                    <span>Vérifié</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="hero-meta"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {getLocation() && (
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{getLocation()}</span>
                  </div>
                )}
                {averageRating > 0 && (
                  <div className="meta-item">
                    <Star size={16} fill="currentColor" />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="reviews-count">({totalReviews} avis)</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="hero-actions"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button
                  onClick={() => setShowQuoteModal(true)}
                  className="btn-primary"
                >
                  <Mail size={18} />
                  Demander un devis
                </Button>
                <button className="btn-icon" onClick={() => setShowShareModal(true)}>
                  <Share2 size={20} />
                </button>
                <MyFavorite
                  businessId={profile?.id || ""}
                  isFavourite={profile?.isFavourite || false}
                  setProfile={setProfile}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Carousel Background */}
        {portfolioImages.length > 0 && (
          <Swiper
            className="hero-carousel"
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={1000}
            modules={[Autoplay]}
          >
            {portfolioImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="carousel-slide">
                  <img src={img} alt={`${getProviderName()} - ${idx + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.section>

      {/* Main Content */}
      <div className="provider-v2-container">
        <div className="content-grid">
          {/* Left Column - Main Content */}
          <div className="main-content">
            {/* Portfolio Gallery - EN PREMIER */}
            {portfolioImages.length > 0 && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <Award size={24} />
                  <h2>Portfolio</h2>
                  <span className="count-badge">{portfolioImages.length} photos</span>
                </div>
                <div className="portfolio-grid">
                  {portfolioImages.map((img, idx) => (
                    <motion.a
                      key={idx}
                      href={img}
                      data-fancybox="portfolio"
                      className="portfolio-item"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={img} alt={`Portfolio ${idx + 1}`} />
                      <div className="portfolio-overlay">
                        <span>Voir</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.section>
            )}

            {/* About Section - DEUXIÈME */}
            {profile?.description && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <MessageCircle size={24} />
                  <h2>À propos</h2>
                </div>
                <div
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: profile.description }}
                />
              </motion.section>
            )}

            {/* Services Section - TROISIÈME */}
            {getServices.length > 0 && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <Award size={24} />
                  <h2>Services proposés</h2>
                </div>
                <div className="services-grid">
                  {getServices.map((service, idx) => (
                    <motion.div
                      key={idx}
                      className="service-tag"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <CheckCircle2 size={16} />
                      <span>{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Videos Section */}
            {profile?.BusinessVideo && profile.BusinessVideo.length > 0 && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <Video size={24} />
                  <h2>Vidéos</h2>
                  <span className="count-badge">{profile.BusinessVideo.length}</span>
                </div>
                <div className="videos-grid">
                  {profile.BusinessVideo.map((video, idx) => (
                    <motion.div
                      key={idx}
                      className="video-item"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <div className="video-wrapper">
                        <iframe
                          src={video.url.replace('watch?v=', 'embed/')}
                          title={`Vidéo ${idx + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Packages Section - NOUVELLE */}
            {profile?.id && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <PackagesSection 
                  providerId={profile.id} 
                  onSelectPackage={handleSelectPackage}
                />
              </motion.section>
            )}

            {/* Photo Gallery Section - NOUVELLE */}
            {portfolioPhotos.length > 0 && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <span className="text-2xl">📸</span>
                  <h2>Galerie Photos</h2>
                  <span className="count-badge">{portfolioPhotos.length}</span>
                </div>
                <PhotoGallery 
                  photos={portfolioPhotos}
                  maxPreview={6}
                  showLightbox={true}
                />
              </motion.section>
            )}

            {/* Rating & Reviews Section - NOUVELLE */}
            {profile?.id && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <RatingSection 
                  providerId={profile.id}
                  currentUserId={user?.id}
                  userRole={user?.role}
                />
              </motion.section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="sidebar">
            <motion.div
              className="sidebar-sticky"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Contact Card */}
              <div className="contact-card">
                <h3>Informations de contact</h3>
                <div className="contact-items">
                  {profile?.phoneNumber && (
                    <a href={`tel:${profile.phoneNumber}`} className="contact-item">
                      <PhoneCall size={18} />
                      <span>{profile.phoneNumber}</span>
                    </a>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="contact-item">
                      <Mail size={18} />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.address && (
                    <div className="contact-item">
                      <MapPin size={18} />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="social-links">
                  <a 
                    href={profile?.fbUrl || "https://facebook.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={profile?.inUrl || "https://instagram.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="https://pinterest.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Pinterest"
                    className="pinterest-icon"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                    </svg>
                  </a>
                  <a 
                    href={profile?.xUrl || "https://x.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="X (Twitter)"
                  >
                    <X size={20} />
                  </a>
                  <a 
                    href={profile?.liUrl || "https://linkedin.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Action */}
              <Button
                onClick={() => setShowQuoteModal(true)}
                className="btn-primary btn-block"
              >
                <Mail size={18} />
                Demander un devis
              </Button>

              {/* Documents Section - DANS SIDEBAR */}
              {profile?.BusinessDocument && profile.BusinessDocument.length > 0 && (
                <div className="sidebar-section">
                  <div className="section-header-sidebar">
                    <FileText size={20} />
                    <h3>Documents</h3>
                  </div>
                  <div className="documents-list-sidebar">
                    {profile.BusinessDocument.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-item-sidebar"
                      >
                        <div className="document-icon-sidebar">
                          <FileText size={18} />
                        </div>
                        <div className="document-info-sidebar">
                          <div className="document-name-sidebar">{doc.name}</div>
                          <div className="document-type-sidebar">{doc.type.toUpperCase()}</div>
                        </div>
                        <Download size={16} className="download-icon-sidebar" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section - DANS SIDEBAR */}
              {profile?.BusinessReview && profile.BusinessReview.length > 0 && (
                <div className="sidebar-section">
                  <div className="section-header-sidebar">
                    <Star size={20} />
                    <h3>Avis clients</h3>
                  </div>
                  <div className="reviews-list-sidebar">
                    {profile.BusinessReview.slice(0, 3).map((review, idx) => (
                      <div key={idx} className="review-card-sidebar">
                        <div className="review-header-sidebar">
                          <div className="author-avatar-sidebar">
                            {review.userName?.[0] || "U"}
                          </div>
                          <div className="review-author-info">
                            <div className="author-name-sidebar">{review.userName}</div>
                            <div className="review-rating-sidebar">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="review-text-sidebar">{review.review}</p>
                        <div className="review-date-sidebar">
                          {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <OuterModal
        showModal={showQuoteModal}
        setShowModal={setShowQuoteModal}
        showClose={false}
      >
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowQuoteModal(false)}>
            <X size={24} />
          </button>
          <h2>Demander un devis</h2>
          <RequestForm profile={profile} />
        </div>
      </OuterModal>

      <OuterModal
        showModal={showShareModal}
        setShowModal={setShowShareModal}
        showClose={false}
      >
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowShareModal(false)}>
            <X size={24} />
          </button>
          <h2>Partager</h2>
          <ProviderShare />
        </div>
      </OuterModal>

      {/* Booking Request Modal */}
      <BookingRequestModal
        isOpen={selectedPackage !== null}
        onClose={() => setSelectedPackage(null)}
        package={selectedPackage}
        providerName={getProviderName()}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default ProviderDetailsV2;
