import React, { useState } from "react";
import { Search, ChevronDown, Sparkles, HelpCircle } from "lucide-react";
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
      category: "client"
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
      category: "prestataire"
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
      category: "paiement"
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
      category: "securite"
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

  const categoryColors: Record<string, string> = {
    client: "from-blue-500 to-cyan-500",
    prestataire: "from-purple-500 to-pink-500",
    paiement: "from-green-500 to-emerald-500",
    securite: "from-orange-500 to-red-500",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Bar with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-we-green to-emerald-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            
            <input
              type="text"
              placeholder="Rechercher dans les questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
            />

            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Stats */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center text-sm text-gray-500"
            >
              {filteredFaqs.length} résultat{filteredFaqs.length > 1 ? 's' : ''} trouvé{filteredFaqs.length > 1 ? 's' : ''}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FAQ Items */}
      <AnimatePresence mode="popLayout">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, idx) => {
            const open = activeIndex === idx;
            const gradientColor = categoryColors[item.category] || "from-gray-500 to-gray-600";

            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group"
              >
                <div className="relative">
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                  
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                    {/* Header Button */}
                    <motion.button
                      type="button"
                      onClick={() => toggle(idx)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Icon with Gradient */}
                        <motion.div
                          animate={{
                            rotate: open ? 360 : 0,
                            scale: open ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 shadow-lg`}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>

                        {/* Question Text */}
                        <span className={`text-lg font-semibold transition-colors duration-200 ${
                          open ? 'text-we-green' : 'text-gray-900'
                        }`}>
                          {item.question}
                        </span>
                      </div>

                      {/* Chevron Icon */}
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          open ? 'text-we-green' : 'text-gray-400'
                        }`}
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </motion.button>

                    {/* Content with Animation */}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            exit={{ y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 pb-6 pt-2"
                          >
                            {/* Separator Line with Gradient */}
                            <div className={`h-1 w-16 bg-gradient-to-r ${gradientColor} rounded-full mb-4`} />
                            
                            {/* Answer Content */}
                            <div
                              className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <HelpCircle className="w-12 h-12 text-gray-400" />
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucune question trouvée</h3>
            <p className="text-gray-500 mb-6">Essayez une autre recherche ou contactez-nous directement</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-gradient-to-r from-we-green to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Réinitialiser la recherche
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
