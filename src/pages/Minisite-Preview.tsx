import { Calendar, Clock, Coins, Heart, LocateIcon } from "lucide-react";
import { motion } from "motion/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { PROVIDER } from "../utils/endPoints";
import { useToast } from "../utils/toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "../components/ui/Button";
import InputGroup from "../components/ui-main/InputGroup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const MiniSitePreview = () => {
  const { slug } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestbookSchema = yup.object().shape({
    name: yup.string().required("Le nom est obligatoire"),
    message: yup.string().required("Le message est obligatoire"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(guestbookSchema),
  });
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");

  const fetchSite = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (type === "draft") {
        params.append("version", "draft");
      }

      const url =
        params.toString().length > 0
          ? `${PROVIDER.SITE}/${slug}?${params.toString()}`
          : `${PROVIDER.SITE}/${slug}`;

      const res = await getRequest(url);

      const data = res?.data?.data || null;

      if (!data) {
        navigate("/404", { replace: true });
        return;
      }

      if (type === "draft" && data?.isPublished === true) {
        navigate(`/${slug}`, { replace: true });
        return;
      }

      setSite(data);
    } catch {
      navigate("/404", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchSite();
  }, [slug]);

  const pageData = site?.version?.pageData;
  const coverImage = pageData?.coverImage || "";
  const title = pageData?.title || "Event Title";

  const heroContent =
    pageData?.sections?.find((s: any) => s.type === "hero")?.content ||
    "Welcome to our event!";

  const aboutRaw =
    pageData?.sections?.find((s: any) => s.type === "about")?.content || "";
  let aboutAddress = "";
  try {
    const parsed = JSON.parse(aboutRaw);
    aboutAddress = parsed?.address || "";
  } catch {
    aboutAddress = aboutRaw;
  }
  const eventLink = pageData?.link || "";
  const moneyPoolLink = pageData?.moneyPoolLink || "";

  const program =
    pageData?.sections?.find((s: any) => s.type === "program")?.content || [];

  const settings = pageData?.settings || {
    publish: true,
    guestbook: true,
    gallery: true,
  };

  const eventId = site?.eventId;

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        eventId: Number(eventId),
        name: values.name.trim(),
        message: values.message.trim(),
      };

      await postRequest(`${PROVIDER.GUESTBOOK}`, payload);
      toast.success("Message submitted successfully 🎉");
      reset();
    } catch {
      toast.error("Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen container-1180 py-16">
        <Skeleton height={400} borderRadius={10} />
        <Skeleton height={200} className="mt-5" borderRadius={10} />
        <Skeleton height={200} className="mt-5" borderRadius={10} />
      </div>
    );

  return (
    <div className="min-h-screen">
      <section
        className="site-hero relative  min-h-[70vh] py-5 flex justify-center items-center before:content-[''] before:absolute before:w-full before:h-full
        before:bg-black/50 before:top-0 before:left-0"
        style={{
          backgroundImage: `url("${encodeURI(coverImage)}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="w-full lg:max-w-2/4 mx-auto relative z-10 text-center"
        >
          <h1 className="text-white leading-snug text-2xl sm:text-4xl md:text-6xl capitalize font-bold">
            {title}
          </h1>
          <p className="text-white mt-4 text-lg font-light max-w-2xl mx-auto">
            {heroContent}
          </p>
          <div className="flex justify-center mt-10 gap-5 flex-wrap">
            {program.length > 0 && (
              <a href="#program">
                <span className="flex gap-2 items-center bg-white px-6 py-3 rounded-lg transition-all hover:bg-secondary hover:text-white">
                  <Calendar size={18} /> Programme
                </span>
              </a>
            )}
            {settings?.guestbook && (
              <a href="#guest">
                <span className="flex gap-2 items-center bg-secondary text-white px-6 py-3 rounded-lg transition-all hover:bg-tertiary hover:text-white">
                  <Heart size={18} /> Livre d'or
                </span>
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {program.length > 0 && (
        <section className="section-padding-y bg-[#F9F8FE]" id="program">
          <div className="container-1180">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-7"
              >
                Programme du jour
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-gray-600 md:text-xl"
              >
                Le programme de cette merveilleuse journée.
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {program.map((step: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 border border-inputborder rounded-lg transition-all duration-300 bg-white hover:bg-gray-50 p-6"
                >
                  <span className="text-gray-500 bg-gray-200 w-12 h-12 flex justify-center items-center rounded-lg">
                    <Clock size={24} className="text-gray-500" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-semibold uppercase mb-0">
                      {step.time}
                    </h3>
                    <p className="text-gray-600">{step.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="section-padding-y bg-white"
        id="practical-information"
      >
        <div className="container-1180">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-7"
            >
              Informations pratiques
            </motion.h2>
          </div>

          <div className="flex justify-between items-center gap-4 border border-inputborder rounded-lg bg-white p-5 md:p-10 flex-wrap">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <span className="text-gray-500 bg-gray-200 w-12 h-12 flex justify-center items-center rounded-lg shrink-0">
                <LocateIcon size={24} className="text-gray-500" />
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xl font-semibold uppercase mb-0">
                  Event Location
                </h3>
                <p className="text-gray-600 m-0 text-sm">{aboutAddress}</p>
                {eventLink && (
                  <a
                    href={
                      eventLink.startsWith("http")
                        ? eventLink
                        : `https://${eventLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" underline text-sm mt-1"
                  >
                    {eventLink}
                  </a>
                )}
              </div>
            </div>
            {aboutAddress && (
              <Button
                size="medium"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      aboutAddress
                    )}`,
                    "_blank"
                  )
                }
              >
                Voir sur la carte
              </Button>
            )}
          </div>

          <div className="mt-5 flex justify-between items-center gap-4 border border-inputborder rounded-lg bg-white p-5 md:p-10 flex-wrap">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <span className="text-gray-500 bg-gray-200 w-12 h-12 flex justify-center items-center rounded-lg shrink-0">
                <Coins size={24} className="text-gray-500" />
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xl font-semibold uppercase mb-0">
                  Money Pool
                </h3>
                <p className="text-gray-600 m-0 text-sm">
                  Cliquez sur le lien pour accéder à la cagnotte de l'événement
                </p>
              </div>
            </div>
            {moneyPoolLink && (
              <a
                href={
                  moneyPoolLink.startsWith("http")
                    ? moneyPoolLink
                    : `https://${moneyPoolLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-base rounded-lg text-center transition-all duration-300 ease-in-out button border border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                Voir
              </a>
            )}
          </div>
          {/* {moneyPoolLink && (
            <div className="border border-borderlight rounded-lg bg-white p-5 md:p-10 mt-5">
              <h3 className="text-xl font-semibold capitalize mb-0">
                Money Pool
              </h3>
              {moneyPoolLink && (
                <a
                  href={
                    moneyPoolLink.startsWith("http")
                      ? moneyPoolLink
                      : `https://${moneyPoolLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" underline text-sm mt-1"
                >
                  {eventLink}
                </a>
              )}
            </div>
          )} */}
        </div>
      </section>

      {settings?.guestbook && (
        <section className="section-padding-y bg-[#F9F8FE]" id="guest">
          <div className="container-1180">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-7"
              >
                Livre d’or
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-gray-600 md:text-xl"
              >
                Soyez le premier à laisser un message !
              </motion.p>
            </div>

            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow">
              <h3 className="text-2xl font-bold mb-5 capitalize">
                Laissez-nous un message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                <InputGroup
                  type="text"
                  label="Nom"
                  placeholder="Entrez votre nom"
                  inputProps={register("name")}
                  error={errors.name}
                />
                </div>

                <div>
                <InputGroup
                  type="textarea"
                  label="Message"
                  placeholder="Écrivez votre message"
                  inputProps={register("message")}
                  error={errors.message}
                />
                </div>
                <Button
                  size="large"
                  className="!normal-case w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Laisser un message"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MiniSitePreview;
