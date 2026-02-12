import { useEffect, useState } from "react";
import SignatureBlockPreview from "./SignatureBlock";
import { TemplateData } from "./template";
import { useRef } from "react";

interface TemplatePreviewProps {
  data: TemplateData;
  setBlockSettings: (id: string, updater: any) => void;
}

const DocumentPreview = ({ data, setBlockSettings }: TemplatePreviewProps) => {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  if (!data) return null;

  const [activePageIndex, setActivePageIndex] = useState(0);

  const { blocks, blockSettings, globalStyle, companyInfo, pages } = data;
  const primaryColor = globalStyle?.colors?.primary || "#111827";

  const secondaryColor = globalStyle?.colors?.secondary || "#F3F4F6";
  const [zoom, setZoom] = useState(0.9);

  const safePages = Array.isArray(pages)
    ? pages
    : pages && typeof pages === "object"
      ? Object.values(pages)
      : [];

  const clampedPageIndex = Math.min(
    activePageIndex,
    Math.max(safePages.length - 1, 0),
  );

  const renderBlock = (id: string) => {
    const raw = blockSettings[id] || {};
    const settings = raw.data || {};
    const blockKey = raw.blockKey;

    switch (blockKey) {
      case "stubborn-header": {
        return (
          <div
            className="relative"
            style={{
              backgroundImage: globalStyle.coverUrl
                ? `url(${globalStyle.coverUrl})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-start gap-6 relative z-10 bg-white p-4 rounded-lg">
              {settings.showLogo && settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="h-20 w-auto object-contain rounded"
                />
              )}

              {settings.showCompany && (
                <div className="text-sm leading-5">
                  <div className="font-semibold text-gray-900 capitalize">
                    {companyInfo.name}
                  </div>
                  <div className="text-gray-700">
                    {companyInfo.addressLine1}
                  </div>
                  <div className="text-gray-700">
                    {companyInfo.postalCode} {companyInfo.city}
                  </div>
                </div>
              )}

              {/* TITLE + SUBTITLE */}
              <div className="ml-auto w-64 text-right">
                <div className="font-bold text-2xl text-gray-900 capitalize">
                  {settings.title || "DEVIS"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {settings.subtitle || "Proposition commerciale"}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "cover-page": {
        const files = settings.files || [];

        return (
          <div className="border border-borderlight overflow-hidden rounded-lg">
            <div className="bg-white w-full">
              <div className="rounded-lg p-5 bg-white">
                <div className="text-lg font-semibold mb-1">
                  Page de garde personnalisée
                </div>

                {/* COUNT */}
                <div className="text-sm text-gray-600 mb-4">
                  {files.length} PDF ajouté(s) • Ces pages seront intégrées au
                  début du document final
                </div>

                {/* PDF LIST */}
                <div className="space-y-3">
                  {files.map((file: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border border-blue-200 rounded-lg px-4 py-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-red-500 text-xl">📕</div>

                        <div>
                          <div className="text-sm font-medium text-gray-80 capitalize">
                            {file?.name || "PDF"}
                          </div>
                          <div className="text-gray-600">
                            {(file?.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>

                      {/* VIEW LINK */}
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "client-info": {
        const { title, content } = settings;

        return (
          <div
            data-no-translate
            className="bg-white rounded-lg p-4 border border-borderlight"
          >
            {/* HEADER BAR */}
            <div className="bg-blue-50 font-semibold text-lg px-4 py-2 rounded mb-4">
              {title || "Adresse de facturation"}
            </div>

            {/* CONTENT */}
            <div className="text-sm leading-6 whitespace-pre-line text-gray-800  px-1">
              {content ||
                `{{client.companydsd}}
{{client.name}}
{{client.address}}
{{client.zip}} {{client.city}}`}
            </div>
          </div>
        );
      }

      case "document-object": {
        const title = settings.title || "Objet";
        const value = settings.value || "{{doc.subject}}";

        return (
          <div
            data-no-translate
            className="border border-borderlight rounded-lg p-4 bg-white"
          >
            <div className="text-sm">
              <span className="font-semibold text-lg">{title}:</span>
              <span className="ml-2 text-gray-600">{value}</span>
            </div>
          </div>
        );
      }

      case "event-date": {
        const s = settings;

        const alignClass =
          s.align === "center"
            ? "text-center"
            : s.align === "right"
              ? "text-right"
              : "text-left";

        const variantClasses: any = {
          h1: "text-2xl font-bold mb-2",
          h2: "text-xl font-semibold mb-2",
          h3: "text-lg font-medium mb-2",
          p: "text-base mb-2",
        };

        const variantClass = variantClasses[s.variant] || variantClasses.p;

        let formattedDate = "";
        if (s.date) {
          const d = new Date(s.date);
          formattedDate = d.toLocaleDateString("fr-FR");
        }

        const text =
          formattedDate && s.location
            ? `${formattedDate} à ${s.location}`
            : formattedDate || s.location || "";

        if (!text) return null;

        return (
          <div className="border border-borderlight p-4 rounded-lg bg-white">
            <div className={alignClass}>
              <div className={variantClass}>{text}</div>
            </div>
          </div>
        );
      }

      case "image-block": {
        const s = settings || {};
        const images = s.images || [];

        if (!images.length) return null;

        const layoutClassMap: Record<string, string> = {
          "grid-2": "grid grid-cols-2 gap-6",
          "grid-3": "grid grid-cols-3 gap-6",
          "hero-left": "grid grid-cols-[2fr_1fr] gap-6",
          "hero-right": "grid grid-cols-[1fr_2fr] gap-6",
          masonry: "columns-2 gap-6 space-y-6",
        };

        const gridClass =
          layoutClassMap[s.layout] || "flex flex-col items-center gap-6";

        const sizeClassMap: Record<string, string> = {
          small: "w-32 h-32",
          medium: "w-48 h-48",
          large: "w-72 h-72",
          full: "w-full h-auto",
        };

        const sizeClass = sizeClassMap[s.size || "medium"];

        return (
          <div className="p-4 border border-borderlight bg-white rounded-lg">
            <div className={gridClass}>
              {images.map((img: any, i: number) => {
                const isHero =
                  s.layout === "hero-left"
                    ? i === 0
                    : s.layout === "hero-right"
                      ? i === images.length - 1
                      : false;

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center ${
                      isHero ? "row-span-2" : ""
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || ""}
                      className={`
                  rounded-lg object-cover
                  ${s.layout === "masonry" ? "mb-4 w-full" : sizeClass}
                  ${isHero ? "h-full min-h-[260px]" : ""}
                `}
                    />

                    {img.caption && (
                      <div
                        className="text-xs text-gray-600 italic mt-2 text-center"
                        dangerouslySetInnerHTML={{ __html: img.caption }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case "article-table": {
        const table = settings || { sections: [] };

        const formatEuro = (num: number) =>
          num.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + " €";

        return (
          <div className="p-4 border border-borderlight bg-white rounded-lg">
            {/* HEADER */}
            <div
              className="hidden lg:grid grid-cols-7 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-md"
              style={{ backgroundColor: primaryColor }}
            >
              <div>Produit</div>
              <div>Description</div>
              <div>Qté</div>
              <div>Unité</div>
              <div>P.U. HT</div>
              <div>Remise %</div>
              <div className="text-right">Total HT</div>
            </div>

            {(table.sections || []).map((section: any) => {
              let sectionSubtotal = 0;

              return (
                <div key={section.id} className="mt-4">
                  {/* SECTION TITLE */}
                  <div className="font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded">
                    {section.title}
                  </div>

                  {/* ITEMS */}
                  {(section.items || []).map((item: any) => {
                    const qty = Number(item.qty) || 0;
                    const price = Number(item.price) || 0;
                    const discount = Number(item.discount) || 0;

                    const lineTotal = qty * price * (1 - discount / 100);
                    sectionSubtotal += lineTotal;

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 lg:grid-cols-7 gap-2 px-3 py-3 border-b border-borderlight text-sm items-center"
                      >
                        {/* PRODUCT */}
                        <div className="flex flex-col gap-1 aspect-video">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-800">
                              {item.name}
                            </div>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="text-gray-700">
                          {item.description}
                        </div>

                        <div>{qty}</div>
                        <div>{item.unit}</div>
                        <div>{formatEuro(price)}</div>
                        <div>{discount}%</div>

                        <div className="text-right font-medium">
                          {formatEuro(lineTotal)}
                        </div>
                      </div>
                    );
                  })}

                  {/* SECTION SUBTOTAL */}
                  <div className="text-right font-semibold text-gray-800 py-2 pr-3 border-t border-borderlight bg-white">
                    Sous-total {section.title} : {formatEuro(sectionSubtotal)}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      case "totals-block": {
        const vat = settings.vat ?? 20;
        const down = settings.downPayment ?? 0;

        const articleTableBlock = Object.values(blockSettings).find(
          (b: any) => b.blockKey === "article-table",
        );

        const sections = articleTableBlock?.data?.sections || [];

        let totalHT = 0;

        sections.forEach((section: any) => {
          (section.items || []).forEach((item: any) => {
            const qty = Number(item.qty) || 0;
            const price = Number(item.price) || 0;
            const discount = Number(item.discount) || 0;

            totalHT += qty * price * (1 - discount / 100);
          });
        });

        const tvaAmount = totalHT * (vat / 100);
        const totalTTC = totalHT + tvaAmount;
        const acompteAmount = totalTTC * (down / 100);
        return (
          <div className="p-4 border border-borderlight rounded-lg  bg-white">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total HT</span>
                <span>{totalHT.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between">
                <span>TVA</span>
                <span>{tvaAmount.toFixed(2)} €</span>
              </div>

              <hr className="my-2 border-borderlight" />

              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span>{totalTTC.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between mt-2">
                <span>Acompte ({down}%)</span>
                <span>{acompteAmount.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        );
      }

      case "banking-info": {
        const s = settings || {};

        return (
          <div>
            {/* TITLE */}
            {s.title && (
              <h3 className="font-semibold text-lg mb-3">{s.title}</h3>
            )}

            {/* CONTENT BOX */}
            <div className="bg-white p-4 rounded-md text-sm space-y-2 border border-borderlight">
              {s.bankName && (
                <p>
                  <strong>Banque :</strong> {s.bankName}
                </p>
              )}

              {s.accountHolder && (
                <p>
                  <strong>Titulaire :</strong> {s.accountHolder}
                </p>
              )}

              {s.iban && (
                <p>
                  <strong>IBAN :</strong> {s.iban}
                </p>
              )}

              {s.bic && (
                <p>
                  <strong>BIC/SWIFT :</strong> {s.bic}
                </p>
              )}

              {s.conditions && (
                <p className="pt-2 border-t border-borderlight">
                  <strong>Conditions de paiement :</strong> {s.conditions}
                </p>
              )}
            </div>
          </div>
        );
      }

      case "terms-cgv": {
        const s = settings || {};
        if (!s.title && !s.content) return null;

        return (
          <div className="p-4 border border-borderlight rounded-lg bg-white">
            {s.title && (
              <h3 className="font-semibold text-gray-700 text-sm mb-3 border-b border-borderlight pb-2">
                {s.title}
              </h3>
            )}

            {s.content && (
              <div className="text-sm text-gray-700 leading-relaxed">
                {s.content}
              </div>
            )}
          </div>
        );
      }

      case "signature-block": {
        return (
          <SignatureBlockPreview
            blockId={id}
            settings={settings}
            setBlockSettings={setBlockSettings}
          />
        );
      }

      case "footer-block": {
        const s = settings || {};
        const showCompany = s.showCompanyInfo ?? false;
        const showLegal = s.showLegalNotice ?? false;
        const customText = s.customText || "";

        const ci = companyInfo;

        return (
          <div className="p-4 border border-borderlight rounded-lg bg-white">
            <div className="text-center text-sm text-gray-700 dark:text-neutral-300 space-y-2">
              {/* COMPANY COORDINATES */}
              {showCompany && (
                <div className="leading-5">
                  <div className="font-semibold">{ci.name}</div>

                  <div>
                    {ci.addressLine1}, {ci.postalCode} {ci.city}
                  </div>

                  {/* Only show if provided */}
                  {(ci.phone || ci.email) && (
                    <div>
                      {ci.phone ? `Tél: ${ci.phone}` : ""}
                      {ci.phone && ci.email ? " | " : ""}
                      {ci.email ? `Email: ${ci.email}` : ""}
                    </div>
                  )}

                  {ci.siret && <div>SIRET : {ci.siret}</div>}
                  {ci.website && <div>Site : {ci.website}</div>}
                </div>
              )}

              {/* LEGAL MENTIONS */}
              {showLegal && (
                <div className="italic text-gray-600">
                  Mentions légales obligatoires…
                </div>
              )}

              {/* CUSTOM TEXT */}
              {customText && (
                <div className="text-gray-800">
                  {customText}
                </div>
              )}
            </div>
          </div>
        );
      }
      case "slide-title":
        return (
          <div className="border border-borderlight rounded-lg p-4 bg-white">
            <div
              className="text-base text-gray-600"
              dangerouslySetInnerHTML={{ __html: settings.text || "" }}
            />
          </div>
        );
      case "slide-subtitle":
        return (
          <div className="border border-borderlight p-4 bg-white">
            <div
              className="text-base text-gray-600"
              dangerouslySetInnerHTML={{ __html: settings.text || "" }}
            />
          </div>
        );

      case "slide-text":
        return (
          <div className="border border-borderlight rounded-lg p-4 bg-white">
            <div
              className="text-base text-gray-600"
              dangerouslySetInnerHTML={{ __html: settings.text || "" }}
            />
          </div>
        );
      case "slide-two-column":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg">
            <div
              className="bg-white p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: settings.left || "" }}
            />
            <div
              className="bg-white p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: settings.right || "" }}
            />
          </div>
        );

      case "slide-image": {
        const images = settings.images || [];

        if (!images.length) return null;

        const gridClass =
          settings.layout === "2"
            ? "grid grid-cols-2 gap-6 border border-borderlight"
            : settings.layout === "3"
              ? "grid grid-cols-3 gap-6 border-borderlight"
              : "flex flex-col items-center gap-6";

        return (
          <div className={`p-4 ${gridClass}`}>
            {images.map((img: any, i: number) => (
              <>
              <div key={i} className="flex flex-col items-center aspect-video overflow-hidden rounded-lg">
                <img
                  src={img.url}
                  alt={img.caption || ""}
                  className="rounded-lg w-full h-full object-cover"
                />
                
              </div>
              {img.caption && (
                  <div className="text-xs text-gray-500 mt-2 italic">
                    {img.caption}
                  </div>
                )}
                </>
            ))}
          </div>
        );
      }

      case "slide-gallery":
        return (
          <div className="grid grid-cols-2 gap-4 p-4 border border-borderlight rounded-lg">
            {(settings.images || []).map((img: any, i: number) => (
              <img key={i} src={img.url} className="rounded" />
            ))}
          </div>
        );

      default:
        return null;
    }
  };
  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  const currentPage = safePages[clampedPageIndex];

  const blocksToRender = (currentPage?.blocks || blocks || []).filter(
    (id: string) => blockSettings[id]?.blockKey,
  );

  const isPaginated =
    safePages.length > 1 ||
    (safePages.length === 1 && safePages[0]?.blocks?.length > 0);

  useEffect(() => {
    if (!globalStyle?.typography) return;

    const fonts = [
      globalStyle.typography.titleFont,
      globalStyle.typography.textFont,
    ].filter(Boolean);

    fonts.forEach((font) => {
      const id = `font-${font}`;
      if (document.getElementById(id)) return;

      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        / /g,
        "+",
      )}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    });
  }, [globalStyle]);

  useEffect(() => {
    if (safePages.length === 0) {
      setActivePageIndex(0);
      return;
    }

    if (activePageIndex >= safePages.length) {
      setActivePageIndex(0);
    }
  }, [safePages.length]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(1.5, Math.max(0.5, z - e.deltaY * 0.001)));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  const PAGE_SIZES: any = {
    A4: { w: 794, h: 1123 },
    LETTER: { w: 816, h: 1056 },
  };

  const pageSize = PAGE_SIZES[globalStyle?.pageSize || "A4"] || PAGE_SIZES.A4;

  const PAGE_WIDTH = pageSize.w;
  const PAGE_HEIGHT = pageSize.h;
  return (
    <div className="p-4">
    <div
      data-no-translate
      className="w-full max-w-6xl mx-auto relative p-5 md:p-10 rounded-2xl bg-white"
      style={{
        fontFamily: globalStyle.typography?.textFont || "Inter",
        color: "#1F2937",
      }}
    >
      

      {/* ZOOM CONTROLS */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-28 overflow-y-auto max-h-[75vh] pr-2 shrink-0">
          <div className="space-y-4">
            {safePages.map((page, index) => {
              const bg = page.background || {};
              const isActive = index === activePageIndex;

              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setActivePageIndex(index);
                    pageRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`relative w-full border rounded-md overflow-hidden transition
              ${
                isActive
                  ? "border-blue-500 ring-2 ring-blue-400"
                  : "border-gray-300"
              }`}
                >
                  <div
                    className="aspect-[3/4] bg-white"
                    style={{
                      backgroundImage: bg.image
                        ? `url(${bg.image})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN DOCUMENT */}
        <div className="flex-1">
          <div
            // style={{
            //   transform: `scale(${zoom})`,
            //   transformOrigin: "top center",
            // }}
          >
            {safePages.map((page, pageIndex) => {
              const bg = page.background || {};

              return (
                <div
                  key={page.id}
                  ref={(el) => (pageRefs.current[pageIndex] = el)}
                  className="flex flex-col items-center"
                >
                  <div
                    className="relative bg-white !h-auto p-6 break-words [@media(min-width:320px)_and_(max-width:1023px)]:!w-full"
                    style={{
                      width: PAGE_WIDTH,
                      height: PAGE_HEIGHT,
                      backgroundImage: bg.image
                        ? `url(${bg.image})`
                        : undefined,
                      backgroundSize: bg.size || "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {bg.overlayOpacity > 0 && (
                      <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: bg.overlayOpacity }}
                      />
                    )}

                    <div className="relative space-y-6">
                      {(page.blocks || []).map((blockId: string) => {
                        if (!blockSettings[blockId]) return null;
                        return <div key={blockId}>{renderBlock(blockId)}</div>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DocumentPreview;
