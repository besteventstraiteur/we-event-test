import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, HelpCircle } from "lucide-react";
import Accordion from "../components/contact/Faq";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputGroup from "../components/ui-main/InputGroup";
import Button from "../components/ui/Button";
import { ADMIN, AUTH } from "../utils/endPoints";
import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { useToast } from "../utils/toast";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import OfficeMap from "../module/Contact/Map";

// ---------------- Types ----------------
type Language = "en" | "es" | "fr";
type FAQItem = { question: string; answer: string };
type SharedContent = {
  email?: string;
  phone?: string;
  businessHours?: {
    weekdays?: { start?: string; end?: string };
    saturday?: { start?: string; end?: string };
    sundayClosed?: boolean;
  };
};

// This type correctly represents the object at `response.data.content`
type ContactPageApi = {
  id?: string;
  slug: string;
  title?: string;
  content: ContactPageContent; // The actual content is nested here
};

const to12h = (hhmm?: string) => {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const schema = yup.object().shape({
  name: yup.string().required("Prénom obligatoire"),
  email: yup
    .string()
    .email("Adresse e-mail invalide ")
    .required("Adresse e-mail obligatoire")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Veuillez saisir une adresse e-mail valide",
    ),
  phone: yup.string().required("Numéro de téléphone obligatoire"),
  address: yup.string(),
  message: yup.string(),
});

// ---------------- Component ----------------
const ContactPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<ContactPageApi | null>(null);

  // Enquiry form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // Fetch contact-page by slug once
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const resp = await getRequest(`${ADMIN.PAGES}/6`);

        // *** FIX: The correct data is in `resp.data.content` ***
        // The API nests the page data inside a `content` property.
        const data = resp?.data?.data as ContactPageApi | undefined;
        // The a tual content (en, es, shared) is in a *second* `content` object.
        if (data) {
          setPage(data);
        } else {
          console.error("Content structure not as expected:", resp);
        }
      } catch (e) {
        console.error("Failed to load contact content", e);
      }
    };
    fetchContent();
  }, []);

  // Shared fields are inside the nested `content` object
  const shared = page?.content?.shared || {};
  const email = shared.email || "";
  const phone = shared.phone || "";

  // Business hours formatting (12h)
  const bh = shared.businessHours || {};
  const weekdays = bh.weekdays || {};
  const saturday = bh.saturday || {};
  const sundayClosed = bh.sundayClosed !== false;

  const handleContactSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const response = await postRequest(`${AUTH.CONTACT}`, payload);
      if (response?.status === 201) {
        reset();
        toast.success("Success! We’ve received your request");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-no-translate>
      <div className="pt-32 pb-12 md:pb-24 md:pt-36 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-we-green/10 rounded-full mb-4"
            >
              <Mail className="w-5 h-5 text-we-green" />
              <span className="text-sm font-medium text-we-green">Nous sommes là pour vous</span>
            </motion.div>
            <h1 className="text-size-4xl font-semibold mb-3 bg-gradient-to-r from-we-green to-emerald-600 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre projet
            </p>
          </motion.div>
        </div>

        <section className="pt-9 section-padding-y">
          <div className="container-1180">
            <div className="flex gap-8 flex-wrap lg:flex-nowrap">
              {/* Left: Enquiry form */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="w-full lg:w-2/3"
              >
                <form
                  onSubmit={handleSubmit(handleContactSubmit)}
                  className="contact-wrapper bg-white rounded-2xl p-9 space-y-5 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-we-green/10 rounded-full flex items-center justify-center">
                      <Send className="w-6 h-6 text-we-green" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        Demande de renseignements
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Notre équipe est à votre disposition pour vous accompagner
                    dans l’organisation de votre événement.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                      <InputGroup
                        label={`Nom`}
                        placeholder={`Saisissez votre nom`}
                        inputProps={register("name")}
                        error={errors.name}
                      />
                    </div>
                    <div className="w-full">
                      <InputGroup
                        type="email"
                        label={`Email`}
                        inputProps={register("email")}
                        error={errors.email}
                        placeholder={`Saisissez votre email`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                      <InputGroup
                        type="tel"
                        label={`Numéro de téléphone`}
                        placeholder={`Saisissez votre numéro de téléphone`}
                        inputProps={register("phone")}
                        error={errors.phone}
                      />
                    </div>
                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label={`Adresse`}
                        placeholder={`Saisissez votre adresse`}
                        inputProps={register("address")}
                        error={errors.address}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <InputGroup
                      type="textarea"
                      label={`Message`}
                      placeholder={`Message`}
                      inputProps={register("message")}
                      error={errors.message}
                      className="bg-white h-40 border border-gray-300 p-3 w-full resize-none rounded-md outline-none focus:border-we-green"
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      loading={loading}
                      type="submit"
                      variant="primary"
                      size="large"
                      className="relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Envoyer
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-we-green transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Button>
                  </div>
                </form>
              </motion.div>

              <div className="w-full lg:w-1/3 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-we-green/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5 text-we-green" />
                    </div>
                    <h4 className="text-2xl font-semibold">Contactez-nous</h4>
                  </div>
                  <div className="space-y-4">
                    {email && (
                      <motion.a
                        whileHover={{ x: 5 }}
                        href={`mailto:${email}`}
                        className="flex items-start gap-3 hover:text-we-green transition-colors duration-300 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <Mail size={18} className="flex-shrink-0 mt-1" />
                        <span className="text-base leading-4">{email}</span>
                      </motion.a>
                    )}

                    {email && (
                      <motion.a
                        whileHover={{ x: 5 }}
                        href="mailto:jeff@we-event.eu"
                        className="flex items-start gap-3 hover:text-we-green transition-colors duration-300 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <Mail size={18} className="flex-shrink-0 mt-1" />
                        <span className="text-base leading-4">
                          jeff@we-event.eu
                        </span>
                      </motion.a>
                    )}

                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                    >
                      <MapPin size={20} className="flex-shrink-0 mt-1 text-we-green" />
                      <span className="text-base leading-4">
                        93 Avenue du Général de Gaulle 83300 Draguignan
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h4 className="text-2xl font-semibold mb-4">
                    Horaires d’ouverture
                  </h4>
                  <div className="space-y-2">
                    <p>Lundi – Vendredi : 9h00 – 18h00</p>
                    <p>Samedi : 10h00 – 16h00</p>
                    <p>Dimanche : fermé</p>
                  </div>
                </motion.div>
                <div></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs by language */}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="section-padding-y pt-0"
        >
          <div className="container-1180">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                viewport={{ once: false }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-we-green/10 rounded-full mb-4"
              >
                <HelpCircle className="w-5 h-5 text-we-green" />
                <span className="text-sm font-medium text-we-green">Questions fréquentes</span>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-we-green to-emerald-600 bg-clip-text text-transparent">
                Tout ce que vous devez savoir
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Trouvez rapidement les réponses à vos questions les plus courantes
              </p>
            </div>
            <Accordion />
          </div>
        </motion.section>

        {/* Map section */}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="container-1180">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                viewport={{ once: false }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-we-green/10 rounded-full mb-4"
              >
                <MapPin className="w-5 h-5 text-we-green" />
                <span className="text-sm font-medium text-we-green">Nous trouver</span>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-we-green to-emerald-600 bg-clip-text text-transparent">
                Notre Bureau sur la Carte
              </h2>
              <p className="text-gray-600 mt-4">
                Venez nous rendre visite à notre bureau de Draguignan
              </p>
            </div>
            <motion.div 
              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <OfficeMap />
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;
