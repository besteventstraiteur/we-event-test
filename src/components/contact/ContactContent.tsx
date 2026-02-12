import React from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactContent = () => {
  const { t } = useLanguage();

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-we-green">
          Contactez-nous
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Notre équipe est à votre disposition pour vous accompagner dans
          l'organisation de votre événement
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-we-green">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </div>
          </div>

          <div>
            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-6 text-we-green">
                Nos coordonnées
              </h2>
              <ContactInfo />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-we-green">
                Suivez-nous
              </h2>
              <SocialLinks />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
              <h2 className="text-xl font-semibold mb-4 text-we-green">
                Ouvert du
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Lundi au Vendredi : de 9h00 à 18h00</p>
                <p>Samedi: 10h00 - 17h00</p>
                <p>Et le Samedi : de 10h00 à 16h00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center text-we-green">
            Questions fréquentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">
                Comment fonctionne We Event ?
              </h3>
              <p className="text-gray-600">
                We Event est une plateforme qui met en relation les
                organisateurs d'événements avec des prestataires professionnels.
                Nous simplifions la planification de votre événement.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">
                Quels types d'événements gérez-vous ?
              </h3>
              <p className="text-gray-600">
                Nous accompagnons l'organisation de tous types d'événements :
                mariages, anniversaires, séminaires d'entreprise, conférences,
                et plus encore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactContent;
