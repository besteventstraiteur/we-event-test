import React, { useState } from "react";

export default function AccordionStatic() {
  const faqs = [
    {
      question: "Quels sont les avantages concrets pour un client ?",
      answer: `
        <p>Organiser un événement n’a jamais été aussi simple !</p>
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
      question: "Et pour les prestataires, qu’est-ce que j’y gagne ?",
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

  const toggle = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div className="space-y-6 max-w-[768px] mx-auto">
      {faqs.map((item, idx) => {
        const open = activeIndex === idx;

        return (
          <div
            key={idx}
            className="border rounded-xl shadow-sm overflow-hidden w-full"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center px-5 py-4 text-left bg-[#FBFCFD] hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-xl font-medium">
                {item.question}
              </span>
              <span className="text-2xl">{open ? "−" : "+"}</span>
            </button>

            {/* Content */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className="px-5 py-4 text-gray-600 border-t bg-[#FBFCFD] font-inter"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
