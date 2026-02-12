import React, { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AccordionStatic() {
  const faqs = [
    {
      question: "Quels sont les avantages concrets pour un client ?",
      answer: `
        <p>Organiser un événement n'a jamais été aussi simple !</p>
        <br/>
        <p>Avec votre tableau de bord personnel, vous pouvez :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Inviter vos invités et suivre leurs réponses RSVP,</li>
          <li>Construire votre plan de table en quelques clics,</li>
          <li>Gérer votre budget en temps réel,</li>
          <li>Comparer et réserver des prestataires de confiance,</li>
        </ul>
      `,
    },
    {
      question: "Et pour les prestataires, qu'est-ce que j'y gagne ?",
      answer: `
        <p>Avec We Event, vous accédez à un puissant CRM dédié aux événements :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Centralisez vos contacts et vos propositions,</li>
          <li>Suivez vos factures et paiements,</li>
          <li>Mettez en valeur votre portfolio avec photos et vidéos,</li>
          <li>Obtenez des statistiques intelligentes sur vos performances,</li>
          <li>Gagnez en visibilité auprès de centaines de nouveaux clients.</li>
        </ul>
      `,
    },
    {
      question: "Comment fonctionnent les abonnements et les paiements ?",
      answer: `
        <p>Tout est pensé pour la simplicité et la transparence.</p>
        <br/>
        <p>Nos abonnements sont disponibles pour 12, 24 ou 36 mois à des tarifs attractifs.</p>
        <p>Les paiements peuvent être effectués par virement bancaire, carte de crédit ou prélèvement SEPA sécurisé.</p>
        <p>Vous recevez automatiquement vos factures, et toutes les transactions passent par Stripe, le leader mondial des solutions de paiement en ligne.</p>
      `,
    },
    {
      question: "Mes données sont-elles en sécurité avec We Event ?",
      answer: `
        <p>Absolument. La confidentialité et la sécurité sont nos priorités.</p>
        <br/>
        <p>Toutes vos données sont cryptées et hébergées de manière sécurisée.</p>
        <p>Nous respectons les normes internationales (RGPD en Europe, CCPA aux États-Unis).</p>
        <p>Et surtout : vos informations vous appartiennent — nous ne les partageons jamais avec des tiers sans votre consentement.</p>
      `,
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? -1 : idx));
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[768px] mx-auto">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher dans les questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-we-green/50 focus:border-we-green transition-all duration-300"
        />
      </motion.div>

      {/* FAQ Items */}
      <AnimatePresence mode="popLayout">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, idx) => {
            const open = activeIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="border rounded-xl shadow-sm overflow-hidden w-full hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <motion.button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left bg-white hover:bg-gray-50 cursor-pointer group transition-colors duration-300"
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      open ? 'bg-we-green text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-we-green/10 group-hover:text-we-green'
                    }`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className={`text-lg font-medium transition-colors duration-300 ${
                      open ? 'text-we-green' : 'text-gray-900'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 ${open ? 'text-we-green' : 'text-gray-400'}`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </motion.button>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 py-5 text-gray-600 border-t bg-gray-50 font-inter"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune question trouvée</p>
            <p className="text-gray-400 text-sm mt-2">Essayez une autre recherche</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
