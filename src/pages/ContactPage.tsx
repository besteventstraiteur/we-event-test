import { Mail, MapPin } from "lucide-react";
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
      <div className="pt-32 pb-12 md:pb-24 md:pt-36">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-size-4xl text-center font-semibold"
          >
            Contactez-nous
          </motion.h1>
        </div>

        <section className="pt-9 section-padding-y">
          <div className="container-1180">
            <div className="flex gap-8 flex-wrap lg:flex-nowrap">
              {/* Left: Enquiry form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="w-full lg:w-2/3"
              >
                <form
                  onSubmit={handleSubmit(handleContactSubmit)}
                  className="contact-wrapper bg-white rounded-2xl p-9 space-y-5 shadow-sm"
                >
                  <h2 className="text-3xl font-semibold mb-2">
                    Demande de renseignements
                  </h2>
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
                    >
                      Envoyer
                    </Button>
                  </div>
                </form>
              </motion.div>

              <div className="w-full lg:w-1/3 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h4 className="text-2xl font-semibold mb-4">
                    Contactez-nous
                  </h4>
                  <div className="space-y-4">
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="flex items-start gap-2 hover:text-tertiary"
                      >
                        <Mail size={18} className="flex-shrink-0" />
                        <span className="text-base leading-4">{email}</span>
                      </a>
                    )}

                    {email && (
                      <a
                        href="mailto:jeff@we-event.eu"
                        className="flex items-start gap-2 hover:text-tertiary"
                      >
                        <Mail size={18} className="flex-shrink-0" />
                        <span className="text-base leading-4">
                          jeff@we-event.eu
                        </span>
                      </a>
                    )}

                    {/* {phone && (
                      <a href={`tel:${phone}`} className="flex gap-2 group">
                        <PhoneCall className="text-we-green" />
                        <span className="font-inter transition-all duration-300 group-hover:text-we-green">
                          {phone}
                        </span>
                      </a>
                    )} */}

                    {/* {address && (
                      <div className="flex gap-2">
                        <MapPin size={20} className="flex-shrink-0" />
                        <span>{address}</span>
                      </div>
                    )} */}
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="flex-shrink-0" />
                      <span className="text-base leading-4">
                        93 Avenue du Général de Gaulle 83300 Draguignan
                      </span>
                    </div>
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
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-10">
                Faqs
              </h2>
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
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-10">
                Notre Bureau sur la Carte
              </h2>
              <div className="rounded-3xl overflow-hidden">
                <OfficeMap />
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;
