import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Calendar,
  Award,
  Users,
  ChevronRight,
  Check,
  Instagram,
  Facebook,
  Linkedin,
  Share2,
  Heart,
  Shield,
  Clock,
  Euro,
  Image as ImageIcon,
  FileText,
  X
} from 'lucide-react';
import { fakePartnerDetails } from '../data/fakePartnerDetails';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/provider-details-new.css';

interface QuoteFormData {
  eventType: string;
  eventDate: string;
  guestCount: string;
  budget: string;
  message: string;
  name: string;
  email: string;
  phone: string;
}

const ProviderDetailsNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    eventType: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    message: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const partnerData = fakePartnerDetails.find(p => p.id === parseInt(id || '1'));
      setProvider(partnerData || fakePartnerDetails[0]);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'portfolio', 'services', 'reviews'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote request:', quoteForm);
    // Add API call here
    setShowQuoteModal(false);
    // Show success message
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093B56]"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prestataire non trouvé</h2>
          <Link to="/partners" className="text-[#093B56] hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-details-new min-h-screen bg-gray-50">
      {/* Sticky Header with CTA */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/partners')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{provider.businessName}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span>({provider.totalReviews} avis)</span>
                  </div>
                  {provider.verified && (
                    <div className="flex items-center gap-1 text-[#093B56]">
                      <Shield className="w-4 h-4" />
                      <span>Vérifié</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleContactClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">Contacter</span>
              </button>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-[#093B56] text-white rounded-lg hover:bg-[#0a4a6b] transition-colors shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Demander un devis</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-t border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'services', label: 'Services' },
              { id: 'reviews', label: 'Avis' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`py-3 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-[#093B56] text-[#093B56] font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image Gallery */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <Swiper
                  modules={[Pagination, Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  className="provider-hero-slider"
                >
                  {provider.portfolioImages.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <div
                        className="relative h-[400px] md:h-[500px] lg:h-[600px] cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`${provider.businessName} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {idx + 1} / {provider.portfolioImages.length}
                          </span>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-4 gap-4 mt-6"
              >
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Award className="w-6 h-6 text-[#093B56] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{provider.completedEvents}</p>
                  <p className="text-xs text-gray-600">Événements</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{provider.rating}</p>
                  <p className="text-xs text-gray-600">Note moyenne</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Users className="w-6 h-6 text-[#093B56] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{provider.totalReviews}</p>
                  <p className="text-xs text-gray-600">Avis clients</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{provider.responseTime}</p>
                  <p className="text-xs text-gray-600">Réponse</p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-32 space-y-4"
              >
                {/* Price Range Card */}
                <div className="bg-gradient-to-br from-[#093B56] to-[#0a4a6b] text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Euro className="w-5 h-5" />
                    <h3 className="text-lg font-bold">Tarification</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/80">Budget min.</span>
                      <span className="font-bold">{provider.budgetRange.min}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Budget max.</span>
                      <span className="font-bold">{provider.budgetRange.max}€</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-white/90">
                      Prix indicatifs. Demandez un devis personnalisé pour votre événement.
                    </p>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de contact</h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="p-2 bg-[#093B56]/10 rounded-lg group-hover:bg-[#093B56]/20 transition-colors">
                        <Phone className="w-5 h-5 text-[#093B56]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-semibold text-gray-900">{provider.phone}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </a>

                    <a
                      href={`mailto:${provider.email}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="p-2 bg-[#093B56]/10 rounded-lg group-hover:bg-[#093B56]/20 transition-colors">
                        <Mail className="w-5 h-5 text-[#093B56]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900 truncate">{provider.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </a>

                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="p-2 bg-[#093B56]/10 rounded-lg group-hover:bg-[#093B56]/20 transition-colors">
                          <Globe className="w-5 h-5 text-[#093B56]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Site web</p>
                          <p className="font-semibold text-gray-900">Visiter</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </a>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-[#093B56]/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#093B56]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Localisation</p>
                        <p className="font-semibold text-gray-900">{provider.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(provider.socialLinks.instagram || provider.socialLinks.facebook || provider.socialLinks.linkedin) && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Réseaux sociaux</h3>
                    <div className="flex gap-3">
                      {provider.socialLinks.instagram && (
                        <a
                          href={provider.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {provider.socialLinks.facebook && (
                        <a
                          href={provider.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {provider.socialLinks.linkedin && (
                        <a
                          href={provider.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Button - Mobile Fixed */}
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 px-6 py-4 bg-[#093B56] text-white rounded-xl hover:bg-[#0a4a6b] transition-colors shadow-2xl"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-bold">Demander un devis gratuit</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">À propos</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">{provider.businessDescription}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {provider.portfolioImages.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                >
                  <img
                    src={img}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Services proposés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {provider.services.map((service: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#093B56]/5 to-[#0ea5e9]/5 rounded-xl border border-[#093B56]/10 hover:border-[#093B56]/30 transition-colors"
                >
                  <div className="p-2 bg-[#093B56] rounded-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{service}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Avis clients</h2>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">{provider.rating}</span>
                <span className="text-gray-600">({provider.totalReviews} avis)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {provider.reviews.map((review: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#093B56] to-[#0ea5e9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Demander un devis</h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'événement *
                  </label>
                  <select
                    required
                    value={quoteForm.eventType}
                    onChange={(e) => setQuoteForm({ ...quoteForm, eventType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="mariage">Mariage</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="entreprise">Événement d'entreprise</option>
                    <option value="bapteme">Baptême</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de l'événement *
                    </label>
                    <input
                      type="date"
                      required
                      value={quoteForm.eventDate}
                      onChange={(e) => setQuoteForm({ ...quoteForm, eventDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'invités *
                    </label>
                    <input
                      type="number"
                      required
                      value={quoteForm.guestCount}
                      onChange={(e) => setQuoteForm({ ...quoteForm, guestCount: e.target.value })}
                      placeholder="Ex: 50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé
                  </label>
                  <select
                    value={quoteForm.budget}
                    onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                  >
                    <option value="">Sélectionnez une fourchette</option>
                    <option value="0-1000">Moins de 1000€</option>
                    <option value="1000-3000">1000€ - 3000€</option>
                    <option value="3000-5000">3000€ - 5000€</option>
                    <option value="5000+">Plus de 5000€</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de votre événement *
                  </label>
                  <textarea
                    required
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    rows={4}
                    placeholder="Décrivez votre événement et vos besoins..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent resize-none"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Vos coordonnées</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          placeholder="votre@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#093B56] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#093B56] text-white rounded-lg hover:bg-[#0a4a6b] transition-colors font-bold shadow-lg"
                  >
                    Envoyer ma demande
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Contact</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="p-3 bg-[#093B56] rounded-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-bold text-gray-900">{provider.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="p-3 bg-[#093B56] rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-bold text-gray-900 truncate">{provider.email}</p>
                  </div>
                </a>

                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-3 bg-[#093B56] rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Site web</p>
                      <p className="font-bold text-gray-900">Visiter le site</p>
                    </div>
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  setShowContactModal(false);
                  setShowQuoteModal(true);
                }}
                className="w-full mt-6 px-6 py-3 bg-[#093B56] text-white rounded-lg hover:bg-[#0a4a6b] transition-colors font-bold"
              >
                Demander un devis
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderDetailsNew;
