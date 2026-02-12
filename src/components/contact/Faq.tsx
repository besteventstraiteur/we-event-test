import React, { useState } from "react";
import { Search, ChevronDown, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AccordionStatic() {
  const faqs = [
    {
      question: "Qu'est-ce que We Event exactement ?",
      answer: `
        <p>We Event est une plateforme digitale innovante qui révolutionne l'organisation d'événements en France et en Europe.</p>
        <br/>
        <p>Nous mettons en relation les particuliers et les entreprises avec des professionnels de l'événementiel qualifiés, tout en offrant des outils de gestion complets pour planifier chaque détail de A à Z.</p>
        <p><strong>Notre mission :</strong> rendre l'organisation d'événements accessible, transparente et sans stress.</p>
      `,
      category: "about"
    },
    {
      question: "We Event est-elle faite pour moi ?",
      answer: `
        <p>We Event s'adresse à deux types d'utilisateurs :</p>
        <br/>
        <p><strong>Les organisateurs d'événements (particuliers et entreprises) :</strong></p>
        <p>Mariages, anniversaires, séminaires, événements d'entreprise, baptêmes, fêtes... Vous cherchez à organiser un événement de manière simple et professionnelle.</p>
        <br/>
        <p><strong>Les professionnels de l'événementiel :</strong></p>
        <p>Traiteurs, photographes, DJ, décorateurs, loueurs de matériel, salles de réception... Vous souhaitez développer votre activité et trouver de nouveaux clients facilement.</p>
      `,
      category: "about"
    },
    {
      question: "Quels types d'événements puis-je organiser avec We Event ?",
      answer: `
        <p><strong>Tous types d'événements !</strong></p>
        <br/>
        <p>Mariages, anniversaires, baptêmes, communions, événements d'entreprise (séminaires, team building, lancements de produits), soirées privées, festivals, galas, conférences...</p>
        <br/>
        <p>Que votre événement rassemble 20 ou 2000 personnes, We Event vous accompagne avec les bons outils et les bons professionnels.</p>
      `,
      category: "services"
    },
    {
      question: "Comment We Event se différencie des autres plateformes ?",
      answer: `
        <p><strong>Une approche tout-en-un unique</strong></p>
        <br/>
        <p>Contrairement aux annuaires classiques, We Event combine :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Un espace de gestion complet (budget, invités, plan de table, timeline)</li>
          <li>Un marketplace de prestataires vérifiés avec avis clients</li>
          <li>Un système de réservation et paiement sécurisé intégré</li>
          <li>Des outils CRM professionnels pour les prestataires</li>
        </ul>
        <br/>
        <p>Tout est centralisé : plus besoin de jongler entre 10 applications différentes !</p>
      `,
      category: "services"
    },
    {
      question: "Dois-je payer pour utiliser We Event en tant qu'organisateur ?",
      answer: `
        <p><strong>L'inscription est gratuite pour les organisateurs !</strong></p>
        <br/>
        <p>Créer votre compte, explorer les prestataires, utiliser les outils de planification de base est entièrement gratuit.</p>
        <p>Vous ne payez que lorsque vous réservez des prestations via la plateforme, avec une transparence totale sur les tarifs.</p>
        <br/>
        <p>Des options premium peuvent être disponibles pour accéder à des fonctionnalités avancées (gestion d'invités illimitée, plans de table personnalisés...).</p>
      `,
      category: "paiement"
    },
    {
      question: "Les prestataires sur We Event sont-ils vérifiés ?",
      answer: `
        <p><strong>Oui, tous nos professionnels sont sélectionnés avec soin</strong></p>
        <br/>
        <p>Chaque prestataire sur We Event :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Est vérifié (documents professionnels, assurances)</li>
          <li>Dispose d'un portfolio avec photos et vidéos de ses réalisations</li>
          <li>Reçoit des avis clients authentiques après chaque prestation</li>
          <li>S'engage sur une charte qualité</li>
        </ul>
        <br/>
        <p>Vous réservez en toute confiance !</p>
      `,
      category: "prestataire"
    },
    {
      question: "Comment puis-je contacter un prestataire ?",
      answer: `
        <p><strong>Contactez directement via la plateforme</strong></p>
        <br/>
        <p>Sur chaque profil prestataire, vous pouvez :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Envoyer un message instantané</li>
          <li>Demander un devis personnalisé</li>
          <li>Programmer un rendez-vous téléphonique ou visio</li>
          <li>Comparer plusieurs propositions côte à côte</li>
        </ul>
        <br/>
        <p>Toutes vos conversations sont centralisées dans votre tableau de bord.</p>
      `,
      category: "services"
    },
    {
      question: "Comment fonctionne la tarification pour les professionnels ?",
      answer: `
        <p><strong>Des abonnements flexibles et rentables</strong></p>
        <br/>
        <p>Les professionnels choisissent parmi nos formules d'abonnement (12, 24 ou 36 mois) qui leur donnent accès à :</p>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Un profil professionnel complet avec portfolio</li>
          <li>Un CRM pour gérer clients et devis</li>
          <li>De la visibilité auprès de milliers d'organisateurs</li>
          <li>Des statistiques de performance</li>
          <li>Un système de facturation intégré</li>
        </ul>
        <br/>
        <p><strong>Pas de commission sur les ventes : votre abonnement, c'est tout !</strong></p>
      `,
      category: "paiement"
    },
    {
      question: "Existe-t-il une application mobile ?",
      answer: `
        <p><strong>Bientôt disponible !</strong></p>
        <br/>
        <p>Nous travaillons actuellement sur nos applications iOS et Android pour vous permettre de gérer vos événements en mobilité.</p>
        <p>En attendant, notre site web est entièrement responsive et s'adapte parfaitement à votre smartphone ou tablette.</p>
      `,
      category: "services"
    },
    {
      question: "We Event est-elle disponible dans toute la France ?",
      answer: `
        <p><strong>Oui, et même au-delà !</strong></p>
        <br/>
        <p>We Event couvre l'ensemble du territoire français et s'étend progressivement en Europe.</p>
        <p>Notre réseau de prestataires est présent dans toutes les régions.</p>
        <p>Où que vous organisiez votre événement, nous avons les professionnels qu'il vous faut.</p>
      `,
      category: "services"
    },
    {
      question: "Proposez-vous une assistance pour m'aider à démarrer ?",
      answer: `
        <p><strong>Nous vous accompagnons à chaque étape</strong></p>
        <br/>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Tutoriels vidéo pour découvrir la plateforme</li>
          <li>Guide pas-à-pas pour votre premier événement</li>
          <li>Support client réactif par email et téléphone</li>
          <li>FAQ complète avec réponses aux questions courantes</li>
          <li>Webinaires pour les professionnels</li>
        </ul>
        <br/>
        <p>Vous n'êtes jamais seul avec We Event !</p>
      `,
      category: "support"
    },
    {
      question: "Comment rester informé des nouveautés We Event ?",
      answer: `
        <p><strong>Rejoignez notre communauté !</strong></p>
        <br/>
        <ul style="list-style: disc; margin-left: 20px;">
          <li>Inscrivez-vous à notre newsletter pour recevoir conseils, tendances et offres exclusives</li>
          <li>Suivez-nous sur les réseaux sociaux (Facebook, Instagram, LinkedIn)</li>
          <li>Consultez notre blog avec des articles inspirants sur l'organisation d'événements</li>
        </ul>
      `,
      category: "support"
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
    about: "from-indigo-500 to-blue-500",
    services: "from-blue-500 to-cyan-500",
    prestataire: "from-purple-500 to-pink-500",
    paiement: "from-green-500 to-emerald-500",
    support: "from-yellow-500 to-orange-500",
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
