import React from "react";
import HomeHeader from "../components/Header";
import Footer from "../components/Footer";

type Section = {
  key: string;
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    key: "acceptation",
    title: "1. Acceptation des conditions",
    paragraphs: [
      "En accédant au service We Event et en l’utilisant, vous acceptez d’être lié par les présentes Conditions d’utilisation. Si vous n’acceptez pas l’ensemble des conditions, vous ne pouvez pas accéder au service ni l’utiliser.",
    ],
  },
  {
    key: "service",
    title: "2. Description du service",
    paragraphs: [
      "We Event est une plateforme exclusive mettant en relation des clients VIP avec des partenaires événementiels professionnels. Le service comprend l’accès à un réseau sélectionné de partenaires, des conseils d’experts via des podcasts exclusifs, ainsi que des tarifs préférentiels pour les membres.",
      "Le service est disponible pour les utilisateurs inscrits en tant que clients VIP (gratuit) ou partenaires (abonnement payant).",
    ],
  },
  {
    key: "account",
    title: "3. Inscription et compte",
    paragraphs: [
      "Pour utiliser le service, vous devez créer un compte avec des informations complètes et exactes. Vous êtes responsable de la confidentialité de votre mot de passe ainsi que de toutes les activités effectuées depuis votre compte.",
      "Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.",
    ],
  },
  {
    key: "subscription",
    title: "4. Abonnement partenaire",
    paragraphs: [
      "L’abonnement partenaire est facturé annuellement ou mensuellement. Le prix de l’abonnement est clairement indiqué avant la confirmation de l’inscription.",
      "Renouvellement automatique : votre abonnement sera automatiquement renouvelé à la fin de chaque période, sauf en cas de résiliation avant la date de renouvellement.",
      "Résiliation : vous pouvez résilier votre abonnement à tout moment en faisant la demande depuis votre compte. La résiliation prendra effet à la fin de la période d’abonnement en cours.",
    ],
  },
  {
    key: "serviceContent",
    title: "5. Contenu du service",
    paragraphs: [
      "Le contenu accessible via le service, y compris les podcasts, textes, graphiques, logos, images et vidéos, est la propriété de We Event ou de ses concédants de licence et est protégé par les lois sur la propriété intellectuelle.",
      "Vous ne pouvez pas modifier, publier, transmettre, participer au transfert ou à la vente, créer des œuvres dérivées ou exploiter de quelque manière que ce soit tout contenu du service sans notre accord écrit préalable.",
    ],
  },
  {
    key: "userContent",
    title: "6. Contenu utilisateur",
    paragraphs: [
      "En soumettant du contenu sur notre plateforme (podcasts, descriptions, messages), vous nous accordez une licence mondiale, non exclusive et gratuite nous permettant d’utiliser, de reproduire, de modifier, d’adapter, de publier, de traduire et de distribuer ce contenu.",
      "Vous garantissez que le contenu que vous soumettez ne porte pas atteinte aux droits de tiers, y compris aux droits de propriété intellectuelle, et qu’il n’est pas illégal, obscène, diffamatoire ou autrement répréhensible.",
    ],
  },
  {
    key: "matchmaking",
    title: "7. Mise en relation",
    paragraphs: [
      "We Event agit uniquement en tant qu’intermédiaire entre les clients et les partenaires. Nous ne sommes pas responsables des prestations fournies par les partenaires et n’offrons aucune garantie quant à leur qualité.",
      "Tout contrat de prestation de services est conclu directement entre le client et le partenaire, et We Event n’est pas partie à ce contrat.",
    ],
  },
  {
    key: "liability",
    title: "8. Limitation de responsabilité",
    paragraphs: [
      "Dans toute la mesure permise par la loi applicable, We Event ne pourra être tenu responsable d’aucun dommage indirect, spécial, accessoire, consécutif ou punitif, y compris toute perte de profit ou de chiffre d’affaires, résultant de votre utilisation du service ou de l’impossibilité de l’utiliser.",
    ],
  },
  {
    key: "changes",
    title: "9. Modifications des conditions",
    paragraphs: [
      "Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les modifications prendront effet dès leur publication sur notre site web. Il vous appartient de consulter régulièrement nos conditions.",
    ],
  },
  {
    key: "law",
    title: "10. Droit applicable",
    paragraphs: [
      "Les présentes conditions sont régies par le droit US et interprétées conformément à celui-ci, sans égard aux règles de conflit de lois.",
    ],
  },
  {
    key: "contact",
    title: "11. Contact",
    paragraphs: [
      "Pour toute question relative aux présentes conditions, veuillez nous contacter à l’adresse suivante : robin@we-event.eu",
    ],
  },
];

const TermsPage: React.FC = () => {
  return (
    <>
      <HomeHeader />

       <div className="pt-32 pb-12 md:pb-24 md:pt-36">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-vip-black">
            Conditions d’utilisation
          </h1>

          <div className="space-y-8 text-vip-gray-600">
            {sections.map((s) => (
              <div key={s.key}>
                <h2 className="text-xl font-semibold text-vip-gold mb-4">
                  {s.title}
                </h2>

                {s.paragraphs.map((text, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {text}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsPage;
