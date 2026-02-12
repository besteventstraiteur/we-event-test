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
  const user = useSelector((state: any) => state.auth.user);
  
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const apiCalled = useRef(false);

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
              <span>Retour</span>
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
            {/* Services Section */}
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

            {/* About Section */}
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

            {/* Portfolio Gallery */}
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

            {/* Reviews Section */}
            {profile?.BusinessReview && profile.BusinessReview.length > 0 && (
              <motion.section
                className="section-card"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-header">
                  <Star size={24} />
                  <h2>Avis clients</h2>
                </div>
                <div className="reviews-list">
                  {profile.BusinessReview.slice(0, 5).map((review, idx) => (
                    <motion.div
                      key={idx}
                      className="review-card"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <div className="review-header">
                        <div className="review-author">
                          <div className="author-avatar">
                            {review.userName?.[0] || "U"}
                          </div>
                          <div>
                            <div className="author-name">{review.userName}</div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="review-text">{review.review}</p>
                    </motion.div>
                  ))}
                </div>
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
                  {profile?.fbUrl && (
                    <a href={profile.fbUrl} target="_blank" rel="noopener noreferrer">
                      <Facebook size={20} />
                    </a>
                  )}
                  {profile?.inUrl && (
                    <a href={profile.inUrl} target="_blank" rel="noopener noreferrer">
                      <Instagram size={20} />
                    </a>
                  )}
                  {profile?.liUrl && (
                    <a href={profile.liUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {profile?.ytUrl && (
                    <a href={profile.ytUrl} target="_blank" rel="noopener noreferrer">
                      <Youtube size={20} />
                    </a>
                  )}
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
            <Share2 size={24} />
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
            <Share2 size={24} />
          </button>
          <h2>Partager</h2>
          <ProviderShare />
        </div>
      </OuterModal>
    </div>
  );
};

export default ProviderDetailsV2;
