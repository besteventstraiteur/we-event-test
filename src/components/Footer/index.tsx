import logo from "../../assets/images/we-event-logo-white.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpFromDot,
  Dot,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";

const Footer = () => {
  const toast = useToast();

  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Show Back-To-Top
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async () => {
    if (!email.trim()) {
      return toast.warn("Email requis", "Veuillez entrer votre email.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.warn(
        "Email invalide",
        "Veuillez saisir une adresse valide.",
      );
    }

    try {
      setLoading(true);
      await postRequest(PROVIDER.SUBSCRIBE_NEWSLETTER, { email });
      toast.success(
        "Inscription réussie",
        "Vous êtes maintenant abonné à notre newsletter.",
      );

      setEmail("");
    } catch (error: any) {
      console.error("SUBSCRIBE ERROR:", error);

      const message =
        error?.response?.data?.message ||
        "Impossible de s’abonner pour le moment.";

      toast.error("Erreur", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer className="bg-secondary">
        <div className="section-padding-y">
          <div className="container-large">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-2">
              {/* CONTACT BLOCK */}
              <div className="pr-4">
                <div className="mb-5">
                  <span className="heading-font text-white text-2xl">
                    Contactez-nous
                  </span>
                </div>
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
                  <p>93 Avenue du General de Gaulle 83300 Draguignan</p>
                </div>
              </div>

              {/* LOGO */}
              <div className="flex md:justify-center md:items-center border-y py-5 md:border-y-0 md:border-x-[2px] border-[#E0E0E0]/18">
                <Link to="/">
                  <img src={logo} alt="We Event" className="max-w-48" />
                </Link>
              </div>

              {/* SOCIAL */}
              <div className="flex flex-col md:items-end md:pl-4">
                <div className="mb-5">
                  <span className="heading-font text-white text-2xl">
                    Suivez-nous
                  </span>
                </div>
                <div className="flex gap-4 text-light">
                  <a
                    href="https://www.facebook.com/profile.php?id=61577414102595"
                    target="_blank"
                    className="icon"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/weevent_officiel/"
                    target="_blank"
                    className="icon"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/we-event-officiel"
                    target="_blank"
                    className="icon"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="my-10 w-full h-[1px] bg-[#E0E0E0]/18" />

            {/* BOTTOM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-2">
              {/* LINKS */}
              <div>
                <span className="heading-font text-white text-2xl">
                  Liens rapides
                </span>
                <div className="flex flex-col gap-2 text-light mt-4">
                  <Link to="/">Accueil</Link>
                  <Link to="/partners">Partenaires</Link>
                  <Link to="/contact">Contact</Link>
                </div>
              </div>

              {/* HOURS */}
              <div>
                <span className="heading-font text-white text-2xl">
                  Horaires d’ouverture
                </span>
                <div className="text-light mt-4 space-y-2">
                  <p>Lundi – Vendredi : 9h00 – 18h00</p>
                  <p>Samedi : 10h00 – 16h00</p>
                  <p>Dimanche : fermé</p>
                </div>
              </div>

              {/* NEWSLETTER */}
              <div className="flex flex-col md:items-end">
                <span className="heading-font text-white text-2xl">
                  S’abonner à notre newsletter
                </span>

                <div className="max-w-80 w-full relative group mt-4">
                  <input
                    type="email"
                    placeholder="Saisissez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 text-light outline-0 border border-[#F4F5F0]/19 bg-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="text-white absolute right-5 group-hover:right-3 top-3 w-8 h-8 flex justify-center items-center"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="bg-[#002D48]">
          <div className="container-large">
            <div className="py-4 text-sm flex flex-col md:flex-row gap-y-2">
              <p className="text-white">
                &copy; {new Date().getFullYear()} We Event LLC.
              </p>
              <Link to="/terms" className="text-white ml-4">
                Conditions générales
              </Link>
              <Link to="/privacy-policy" className="text-white ml-4">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-15 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-tertiary/90 hover:bg-tertiary text-white shadow-lg cursor-pointer"
        >
          <ArrowUpFromDot />
        </button>
      )}
    </>
  );
};

export default Footer;
