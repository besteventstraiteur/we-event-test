import React from "react";
import HomeHeader from "../components/Header";
import Footer from "../components/Footer";

type Section = {
  key: string;
  title: string;
  paragraphs?: string[];
  listItems?: string[];
};

const sections: Section[] = [
  {
    key: "intro",
    title: "1. Introduction",
    paragraphs: [
      "La présente Politique de confidentialité décrit la manière dont We Event collecte, utilise et protège les informations personnelles que vous fournissez lors de l’utilisation de notre service.",
      "Nous nous engageons à protéger votre vie privée. Si nous vous demandons de fournir certaines informations permettant de vous identifier lors de l’utilisation de notre service, vous pouvez être assuré(e) qu’elles ne seront utilisées que conformément à la présente déclaration de confidentialité.",
    ],
  },
  {
    key: "collection",
    title: "2. Collecte des informations",
    paragraphs: ["Nous pouvons collecter les informations suivantes :"],
    listItems: [
      "Prénom et nom",
      "Coordonnées, y compris adresse e-mail et numéro de téléphone",
      "Informations démographiques telles que l’adresse postale",
      "Informations professionnelles (pour les partenaires)",
      "Toute autre information pertinente pour des enquêtes clients et/ou des offres",
    ],
  },
  {
    key: "usage",
    title: "3. Utilisation des informations",
    paragraphs: [
      "Nous utilisons ces informations pour comprendre vos besoins et vous fournir un meilleur service, notamment pour les raisons suivantes :",
    ],
    listItems: [
      "Tenue de dossiers internes",
      "Amélioration de nos produits et services",
      "Envoi périodique d’e-mails promotionnels concernant de nouveaux produits, des offres spéciales ou d’autres informations susceptibles de vous intéresser",
      "Prise de contact à des fins d’études de marché",
      "Personnalisation de notre site web en fonction de vos centres d’intérêt",
    ],
  },
  {
    key: "security",
    title: "4. Sécurité",
    paragraphs: [
      "Nous nous engageons à assurer la sécurité de vos informations. Afin de prévenir tout accès ou divulgation non autorisé, nous avons mis en place des procédures physiques, électroniques et de gestion appropriées pour sauvegarder et sécuriser les données que nous collectons en ligne.",
    ],
  },
  {
    key: "cookies",
    title: "5. Cookies",
    paragraphs: [
      "Un cookie est un petit fichier qui demande l’autorisation d’être placé sur le disque dur de votre ordinateur. Une fois que vous acceptez, le fichier est ajouté et le cookie aide à analyser le trafic web ou vous signale lorsque vous visitez un site particulier.",
      "Nous utilisons des cookies de trafic pour identifier les pages utilisées. Cela nous aide à analyser les données relatives aux pages web et à améliorer notre site afin de l’adapter aux besoins des clients. Nous n’utilisons ces informations qu’à des fins d’analyse statistique, puis les données sont supprimées du système.",
    ],
  },
  {
    key: "links",
    title: "6. Liens vers d’autres sites web",
    paragraphs: [
      "Notre site web peut contenir des liens vers d’autres sites susceptibles de vous intéresser. Toutefois, une fois que vous avez utilisé ces liens pour quitter notre site, vous devez noter que nous n’exerçons aucun contrôle sur ces autres sites.",
      "Nous ne pouvons être tenus responsables de la protection et de la confidentialité des informations que vous fournissez lors de la visite de ces sites, qui ne sont pas régis par la présente politique de confidentialité. Vous devez consulter la politique de confidentialité applicable au site en question.",
    ],
  },
  {
    key: "control",
    title: "7. Contrôle de vos informations personnelles",
    paragraphs: [
      "Vous pouvez choisir de limiter la collecte ou l’utilisation de vos informations personnelles de la manière suivante :",
    ],
    listItems: [
      "Si vous avez précédemment accepté que nous utilisions vos informations personnelles à des fins de marketing direct, vous pouvez changer d’avis à tout moment en nous contactant via notre formulaire de contact.",
    ],
  },
  {
    key: "contact",
    title: "8. Contact",
    paragraphs: [
      "Pour toute question concernant la présente politique ou pour exercer vos droits en matière de protection des données, veuillez nous contacter à l’adresse e-mail suivante : robin@weevent.eu",
    ],
  },
  {
    key: "updates",
    title: "9. Mises à jour",
    paragraphs: [
      "La présente politique de confidentialité a été mise à jour le 1er janvier 2023. Nous nous réservons le droit de la modifier à tout moment. Les modifications prendront effet dès leur publication sur cette page.",
    ],
  },
];

const PrivacyPage: React.FC = () => {
  return (
    <>
      <HomeHeader />

      <div className="pt-32 pb-12 md:pb-24 md:pt-36">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-vip-black">
            Politique de confidentialité
          </h1>

          <div className="space-y-10 text-vip-gray-700">
            {sections.map((s) => (
              <div key={s.key}>
                <h2 className="text-xl font-semibold text-vip-gold mb-4">
                  {s.title}
                </h2>

                {s.paragraphs?.map((p, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {p}
                  </p>
                ))}

                {s.listItems && (
                  <ul className="list-disc pl-6 space-y-2">
                    {s.listItems.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPage;
