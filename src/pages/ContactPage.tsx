import { Mail, MapPin, Phone, Clock, Send, Sparkles, MessageCircle, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Check } from "lucide-react";
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
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
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

// Define the content structure
type ContactPageContent = {
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: {
    weekdays?: { start?: string; end?: string };
    saturday?: { start?: string; end?: string };
    sundayClosed?: boolean;
  };
  faqs?: FAQItem[];
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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Enquiry form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const formValues = watch();

  // Steps configuration
  const steps = [
    { 
      id: 1, 
      title: "Informations personnelles", 
      icon: "👤",
      fields: ["name", "email"]
    },
    { 
      id: 2, 
      title: "Contact", 
      icon: "📞",
      fields: ["phone", "address"]
    },
    { 
      id: 3, 
      title: "Votre message", 
      icon: "✉️",
      fields: ["message"]
    },
    { 
      id: 4, 
      title: "Confirmation", 
      icon: "✓",
      fields: []
    },
  ];

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Calculate step completion
  const isStepComplete = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    return step.fields.every(field => {
      const value = formValues[field as keyof typeof formValues];
      return value && value.toString().trim() !== "";
    });
  };

  const canProceedToNextStep = () => {
    return isStepComplete(currentStep);
  };

  const handleNextStep = async () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return;

    // Validate current step fields
    const isValid = await trigger(step.fields as any);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fetch contact-page by slug once
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Only fetch if BASEURL is configured
        if (!ADMIN.PAGES || ADMIN.PAGES === 'undefined/pages') {
          console.warn('API endpoint not configured - using default values');
          return;
        }
        const resp = await getRequest(`${ADMIN.PAGES}/6`);
        const data = resp?.data?.data as ContactPageApi | undefined;
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

  const handleContactSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const response = await postRequest(`${AUTH.CONTACT}`, payload);
      if (response?.status === 201) {
        reset();
        setCurrentStep(1);
        toast.success("Success! We've received your request");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@we-event.eu",
      link: "mailto:contact@we-event.eu",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 4 XX XX XX XX",
      link: "tel:+33400000000",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "93 Avenue du Général de Gaulle, 83300 Draguignan",
      link: "#map",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div data-no-translate className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section with Parallax */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-we-green/20 to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6"
            >
              <Sparkles className="w-5 h-5 text-we-green" />
              <span className="text-sm font-semibold text-gray-700">Parlons de votre projet</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
              Contactez-nous
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Notre équipe passionnée est prête à transformer votre événement en<br />
              <span className="font-semibold text-we-green">une expérience inoubliable</span>
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { icon: MessageCircle, label: "Réponse", value: "< 24h" },
                { icon: Calendar, label: "Disponibilité", value: "7j/7" },
                { icon: CheckCircle2, label: "Satisfaction", value: "98%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-we-green to-emerald-500 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Methods Cards */}
      <section className="py-12 -mt-8">
        <div className="container-1180">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{method.value}</p>
                
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-we-green to-emerald-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container-1180">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
                {/* Steps Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center flex-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center flex-1"
                        >
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                              currentStep === step.id
                                ? "bg-gradient-to-br from-we-green to-emerald-500 text-white shadow-lg scale-110"
                                : currentStep > step.id
                                ? "bg-we-green text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {currentStep > step.id ? (
                              <Check className="w-6 h-6" />
                            ) : (
                              <span>{step.icon}</span>
                            )}
                          </motion.div>
                          <p className={`text-xs mt-2 text-center font-medium ${
                            currentStep === step.id ? "text-we-green" : "text-gray-500"
                          }`}>
                            {step.title}
                          </p>
                        </motion.div>
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-1 bg-gray-200 mx-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-we-green"
                              initial={{ width: 0 }}
                              animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-we-green to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Étape {currentStep} sur {totalSteps}</span>
                      <span>{Math.round(progressPercentage)}% complété</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Parlez-nous de vous
                        </h3>
                        
                        <motion.div
                          animate={{
                            scale: focusedField === "name" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputGroup
                            label="Nom complet"
                            placeholder="Jean Dupont"
                            inputProps={{
                              ...register("name"),
                              onFocus: () => setFocusedField("name"),
                              onBlur: () => setFocusedField(null),
                            }}
                            error={errors.name}
                          />
                        </motion.div>

                        <motion.div
                          animate={{
                            scale: focusedField === "email" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputGroup
                            type="email"
                            label="Adresse email"
                            placeholder="jean.dupont@example.com"
                            inputProps={{
                              ...register("email"),
                              onFocus: () => setFocusedField("email"),
                              onBlur: () => setFocusedField(null),
                            }}
                            error={errors.email}
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Step 2: Contact Information */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Comment vous joindre ?
                        </h3>
                        
                        <motion.div
                          animate={{
                            scale: focusedField === "phone" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputGroup
                            type="tel"
                            label="Téléphone"
                            placeholder="+33 6 XX XX XX XX"
                            inputProps={{
                              ...register("phone"),
                              onFocus: () => setFocusedField("phone"),
                              onBlur: () => setFocusedField(null),
                            }}
                            error={errors.phone}
                          />
                        </motion.div>

                        <motion.div
                          animate={{
                            scale: focusedField === "address" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputGroup
                            type="text"
                            label="Adresse (optionnel)"
                            placeholder="Votre adresse"
                            inputProps={{
                              ...register("address"),
                              onFocus: () => setFocusedField("address"),
                              onBlur: () => setFocusedField(null),
                            }}
                            error={errors.address}
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Step 3: Message */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Votre message
                        </h3>
                        
                        <motion.div
                          animate={{
                            scale: focusedField === "message" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InputGroup
                            type="textarea"
                            label="Décrivez votre projet"
                            placeholder="Parlez-nous de votre événement..."
                            inputProps={{
                              ...register("message"),
                              onFocus: () => setFocusedField("message"),
                              onBlur: () => setFocusedField(null),
                            }}
                            error={errors.message}
                            className="bg-white h-48 border border-gray-300 p-3 w-full resize-none rounded-md outline-none focus:border-we-green"
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Récapitulatif
                        </h3>
                        
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                          <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-1">Nom</p>
                            <p className="text-lg font-semibold text-gray-900">{formValues.name}</p>
                          </div>
                          
                          <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="text-lg font-semibold text-gray-900">{formValues.email}</p>
                          </div>
                          
                          <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                            <p className="text-lg font-semibold text-gray-900">{formValues.phone}</p>
                          </div>
                          
                          {formValues.address && (
                            <div className="border-b border-gray-200 pb-4">
                              <p className="text-sm text-gray-500 mb-1">Adresse</p>
                              <p className="text-lg font-semibold text-gray-900">{formValues.address}</p>
                            </div>
                          )}
                          
                          {formValues.message && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Message</p>
                              <p className="text-gray-900">{formValues.message}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-6">
                    {currentStep > 1 && currentStep < 4 && (
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Précédent
                      </motion.button>
                    )}

                    {currentStep < 3 && (
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!canProceedToNextStep()}
                        whileHover={{ scale: canProceedToNextStep() ? 1.02 : 1 }}
                        whileTap={{ scale: canProceedToNextStep() ? 0.98 : 1 }}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          canProceedToNextStep()
                            ? "bg-gradient-to-r from-we-green to-emerald-600 hover:from-emerald-600 hover:to-we-green text-white shadow-lg"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Suivant
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}

                    {currentStep === 3 && (
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!canProceedToNextStep()}
                        whileHover={{ scale: canProceedToNextStep() ? 1.02 : 1 }}
                        whileTap={{ scale: canProceedToNextStep() ? 0.98 : 1 }}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          canProceedToNextStep()
                            ? "bg-gradient-to-r from-we-green to-emerald-600 hover:from-emerald-600 hover:to-we-green text-white shadow-lg"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Voir le récapitulatif
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}

                    {currentStep === 4 && (
                      <>
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Modifier
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 px-6 bg-gradient-to-r from-we-green to-emerald-600 hover:from-emerald-600 hover:to-we-green text-white rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Envoyer le message
                            </>
                          )}
                        </motion.button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Info Sidebar - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Opening Hours Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-we-green/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-we-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Horaires</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { day: "Lundi - Vendredi", hours: "9h00 - 18h00", open: true },
                    { day: "Samedi", hours: "10h00 - 16h00", open: true },
                    { day: "Dimanche", hours: "Fermé", open: false },
                  ].map((schedule, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                    >
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className={`font-bold ${schedule.open ? 'text-we-green' : 'text-red-500'}`}>
                        {schedule.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations rapides</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email principal</p>
                      <a href="mailto:contact@we-event.eu" className="text-gray-900 font-medium hover:text-we-green transition-colors">
                        contact@we-event.eu
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email commercial</p>
                      <a href="mailto:jeff@we-event.eu" className="text-gray-900 font-medium hover:text-we-green transition-colors">
                        jeff@we-event.eu
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="text-gray-900 font-medium">
                        93 Avenue du Général de Gaulle<br />
                        83300 Draguignan, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-1180">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-we-green/10 rounded-full mb-4"
            >
              <MessageCircle className="w-5 h-5 text-we-green" />
              <span className="text-sm font-medium text-we-green">FAQ</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Questions fréquentes
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions
            </p>
          </motion.div>

          <Accordion />
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container-1180">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-we-green/10 rounded-full mb-4"
            >
              <MapPin className="w-5 h-5 text-we-green" />
              <span className="text-sm font-medium text-we-green">Localisation</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Venez nous rencontrer
            </h2>
            <p className="text-gray-600 text-lg">
              Notre bureau à Draguignan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            id="map"
          >
            <OfficeMap />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
