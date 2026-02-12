import {
  Calendar,
  CreditCard,
  File,
  FilePenLine,
  FileText,
  FileUp,
  GitCommit,
  Grid2X2,
  Hash,
  Image,
  PenLine,
  Scale,
  Star,
  User,
} from "lucide-react";
import { useDraggable, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";

interface TemplateLibraryProps {
  onSelectBlock?: (key: string) => void;
  structure?: "basic" | "articles" | "presentation";
}

type LibraryItem = {
  key: string;
  icon: any;
  title: string;
  desc: string;
};

const DraggableLibraryItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${item.key}`,
    data: {
      type: "library-block",
      blockKey: item.key,
      title: item.title,
      icon: item.icon,
    },
  });

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-white dark:bg-neutral-800 border border-borderlight dark:border-neutral-700 p-4 rounded-lg flex gap-3
        cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-40" : ""}`}
    >
      <Icon size={20} className="text-gray-600 dark:text-neutral-300 shrink-0" />
      <div>
        <div className="text-sm dark:text-neutral-100">{item.title}</div>
        <div className="text-xs text-gray-500 dark:text-neutral-400">{item.desc}</div>
      </div>
    </div>
  );
};

const TemplateLibrary = ({
  onSelectBlock,
  structure,
}: TemplateLibraryProps) => {
  const slideBlocks = [
    {
      key: "slide-title",
      icon: FileText,
      title: "Titre",
      desc: "Grand titre (comme Google Slides)",
    },
    // {
    //   key: "slide-subtitle",
    //   icon: PenLine,
    //   title: "Sous-titre",
    //   desc: "Texte du sous-titre",
    // },
    {
      key: "slide-text",
      icon: PenLine,
      title: "Texte",
      desc: "Paragraphe ou liste à puces",
    },
    {
      key: "slide-image",
      icon: Image,
      title: "Image",
      desc: "Bloc de contenu image",
    },
    {
      key: "slide-two-column",
      icon: GitCommit,
      title: "Deux colonnes",
      desc: "Mise en page en 2 colonnes (texte / image)",
    },
  ];

  const aestheticBlocks = [
    {
      key: "hero-image",
      icon: Image,
      title: "Image de couverture",
      desc: "Image de couverture pleine page",
    },
    // {
    //   key: "big-title",
    //   icon: FileText,
    //   title: "Big title",
    //   desc: "Large decorative title",
    // },
    // {
    //   key: "image-gallery",
    //   icon: Image,
    //   title: "Image gallery",
    //   desc: "Grid of images",
    // },
    // {
    //   key: "testimonials",
    //   icon: User,
    //   title: "Testimonials",
    //   desc: "Client quotes",
    // },
    // {
    //   key: "features",
    //   icon: Star,
    //   title: "Features",
    //   desc: "What you offer (icons + text)",
    // },
  ];

  const libraryItems = [
    {
      key: "stubborn-header",
      icon: FileText,
      title: "En-tête",
      desc: "Titre, logo, infos et coordonnées",
    },
    {
      key: "cover-page",
      icon: FileUp,
      title: "Pièce jointe pdf",
      desc: "Ajouter vos documents pdf en pièce jointe du document",
    },
    {
      key: "client-info",
      icon: User,
      title: "Infos client",
      desc: "Adresse client / facturation",
    },
    {
      key: "document-object",
      icon: PenLine,
      title: "Objet",
      desc: "Ligne d’objet du document",
    },
    {
      key: "event-date",
      icon: Calendar,
      title: "Date de l’événement",
      desc: "Affiche la date de l’événement du client",
    },
    // {
    //   key: "image-block",
    //   icon: Image,
    //   title: "Image",
    //   desc: "Add one or more images",
    // },
    {
      key: "article-table",
      icon: Hash,
      title: "Tableau des articles",
      desc: "Corps principal du devis / de la facture",
    },
    {
      key: "totals-block",
      icon: File,
      title: "Total",
      desc: "Bloc de calcul du total (hors taxes, TVA, TTC)",
    },
    {
      key: "banking-info",
      icon: CreditCard,
      title: "Informations bancaires",
      desc: "IBAN, RIB, coordonnées bancaires",
    },
    {
      key: "terms-cgv",
      icon: Scale,
      title: "CGV",
      desc: "Conditions Générales de Vente",
    },
    {
      key: "signature-block",
      icon: FilePenLine,
      title: "Signature",
      desc: "Zone de signature pour accord",
    },
    {
      key: "footer-block",
      icon: GitCommit,
      title: "Pied de page",
      desc: "Mentions légales, informations de l’entreprise",
    },
  ];

  const presentationBlocks = [
    {
      key: "presentation-cover",
      icon: Image,
      title: "Cover (Brochure)",
      desc: "Hero cover with title & subtitle",
    },
    {
      key: "presentation-gallery",
      icon: Grid2X2,
      title: "Image Gallery",
      desc: "Mosaic / grid image section",
    },
    {
      key: "presentation-testimonials",
      icon: User,
      title: "Testimonials",
      desc: "Customer reviews cards",
    },
    {
      key: "presentation-features",
      icon: Hash,
      title: "What we offer",
      desc: "Icon + text feature list",
    },
    {
      key: "presentation-legal",
      icon: Scale,
      title: "Legal / CGV",
      desc: "Long legal text section",
    },
  ];

// const allItems =
//   structure === "presentation"
//     ? presentationBlocks
//     : [...libraryItems, ...slideBlocks]

  const allItems = [...libraryItems, ...slideBlocks, ...aestheticBlocks];
  // const allItems =
  //   structure === "basic"
  //     ? [...aestheticBlocks, ...slideBlocks]
  //     : [...libraryItems, ...slideBlocks];

  return (
    <div>
      <div className="bg-white dark:bg-neutral-800 text-center p-3 border-b border-gray-200 dark:border-neutral-700">
        <span className="text-lg dark:text-neutral-100">Bibliothèque</span>
      </div>
      <div className="space-y-2 max-h-[72dvh] overflow-y-auto pt-4">
        {/* {allItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-darkmode hover:bg-lightbg border border-gray-200 dark:border-gray-600 p-4 rounded-lg flex items-start gap-3 cursor-pointer"
              onClick={() => onSelectBlock && onSelectBlock(item.key)}
            >
              <Icon size={20} className="text-gray-600 shrink-0" />
              <div className="flex-1">
                <span className="text-sm block dark:text-gray-600">
                  {item.title}
                </span>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            </div>
          );
        })} */}

        {allItems.map((item) => (
          <DraggableLibraryItem
            key={item.key}
            item={item}
            onSelectBlock={onSelectBlock}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
