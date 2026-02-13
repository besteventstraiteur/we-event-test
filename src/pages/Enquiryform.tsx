import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputGroup from "../components/ui-main/InputGroup";
import Button from "../components/ui/Button";
import { RESPONSE_CODE } from "../utils/constants";
import { ADMIN, AUTH } from "../utils/endPoints";
import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { useToast } from "../utils/toast";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";


type ContactPageContent = {
  shared?: SharedContent;
  en?: LangContent;
  es?: LangContent;
  fr?: LangContent;
};
// This type correctly represents the object at `response.data.content`
type ContactPageApi = {
  id?: string;
  slug: string;
  title?: string;
  content: ContactPageContent; // The actual content is nested here
};

// ---------------- Utils ----------------
const to12h = (hhmm?: string) => {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

// ---------------- Validation ----------------
const schema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  email: yup
    .string()
    .email("Email invalide")
    .required("L’email est requis")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Veuillez saisir une adresse email valide"
    ),
  phone: yup.string().required("Le numéro de téléphone est requis"),
  address: yup.string(),
  message: yup.string(),
});

// ---------------- Component ----------------
const Enquiry = () => {
  
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

        // The actual content (en, es, shared) is in a *second* `content` object.
        if (data) {
          setPage(data);
        }
      } catch (e) {
        // Silently handle API errors - app works with default content
        if (import.meta.env.DEV) {
          console.debug('API not available - using default content');
        }
      }
    };
    fetchContent();
  }, []);


  const handleContactSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const response = await postRequest(`${AUTH.CONTACT}`, payload);
      if (response?.status === 201) {
        reset();
        toast.success("Succès ! Nous avons bien reçu votre demande");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Échec de l’envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Left: Enquiry form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="w-full"
      >
        <form
          onSubmit={handleSubmit(handleContactSubmit)}
          className="contact-wrapper bg-white rounded-2xl p-4 md:p-6 space-y-5 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="w-full">
              <InputGroup
                label="Nom*"
                placeholder={`Saisissez votre nom`}
                inputProps={register("name")}
                error={errors.name}
                className="bg-white"
              />
            </div>
            <div className="w-full">
              <InputGroup
                type="email"
                label="Email*"
                inputProps={register("email")}
                error={errors.email}
                placeholder={`Saisissez votre email`}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="w-full">
              <InputGroup
                type="tel"
                label="Numéro de téléphone*"
                placeholder={`Saisissez votre numéro de téléphone`}
                inputProps={register("phone")}
                error={errors.phone}
                className="bg-white"
              />
            </div>
            <div className="w-full">
              <InputGroup
                type="text"
                label="Adresse"
                placeholder={`Saisissez votre adresse`}
                inputProps={register("address")}
                error={errors.address}
                className="bg-white"
              />
            </div>
          </div>
          <div className="w-full">
            <InputGroup
              type="textarea"
              label={`Message`}
              placeholder="Tapez votre message ici…"
              inputProps={register("message")}
              error={errors.message}
              className="bg-white h-28 border border-gray-300 p-3 w-full resize-none rounded-md font-inter outline-none focus:border-we-green"
            />
          </div>
          <div className="text-center">
            <Button
              loading={loading}
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
            >
              Envoyer le message
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Enquiry;
