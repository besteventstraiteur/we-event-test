import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {  
  Facebook, 
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

import Button from "../components/ui/Button";
import TestimonialsSection from "../components/home/TestimonialsSection";
import { getRequest } from "../utils/http-client/axiosClient";
import { ADMIN } from "../utils/endPoints";
import { IMAGE_URL, VIDEO_URL } from "../utils/constants";

import { motion } from "motion/react";
import user1 from "../../src/assets/images/user-1.jpg";
import user2 from "../../src/assets/images/user-2.jpg";
import user3 from "../../src/assets/images/user-3.jpg";
import user4 from "../../src/assets/images/user-4.jpg";
import user5 from "../../src/assets/images/user-5.jpg";
import user6 from "../../src/assets/images/user-6.jpg";
import contactbg from "../../src/assets/images/contact-bg.jpg";
import Getstartedthumb from "../../src/assets/images/get-started.jpg";
import Leafbg from "../../src/assets/images/leaf-bg.svg";
import Leafwhite from "../../src/assets/images/white-leaf.svg";
import managmenticon from "../../src/assets/images/compelete-managment.svg";
import guesticon from "../../src/assets/images/guest-icon.svg";
import budgeticon from "../../src/assets/images/budget-icon.svg";
import minisiteicon from "../../src/assets/images/mini-site.svg";
import vendoricon from "../../src/assets/images/verification-icon.svg";
import secureicon from "../../src/assets/images/secure-payment.svg";
import Leafimage from "../../src/assets/images/leaf.svg";
import Bannerimage from "../assets/images/banner.webp";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Import Swiper React components

// Import required modules
import SearchBanner from "../module/layout/SearchBanner";
import Slider from "../module/Homepage/Slider";
import Enquiry from "./Enquiryform";
import Memories from "./sweet-momeries";
import Gallery from "./Gallery";
import TestimonialsSlider from "../components/home/Testimonials-two";

/* Start Animate listing */
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // gap between li animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
/* End Animate listing */
const SkeletonBox = ({ className }: { className?: string }) => (
  <div
    className={`bg-gray-200 animate-pulse rounded-md ${className || ""}`}
  ></div>
);

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="container-1180 py-20 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14">
        {/* Left Side (Text) */}
        <div className="w-full">
          <SkeletonBox className="h-12 w-3/4 mb-4" />
          <SkeletonBox className="h-12 w-1/2 mb-8" />
          <SkeletonBox className="h-6 w-full mb-2" />
          <SkeletonBox className="h-6 w-5/6 mb-8" />
          <div className="flex gap-4">
            <SkeletonBox className="h-12 w-36" />
            <SkeletonBox className="h-12 w-36" />
          </div>
        </div>
        {/* Right Side (Image) */}
        <div className="flex justify-center lg:justify-end">
          <SkeletonBox className="w-full h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

const options = [
  { value: "Florist", label: "Florist" },
  { value: "Photographer", label: "Photographer" },
  { value: "Transport", label: "Transport" },
  { value: "Videographer", label: "Videographer" },
  { value: "Decorators", label: "Decorators" },
];

const distance = [
  { value: "€100", label: "€50" },
  { value: "€100", label: "€100" },
  { value: "€500", label: "€500" },
];

const HomePage: React.FC = () => {
  // counter
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Construct full media URLs from API paths ---
  const getImageUrl = (path: string) => {
    // IMPORTANT: Replace with your actual Cloudinary cloud name or image base URL
    if (!path) return "";
    return `${IMAGE_URL}/${path}`;
  };

  const getVideoUrl = (path: string) => {
    if (!path) return "";
    return `${VIDEO_URL}/${path}`;
  };

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        setLoading(true);
        const resp = await getRequest(`${ADMIN.PAGES}/4`);
        setContent(resp?.data?.data?.content);
      } catch (error) {
        console.error("Failed to fetch homepage content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  //const pageContent = content?.[i18n.language];
  const sharedContent = content?.shared;

  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}

      <section
        className="flex items-center py-12  h-dvh max-h-[800px] px-4 text-left relative before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-[#093B56]/0 before:to-[#093B56]"
        style={{ background: `url(${Bannerimage})` }}
      >
        <div className="container-large">
          <div className="w-full lg:max-w-[650px] mx-auto text-center relative z-1">
            {/* <p className="text-white uppercase">
              We Event Wedding, Corporate, Ceremony Planner
            </p> */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-size-5xl text-white my-5"
            >
              {/* {pageContent?.first?.heading} */}
              Organiser un événement n’a jamais été aussi simple
            </motion.h1>
            {/* <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-white text-center"
              dangerouslySetInnerHTML={{
                __html: pageContent?.first?.description,
              }}
            /> */}

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-white text-center mx-auto w-full max-w-[450px]"
            >
              Trouvez et gérez les meilleurs prestataires, planifiez et
              organisez votre événement de A à Z. C’est simple, rapide et
              efficace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white w-full p-1 flex flex-col sm:flex-row gap-4 rounded-lg mt-12"
            >
              <Link to="/login" className="flex-1">
                <Button variant="primary" size="medium" className="w-full">
                  J’organise un événement
                </Button>
              </Link>

              <Link to="/login" className="flex-1">
                <Button
                  variant="outline"
                  size="medium"
                  className="w-full border-white"
                >
                  Je suis un professionnel
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: false, amount: 0.3 }}
          className="filter"
        >
          <SearchBanner />
        </motion.div>
      </div>

      <Gallery />

      <section className="section-padding-y pt-0">
        <div className="container-large">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <img src={Leafimage} />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-size-2xl mb-2"
            >
              Prestataires d’exception
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center text-gray-600 max-w-[768px] mx-auto"
            >
              Découvrez notre sélection de prestataires vérifiés, reconnus pour
              leur excellence
            </motion.p>
          </div>
        </div>

        <div className="container-large pr-0 md:pr-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Slider />
          </motion.div>

          <div className="flex justify-center mt-16">
            <Link to="/partners">
              <Button
                variant="primary"
                size="large"
                className="w-full sm:w-auto"
              >
                Voir tous les services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ready to start */}

      <section
        className="section-padding-y relative before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/30"
        style={{ background: `url(${Getstartedthumb})` }}
      >
        <div className="container-1180 relative z-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="bg-primary max-w-[700px] rounded-2xl p-9"
          >
            <span className="block uppercase text-secondary">
              Commencez dès maintenant
            </span>
            <h2 className="text-size-2xl font-bold my-3">
              Prêt(e) à commencer ?
            </h2>
            <div className="mb-4 w-full max-w-[400px]">
              <p className="text-gray-600">
                Rejoignez des milliers de clients satisfaits et commencez dès
                maintenant à organiser l’événement de vos rêves
              </p>
            </div>

            <div className="flex mt-5">
              <img
                alt="ready to start"
                src={user1}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
              <img
                alt="ready to start"
                src={user2}
                className="w-12 h-12 rounded-full object-cover border-2 border-white -ml-4"
              />
              <img
                alt="ready to start"
                src={user3}
                className="w-12 h-12 rounded-full object-cover border-2 border-white -ml-4"
              />
              <img
                alt="ready to start"
                src={user4}
                className="w-12 h-12 rounded-full object-cover border-2 border-white -ml-4"
              />
              <img
                alt="ready to start"
                src={user5}
                className="w-12 h-12 rounded-full object-cover border-2 border-white -ml-4"
              />
              <img
                alt="ready to start"
                src={user6}
                className="w-12 h-12 rounded-full object-cover border-2 border-white -ml-4"
              />
            </div>

            <div className="flex mt-8 flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Créer mon compte gratuitement
                </Button>
              </Link>

              <Link to="/partners">
                <Button
                  variant="outline"
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Découvrir les prestataires
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div>

        <section
          className="section-padding-y bg-secondary bg-no-repeat bg-right bg-contain"
          style={{ backgroundImage: `url(${Leafbg})` }}
        >
          <div className="container-large">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-4">
                <img src={Leafwhite} alt="leaf" />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-size-2xl text-white mb-2"
              >
                Tout ce dont vous avez besoin
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-white"
              >
                We Event vous accompagne à chaque étape de l’organisation de
                votre événement
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-14 items-center lg:px-28">
              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={managmenticon}
                    alt={"Gestion complète"}
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Gestion complète
                </h3>
                <p className="text-white/50">
                  Planifiez votre événement de A à Z grâce à nos outils
                  intuitifs : rétroplanning, tâches, budget et bien plus encore.
                </p>
              </div>

              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={guesticon}
                    alt={"Gestion des invités"}
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Gestion des invités
                </h3>
                <p className="text-white/50">
                  Envoyez vos invitations, suivez les réponses (RSVP) et créez
                  votre plan de table en toute simplicité.
                </p>
              </div>

              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={budgeticon}
                    alt={"Suivi du budget"}
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Suivi du budget
                </h3>
                <p className="text-white/50">
                  Maîtrisez vos dépenses en temps réel grâce à notre outil
                  intelligent de gestion de budget
                </p>
              </div>

              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={minisiteicon}
                    alt="mini-site"
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Mini-site de votre événement
                </h3>
                <p className="text-white/50">
                  Créez un site personnalisé pour votre événement avec toutes
                  les informations pratiques.
                </p>
              </div>

              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={vendoricon}
                    alt="vendor"
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Prestataires vérifiés
                </h3>
                <p className="text-white/50">
                  Accédez à une sélection rigoureuse de prestataires certifiés
                  et recommandés.
                </p>
              </div>

              <div className="text-center pt-8 pb-5 px-5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow">
                <div className="mb-4 relative">
                  <span className="w-10 h-10 rounded-full bg-white/20 absolute top-0"></span>
                  <img
                    src={secureicon}
                    alt="secure payments"
                    className="mx-auto block"
                  />
                </div>
                <h3 className="text-size-medium font-semibold mb-2 text-white">
                  Paiement sécurisé
                </h3>
                <p className="text-white/50">
                  Profitez de notre système sécurisé d’acomptes et de paiements
                  pour tous vos prestataires
                </p>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSlider />

        <Memories />

        {/* Testimonials */}

        <TestimonialsSection />

        {/* Counter */}

        <section className="bg-secondary py-12">
          <div className="container-large">
            <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="text-center relative">
                <span className="text-5xl sm:text-8xl heading-font text-white/10">
                  {inView && <CountUp end={1077} duration={2} />}
                </span>
                <span className="text-white uppercase absolute top-1/2 left-0 right-0">
                  Lieux de réception
                </span>
              </div>

              <div className="text-center relative">
                <span className="text-5xl sm:text-8xl heading-font text-white/10">
                  {inView && <CountUp end={2150} duration={2} />}
                </span>
                <span className="text-white uppercase absolute top-1/2 left-0 right-0">
                  Mariages
                </span>
              </div>

              <div className="text-center relative">
                <span className="text-5xl sm:text-8xl heading-font text-white/10">
                  {inView && <CountUp end={964} duration={2} />}
                </span>
                <span className="text-white uppercase absolute top-1/2 left-0 right-0">
                  Gâteaux
                </span>
              </div>

              <div className="text-center relative">
                <span className="text-5xl sm:text-8xl heading-font text-white/10">
                  {inView && <CountUp end={1301} duration={2} />}
                </span>
                <span className="text-white uppercase absolute top-1/2 left-0 right-0">
                  Couples heureux
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Enquiry */}

        <section className="section-padding-y">
          <div className="container-large">
            <div
              className="section-padding-y overflow-hidden px-4 lg:px-14 rounded-3xl relative before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-[#282C2C] before:to-[#093B56]/60"
              style={{ background: `url(${contactbg})`,backgroundRepeat:"no-repeat",backgroundSize:"cover" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 relative z-1 gap-7 lg:gap-10 xl:gap-32">
                <div>
                  <div className="space-y-8">
                    <span className="text-white uppercase">Contactez-nous</span>
                    <div>
                      <h2 className="text-size-4xl text-white mt-5">
                        Organisez votre prochain événement avec We Event
                      </h2>
                      <p className="text-light my-4">
                        Notre équipe est à votre disposition pour vous
                        accompagner dans l’organisation de votre événement..
                      </p>
                    </div>

                    <div>
                      <span className="mb-2 heading-font text-size-xlarge block text-white">
                        Contactez-nous
                      </span>

                      <div className="flex flex-col gap-2 text-light">
                        <a
                          href="mailto:jeff@we-event.eu"
                          className="hover:text-white"
                        >
                          jeff@we-event.eu
                        </a>
                        <a
                          href="mailto:robin@we-event.eu"
                          className="hover:text-white"
                        >
                          robin@we-event.eu
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 heading-font text-size-xlarge block text-white">
                        Adresse
                      </span>

                      <p className="text-light">
                        93 Avenue du General de Gaulle 83300 Draguignan
                      </p>
                    </div>

                    <div className="flex gap-4 text-light">
                      <span className="heading-font text-size-xlarge text-white text-2xl">
                        Suivez-nous :
                      </span>
                      <a
                        href="https://www.facebook.com/profile.php?id=61577414102595" target="_blank"
                        className="flex justify-center items-center w-9 h-9 border border-[#E0E0E0]/18 transition-all hover:bg-[#F4F5F0]/19"
                      >
                        <Facebook size={20} />
                      </a>
                      <a
                        href="https://www.instagram.com/weevent_officiel/" target="_blank"
                        className="flex justify-center items-center w-9 h-9 border border-[#E0E0E0]/18 transition-all hover:bg-[#F4F5F0]/19"
                      >
                        <Instagram size={20} />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/we-event-officiel" target="_blank"
                        className="flex justify-center items-center w-9 h-9 border border-[#E0E0E0]/18 transition-all hover:bg-[#F4F5F0]/19"
                      >
                        <Linkedin size={20} />
                      </a>
                      
                    </div>
                  </div>
                </div>

                <Enquiry />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
