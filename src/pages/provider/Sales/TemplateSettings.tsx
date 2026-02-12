import { Building, Grid2X2, Image, Palette, TypeIcon } from "lucide-react";
import InputGroup from "../../../components/ui-main/InputGroup";
import Globaltabs from "./Globaltabs";
import { useState } from "react";
import FileDropzone from "../../../components/imageUpload";
import { uploadFile } from "../../../utils/uploadfile";

type BlockSetting = {
  blockKey: string;
  data: any;
};

interface TemplateSettingsProps {
  selectedBlock: { id: string; key: string } | null;

  templateSettings: {
    coverUrl?: string | null;
  };

  companyInfo: {
    name: string;
    addressLine1: string;
    postalCode: string;
    city: string;
  };

  setTemplateSettings: React.Dispatch<any>;

  onCompanyInfoChange: (
    key: keyof TemplateSettingsProps["companyInfo"],
    value: string,
  ) => void;

  blockSettings: Record<string, BlockSetting>;
  // updater works on **data** only
  setBlockSettings: (id: string, updater: any) => void;
}

const TemplateSettings = ({
  selectedBlock,
  templateSettings,
  setTemplateSettings,
  companyInfo,
  onCompanyInfoChange,
  blockSettings,
  activePage,
  setPages,
  setBlockSettings,
}: TemplateSettingsProps) => {
  const [colors, setColors] = useState({
    main: "#f59e0b",
    secondary: "#3b82f6",
    accent: "#10b981",
  });

  const FONT_OPTIONS = [
    "Inter",
    "Playfair Display",
    "Montserrat",
    "Roboto",
    "Lato",
    "Open Sans",
  ];
  const handleFontChange = (key: "titleFont" | "textFont", value: string) => {
    setTemplateSettings((prev: any) => ({
      ...prev,
      typography: {
        ...(prev.typography || {}),
        [key]: value,
      },
    }));
  };
  const handleColorChange = (key: "primary" | "secondary", value: string) => {
    setTemplateSettings((prev: any) => ({
      ...prev,
      colors: {
        ...(prev.colors || {}),
        [key]: value,
      },
    }));
  };
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [coverFiles, setCoverFiles] = useState<File[]>([]);

  // updater works on data (per-block)
  const updateBlockSetting = (field: string, value: any) => {
    if (!selectedBlock) return;

    setBlockSettings(selectedBlock.id, (prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedSettings =
    selectedBlock?.id && blockSettings[selectedBlock.id]
      ? blockSettings[selectedBlock.id].data || {}
      : {};

  const renderBlockFields = () => {
    switch (selectedBlock?.key) {
      case "stubborn-header":
        return (
          <>
          <div>
            <InputGroup
              type="text"
              label="Titre"
              className="!py-2"
              value={selectedSettings.title || ""}
              onChange={(e: any) => updateBlockSetting("title", e.target.value)}
            />
            </div>

           <div>
            <InputGroup
              type="text"
              label="Sous-titre"
              className="!py-2"
              value={selectedSettings.subtitle || ""}
              onChange={(e: any) =>
                updateBlockSetting("subtitle", e.target.value)
              }
            />
            </div>

            <div>    
            {/* LOGO */}
            <FileDropzone
              value={logoFiles}
              maxFiles={1}
              previews={
                selectedSettings.logoUrl ? [selectedSettings.logoUrl] : []
              }
              dropLabel="Importer un logo"
              onChange={async (files) => {
                if (files[0]) {
                  const result = await uploadFile(files[0]);
                  updateBlockSetting("logoUrl", result.url);
                  setLogoFiles([]);
                }
              }}
              onRemoveExisting={() => updateBlockSetting("logoUrl", null)}
            />
            </div>

            {/* COVER PAGE IMAGE */}
            {/* <FileDropzone
              value={coverFiles}
              maxFiles={1}
              previews={
                templateSettings.coverUrl ? [templateSettings.coverUrl] : []
              }
              dropLabel="Importer un bandeau à l’en-tête"
              onChange={async (files) => {
                if (files[0]) {
                  const result = await uploadFile(files[0]);
                  setTemplateSettings((prev: any) => ({
                    ...prev,
                    coverUrl: result.url,
                  }));
                  setCoverFiles([]);
                }
              }}
              onRemoveExisting={() =>
                setTemplateSettings((prev: any) => ({
                  ...prev,
                  coverUrl: null,
                }))
              }
            /> */}

            {/* TOGGLES */}
            <div className="flex justify-between gap-3">
              <span className="ms-2 text-sm">Afficher le logo</span>
              <label className="flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!selectedSettings.showLogo}
                  onChange={(e) =>
                    updateBlockSetting("showLogo", e.target.checked)
                  }
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-secondary transition-colors"></div>
                <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
              </label>
            </div>

            <div className="flex justify-between gap-3">
              <span className="ms-2 text-sm dark:text-neutral-300">
                Afficher les informations de l’entreprise
              </span>
              <label className="flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!selectedSettings.showCompany}
                  onChange={(e) =>
                    updateBlockSetting("showCompany", e.target.checked)
                  }
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-secondary transition-colors"></div>
                <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
              </label>
            </div>
          </>
        );

      case "client-info":
        return (
          <InputGroup
            label="Titre du bloc"
            className="!py-2"
            value={selectedSettings.title || ""}
            onChange={(e: any) => updateBlockSetting("title", e.target.value)}
          />
        );

      case "totals-block":
        return (
          <>
            <InputGroup
              label="Taux de TVA (%)"
              type="number"
              className="!py-2"
              defaultValue={selectedSettings.vat ?? 20}
              onChange={(e: any) =>
                updateBlockSetting("vat", Number(e.target.value))
              }
            />

            <InputGroup
              label="Pourcentage acompte (%)"
              type="number"
              className="!py-2"
              defaultValue={selectedSettings.downPayment ?? 30}
              onChange={(e: any) =>
                updateBlockSetting("downPayment", Number(e.target.value))
              }
            />
          </>
        );

      default:
        return (
          <p className="text-sm opacity-60 dark:text-neutral-300">
            Aucun paramètre disponible pour ce bloc.
          </p>
        );
    }
  };
  const pageBg = activePage?.background || {};

  return (
    <Globaltabs
      tabs={[
        {
          label: "Style et options",
          content: (
            <>
              <div className="space-y-4 divide-y divide-gray-200 dark:border-gray-600 max-h-[72dvh] overflow-y-auto">
                <div className="pb-4">
                  <span className="text-base flex items-center gap-2 dark:text-neutral-300">
                    <Grid2X2 size={16} /> Options du bloc
                  </span>

                  <div className="bg-blue-100 p-3 text-sm my-2">
                    Bloc sélectionné:
                    <span className="font-semibold">
                      {selectedBlock?.key || " none"}
                    </span>
                  </div>

                  <div className="space-y-3">{renderBlockFields()}</div>
                </div>

                {/* COLORS */}
                <div className="space-y-3 pb-4">
                  <span className="text-base flex items-center gap-2 dark:text-neutral-300">
                    <Palette size={16} /> Couleurs
                  </span>

                  <input
                    type="color"
                    value={templateSettings.colors?.primary || "#1F2937"}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                  />

                  <input
                    type="color"
                    value={templateSettings.colors?.secondary || "#3B82F6"}
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3 pb-4">
                  <span className="text-base flex items-center gap-2 dark:text-neutral-300">
                    <TypeIcon size={16} /> Typographie
                  </span>

                  <div>
                    <span className="text-base dark:text-neutral-300">
                      Titre
                    </span>
                  </div>
                  <select
                    className="border border-borderlight w-full outline-0 px-3 py-2 rounded dark:text-neutral-300"
                    value={templateSettings.typography?.titleFont || "Inter"}
                    onChange={(e) =>
                      handleFontChange("titleFont", e.target.value)
                    }
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>

                  <div>
                    <span className="text-base dark:text-neutral-300">
                      Texte
                    </span>
                  </div>

                  <select
                    className="border border-borderlight w-full outline-0 px-3 py-2 rounded dark:text-neutral-300"
                    value={templateSettings.typography?.textFont || "Inter"}
                    onChange={(e) =>
                      handleFontChange("textFont", e.target.value)
                    }
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pb-4">
                  <span className="text-base flex items-center gap-2 dark:text-neutral-300">
                    <Image size={16} /> Images
                  </span>
                  <div>
                    <FileDropzone
                      value={[]}
                      maxFiles={1}
                      previews={pageBg?.image ? [pageBg.image] : []}
                      dropLabel="Importer l’arrière-plan de la page"
                      onChange={async (files) => {
                        if (!files[0] || !activePage) return;

                        const res = await uploadFile(files[0]);

                        setPages((prev) =>
                          prev.map((p) =>
                            p.id === activePage.id
                              ? {
                                  ...p,
                                  background: {
                                    ...(p.background || {}),
                                    image: res.url,
                                  },
                                }
                              : p,
                          ),
                        );
                        // setTemplateSettings((prev: any) => ({
                        //   ...prev,
                        //   coverUrl: res.url,
                        // }));
                      }}
                      onRemoveExisting={() =>
                        setPages((prev) =>
                          prev.map((p) =>
                            p.id === activePage.id
                              ? {
                                  ...p,
                                  background: { ...p.background, image: null },
                                }
                              : p,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block">
                      Taille de l’arrière-plan
                    </label>
                    <select
                      className="border border-borderlight w-full outline-0 px-3 py-2 rounded dark:text-neutral-300"
                      value={pageBg.size || "cover"}
                      onChange={(e) =>
                        setPages((prev) =>
                          prev.map((p) =>
                            p.id === activePage.id
                              ? {
                                  ...p,
                                  background: {
                                    ...p.background,
                                    size: e.target.value,
                                  },
                                }
                              : p,
                          ),
                        )
                      }
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block">Opacité de l’image</label>
                    <div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={pageBg.overlayOpacity || 0}
                        onChange={(e) =>
                          setPages((prev) =>
                            prev.map((p) =>
                              p.id === activePage.id
                                ? {
                                    ...p,
                                    background: {
                                      ...p.background,
                                      overlayOpacity: Number(e.target.value),
                                    },
                                  }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                  <label className="text-sm">Couleur d’arrière-plan</label>

                  <div className="flex items-center gap-2">
                    {/* COLOR PICKER */}
                    <input
                      type="color"
                      value={pageBg.color || "#ffffff"}
                      onChange={(e) =>
                        setPages((prev) =>
                          prev.map((p) =>
                            p.id === activePage.id
                              ? {
                                  ...p,
                                  background: {
                                    ...(p.background || {}),
                                    color: e.target.value,
                                  },
                                }
                              : p,
                          ),
                        )
                      }
                      className="h-10 w-12 p-0 border border-borderlight rounded cursor-pointer"
                    />

                    {/* HEX / MANUAL INPUT */}
                    <input
                      type="text"
                      placeholder="#ffffff"
                      value={pageBg.color || ""}
                      onChange={(e) =>
                        setPages((prev) =>
                          prev.map((p) =>
                            p.id === activePage.id
                              ? {
                                  ...p,
                                  background: {
                                    ...(p.background || {}),
                                    color: e.target.value,
                                  },
                                }
                              : p,
                          ),
                        )
                      }
                      className="flex-1 border border-borderlight rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* COMPANY */}
                <div className="space-y-3">
                  <span className="text-base flex items-center gap-2 dark:text-neutral-300">
                    <Building size={16} /> Coordonnées de l’entreprise
                  </span>

                  <div>
                    <InputGroup
                      label="Nom de l’entreprise"
                      className="!py-2"
                      defaultValue={companyInfo.name}
                      onChange={(e: any) =>
                        onCompanyInfoChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="Adresse"
                      className="!py-2"
                      defaultValue={companyInfo.addressLine1}
                      onChange={(e: any) =>
                        onCompanyInfoChange("addressLine1", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <InputGroup
                      label="Code Postal"
                      className="!py-2"
                      defaultValue={companyInfo.postalCode}
                      onChange={(e: any) =>
                        onCompanyInfoChange("postalCode", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="Ville"
                      className="!py-2"
                      defaultValue={companyInfo.city}
                      onChange={(e: any) =>
                        onCompanyInfoChange("city", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="Téléphone"
                      className="!py-2"
                      defaultValue={companyInfo.phone}
                      onChange={(e: any) =>
                        onCompanyInfoChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="E-mail"
                      className="!py-2"
                      defaultValue={companyInfo.email}
                      onChange={(e: any) =>
                        onCompanyInfoChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="Site Web"
                      className="!py-2"
                      defaultValue={companyInfo.website}
                      onChange={(e: any) =>
                        onCompanyInfoChange("website", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <InputGroup
                      label="SIRET"
                      className="!py-2"
                      defaultValue={companyInfo.siret}
                      onChange={(e: any) =>
                        onCompanyInfoChange("siret", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          ),
        },
       
      ]}
    />
  );
};

export default TemplateSettings;
