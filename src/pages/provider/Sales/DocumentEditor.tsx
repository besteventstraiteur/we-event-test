import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";
import TemplateLibrary from "./TemplateLibrary";
import TemplateEditor from "./TemplateEditor";
import OuterModal from "../../../components/Custommodal/OuterModal";
import TemplatePreview from "./TemplatePreview";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useEffect } from "react";
import { useToast } from "../../../utils/toast";
import InputGroup from "../../../components/ui-main/InputGroup";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import CustomSelect from "../../../components/ui-main/selectBox";
import { MeasuringStrategy } from "@dnd-kit/core";

type BlockInstance = {
  id: string;
  key: string;
};
type Page = {
  id: string;
  blocks: string[];
  background?: {
    image?: string | null;
    size?: "cover" | "contain";
    position?: "center" | "top" | "bottom";
    repeat?: "no-repeat" | "repeat";
    overlayColor?: string;
    overlayOpacity?: number;
    color?: string;
  };
};

type BlockSetting = {
  blockKey: string;
  data: any;
};

const createEmptyPage = () => ({
  id: crypto.randomUUID(),
  blocks: [],
  background: {
    image: null,
    size: "cover",
    position: "center",
    repeat: "no-repeat",
    overlayColor: "#000000",
    overlayOpacity: 0,
    color: "",
  },
});

const getInsertIndexFromOver = (
  overId: string | null,
  activePageId: string | null,
  pages: Page[],
) => {
  if (!overId || !activePageId) return null;

  if (overId.startsWith("drop-")) {
    const [, pageId, index] = overId.split("-");
    if (pageId === activePageId) {
      return Number(index);
    }
  }

  if (overId.startsWith("empty-page")) {
    return 0;
  }

  const page = pages.find((p) => p.id === activePageId);
  if (page && page.blocks.includes(overId)) {
    return page.blocks.indexOf(overId);
  }

  if (overId === "editor-canvas") {
    return page?.blocks.length ?? 0;
  }

  return null;
};

const DocumentEditor = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [templateLoading, setTemplateLoading] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockInstance[]>([]);
  const [templateSettings, setTemplateSettings] = useState<{
    coverUrl: string | null;
  }>({
    coverUrl: null,
  });
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [calculated, setCalculated] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const [companyInfo, setCompanyInfo] = useState({
    name: "Votre entreprise",
    addressLine1: "123 rue de la Paix",
    postalCode: "75000",
    city: "Paris",

    phone: "",
    email: "",
    website: "",
    siret: "",
  });
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [aiForm, setAiForm] = useState({
    language: "fr",
    prompt: "",
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [data, setData] = useState({});
  const [showLockedModal, setShowLockedModal] = useState(false);

  const [blockSettings, setBlockSettings] = useState<
    Record<string, BlockSetting>
  >({});
  const [documentData, setDocumentData] = useState<any>(null);
  const [showSendModal, setShowSendModal] = useState(false);

  const [sendForm, setSendForm] = useState({
    recipientName: "",
    recipientEmail: "",
    message: "",
    documentLink: true,
  });
  const [pages, setPages] = useState<Page[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);

  const getDefaultBlockSettings = (key: string) => {
    switch (key) {
      case "stubborn-header":
        return {
          title: "DEVIS",
          subtitle: "Proposition commerciale",
          showLogo: true,
          showCompany: true,
          logoUrl: "",
        };

      case "cover-page":
        return { files: [] };

      case "document-object":
        return { title: "Objet", value: "{{doc.subject}}" };

      case "client-info":
        return {
          title: "Adresse de facturation",
          content: `{{client.name}}
{{client.address}}
{{client.zip}} {{client.city}}`,
        };

      case "event-date":
        return {
          title: "Date et lieu",
          date: null,
          location: "",
          align: "left",
          variant: "h2",
        };
      case "terms-cgv":
        return {
          title: "",
          content: "",
        };
      case "image-block":
        return { images: [], layout: "single", size: "medium" };

      case "article-table":
        return {
          sections: [],
        };

      case "totals-block":
        return { vat: 20, downPayment: 30, subtotal: 0 };
      case "banking-info":
        return {
          title: "Informations de paiement",
          bankName: "",
          accountHolder: "",
          iban: "",
          bic: "",
          paymentTerms: "Paiement à 30 jours par virement bancaire",
        };
      case "signature-block":
        return {
          title: `Signature du client précédée de la mention "Lu et approuvé"`,
          boxHeight: 80,
          signatureImage: null,
        };
      case "footer-block":
        return {
          showCompanyInfo: false,
          showLegalNotice: true,
          customText: "",
        };
      case "slide-title":
        return {
          text: "Presentation title",
          align: "center",
        };

      case "slide-text":
        return {
          text: "Your text here",
        };

      case "slide-image":
        return {
          url: "",
          caption: "",
        };

      case "slide-gallery":
        return {
          images: [],
        };
      case "hero-image":
        return {
          image: "",
          height: "100vh",
        };

      case "big-title":
        return {
          text: "Your Big Title",
          subtitle: "Your subtitle here",
        };

      case "image-gallery":
        return {
          images: [],
          columns: 3,
        };

      case "testimonials":
        return {
          items: [
            { name: "", text: "" },
            { name: "", text: "" },
          ],
        };

      case "features":
        return {
          items: [
            { title: "", image: "" },
            { title: "", image: "" },
          ],
        };

      default:
        return {};
    }
  };

  const handleAddBlock = (blockKey: string, index?: number) => {
    const id = crypto.randomUUID();

    setSelectedBlocks((prev) => [...prev, { id, key: blockKey }]);

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== activePageId) return p;

        const nextBlocks = [...p.blocks];
        if (index === undefined || index === null) {
          nextBlocks.push(id);
        } else {
          nextBlocks.splice(index, 0, id);
        }

        return { ...p, blocks: nextBlocks };
      }),
    );

    setBlockSettings((prev) => ({
      ...prev,
      [id]: {
        blockKey,
        data: getDefaultBlockSettings(blockKey),
      },
    }));

    setSelectedBlockId(id);
  };

  const updateBlockSettings = (id: string, updater: any) => {
    setBlockSettings((prev) => {
      const existing = prev[id] || {
        blockKey:
          selectedBlocks.find((b) => b.id === id)?.key || "unknown-block",
        data: {},
      };

      const prevData = existing.data || {};

      const nextData =
        typeof updater === "function"
          ? updater(prevData)
          : { ...prevData, ...updater };

      return {
        ...prev,
        [id]: {
          ...existing,
          data: nextData,
        },
      };
    });
  };

  const handleCompanyInfoChange = (
    key: keyof typeof companyInfo,
    value: string,
  ) => {
    setCompanyInfo((prev) => ({ ...prev, [key]: value }));
  };

  const removeBlock = (id: string) => {
    setSelectedBlocks((prev) => prev.filter((b) => b.id !== id));

    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        blocks: p.blocks.filter((b) => b !== id),
      })),
    );

    setBlockSettings((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const addSlide = () => {
    const id = crypto.randomUUID();
    setPages((prev) => [...prev, { id, blocks: [] }]);
    setActivePageId(id);
  };
  const removeSlide = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (activePageId === id) {
      setActivePageId((prev) => prev[0]?.id || null);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const previewData = {
    blocks: selectedBlocks.map((b) => b.id),
    pages,
    blockSettings: Object.fromEntries(
      Object.entries(blockSettings).map(([id, obj]) => [
        id,
        { blockKey: obj.blockKey, ...obj.data },
      ]),
    ),
    globalStyle: templateSettings,
    companyInfo,
  };

  const navigate = useNavigate();

  const hydrateBlockDataFromDocument = (
    blockKey: string,
    data: any,
    documentData: any,
  ) => {
    if (!documentData) return data;

    if (blockKey === "client-info") {
      const hasRealClientData =
        documentData.customerName ||
        documentData.customerAddress ||
        documentData.customerPincode ||
        documentData.customerLocation;
      console.log(hasRealClientData, "hasyuyuuiuiiuyuiyuig");
      return {
        ...data,
        title: data?.title || "Adresse de facturation",

        content: hasRealClientData
          ? [
              documentData.customerName,
              documentData.customerAddress,
              [documentData.customerPincode, documentData.customerLocation]
                .filter(Boolean)
                .join(" "),
            ]
              .filter(Boolean)
              .join("\n")
          : data.content,
      };
    }

    if (blockKey === "event-date") {
      const eventDate = documentData?.eventDate;

      const validDate =
        eventDate && !isNaN(new Date(eventDate).getTime())
          ? new Date(eventDate).toISOString()
          : null;

      return {
        ...data,
        title: data?.title || "Date et lieu",
        date: validDate || data?.date || null,
        location: data?.location || documentData?.customerLocation || "",
      };
    }

    return data;
  };

  const fetchDocument = async () => {
    try {
      setLoading(true);

      const res = await getRequest(`${PROVIDER.DOCUMENT}/${id}`);
      const doc = res?.data?.data;
      if (!doc) return;

      setDocumentData(doc);

      const tpl = doc.templateJson;
      console.log(tpl, "sdjnuiuuuuiororoor");
      const restoredPages = tpl.pages || [];
      setPages(restoredPages);
      setActivePageId(restoredPages[0]?.id || null);

      const registry: BlockInstance[] = Object.entries(tpl.blockSettings).map(
        ([blockId, setting]: any) => ({
          id: blockId,
          key: setting.blockKey,
        }),
      );

      setSelectedBlocks(registry);
      const hydratedSettings: Record<string, BlockSetting> = {};

      Object.entries(tpl.blockSettings || {}).forEach(
        ([blockId, block]: any) => {
          hydratedSettings[blockId] = {
            blockKey: block.blockKey,
            data: hydrateBlockDataFromDocument(
              block.blockKey,
              block.data || {},
              doc,
            ),
          };
        },
      );

      setBlockSettings(hydratedSettings);

      // setBlockSettings(tpl.blockSettings);

      // const restoredSettings: any = {};
      // Object.entries(tpl.blockSettings || {}).forEach(([id, value]: any) => {
      //   restoredSettings[id] = {
      //     blockKey: value.blockKey,
      //     data: value.data || {},
      //   };
      // });

      // setBlockSettings(restoredSettings);

      if (tpl.companyInfo) {
        setCompanyInfo({
          name: doc.customerBusiness,
          addressLine1: doc.customerAddress,
          postalCode: doc.customerPincode,
          city: doc.customerLocation,
          phone: doc.customerPhone,
          email: doc.customerEmail,
          website: "",
          siret: "",
        });
      }

      setTemplateSettings({
        coverUrl: tpl.globalStyle?.coverUrl || null,
        colors: tpl.globalStyle?.colors || {},
        typography: tpl.globalStyle?.typography || {},
      });

      setSendForm({
        recipientName: doc.customerName,
        recipientEmail: doc.customerEmail,
        message: "",
        documentLink: true,
      });

      setSelectedBlockId(tpl.pages?.[0]?.blocks?.[0] || null);
    } catch (err) {
      console.error("Failed to fetch document →", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(templateSettings, "sdsssdsdkjiuyuiy");
  const isAccepted = documentData?.status === "accepted";

  const toast = useToast();

  const calculateTotals = ({
    articleTable,
    vatPercent,
    downPaymentPercent,
    dueDate,
  }: {
    articleTable: any;
    vatPercent: number;
    downPaymentPercent: number;
    dueDate: string | null;
  }) => {
    const preTaxAmount =
      articleTable?.sections?.reduce((sum: number, section: any) => {
        return (
          sum +
          section.items.reduce((s: number, item: any) => {
            const lineTotal =
              Number(item.qty) *
              Number(item.price) *
              (1 - Number(item.discount || 0) / 100);
            return s + lineTotal;
          }, 0)
        );
      }, 0) || 0;

    // 2. TVA
    const taxAmount = (preTaxAmount * vatPercent) / 100;

    // 3. TOTAL TTC
    const totalAmount = preTaxAmount + taxAmount;

    const minPayableAmount = (totalAmount * downPaymentPercent) / 100;

    // 5. BALANCE
    const balanceAmount = totalAmount - minPayableAmount;

    return {
      preTaxAmount: Number(preTaxAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      minPayableAmount: Number(minPayableAmount.toFixed(2)),
      balanceAmount: Number(balanceAmount.toFixed(2)),
      dueDate,
    };
  };

  const getCalculatedData = () => {
    let articleTable: any = null;
    let totalsBlock: any = null;
    let dueDate: string | null = null;

    Object.values(blockSettings).forEach((block) => {
      if (block.blockKey === "article-table") {
        articleTable = block.data;
      }

      if (block.blockKey === "totals-block") {
        totalsBlock = block.data;
      }

      if (block.blockKey === "event-date") {
        if (block.data?.date) {
          const d = new Date(block.data.date);
          dueDate = d.toISOString().split("T")[0];
        } else {
          dueDate = null;
        }
      }
    });

    return calculateTotals({
      articleTable,
      vatPercent: Number(totalsBlock?.vat || 0),
      downPaymentPercent: Number(totalsBlock?.downPayment || 0),
      dueDate,
    });
  };

  useEffect(() => {
    const nextCalculated = getCalculatedData();
    setCalculated(nextCalculated);
  }, [blockSettings]);

  const handleSave = async () => {
    setbtnLoading(true);
    const calculated = getCalculatedData();

    const payload = {
      preTaxAmount: calculated.preTaxAmount,
      taxAmount: calculated.taxAmount,
      totalAmount: calculated.totalAmount,

      templateJson: {
        pages,
        blocks: selectedBlocks.map((b) => b.id),
        companyInfo,
        calculated,
        globalStyle: templateSettings,
        blockSettings: Object.fromEntries(
          Object.entries(blockSettings).map(([id, obj]) => [
            id,
            {
              blockKey: obj.blockKey,
              data: obj.data,
            },
          ]),
        ),
      },
    };

    try {
      await patchRequest(`${PROVIDER.DOCUMENT}/${id}`, payload);
      fetchDocument();
      toast.success("Document sauvegardé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Quelque chose s'est mal passé");
    } finally {
      setbtnLoading(false);
    }
  };

  const handleSendDocument = async () => {
    setbtnLoading(true);

    const payload = {
      id: documentData.id,
      title: documentData.templateJson.title,
      recipientName: sendForm.recipientName,
      recipientEmail: sendForm.recipientEmail,
      message: sendForm.message,
      documentLink: sendForm.documentLink,
      templateId: selectedTemplateId,
    };
    try {
      await postRequest(`${PROVIDER.DOCUMENT}/send`, payload);
      setShowSendModal(false);
      toast.success("Document envoyé avec succès");
    } catch (error) {}
    setbtnLoading(false);

    // await postRequest(PROVIDER.SEND_DOCUMENT, payload);
  };

  const handleConvertToInvoice = async () => {
    setbtnLoading(true);
    try {
      const payload = {
        id,
      };
      await postRequest(`${PROVIDER.DOCUMENT}/convert`, payload);
      toast.success("Le devis a été converti en facture");
      // navigate("/provider/document");
      fetchDocument();
      setShowConvertModal(false);
    } catch (err) {
      toast.error("Impossible de convertir le document");
    }
    setbtnLoading(false);
  };
  const handleSendDocumentFirst = async () => {
    await handleSave();
    await fetchEmailTemplates();
    setSelectedTemplateId(null);
    setShowSendModal(true);
  };

  useEffect(() => {
    if (!id || documentData) return;
    fetchDocument();
  }, [id, documentData]);

  const fetchEmailTemplates = async () => {
    try {
      setTemplateLoading(true);

      const res = await getRequest(PROVIDER.EMAIL_TEMPLATES_LIST);

      const context = documentData?.status === "invoice" ? "invoice" : "quote";

      const templates = res?.data?.data;

      setEmailTemplates(templates);

      if (templates.length > 0) {
        setSelectedTemplateId(templates[0].id);
      } else {
        setSelectedTemplateId(null);
      }
    } catch (err) {
      toast.error("Impossible de charger les modèles d’email");
    } finally {
      setTemplateLoading(false);
    }
  };

  return (
    <>
      <div data-no-translate>
        <div>
          <div className="flex flex-col items-start md:flex-row md:items-center gap-5 justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold dark:text-neutral-300">
                Document editor
              </h1>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-between items-center my-3">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate("/provider/document")}
            >
              <ArrowLeft /> Back
            </Button>
            <span className="dark:text-neutral-300">
              Modèle Devis - Standard
            </span>
          </div>
          <div className="flex-1">
            <span className="bg-blue-100 text-blue-500 text-sm px-3 py-1 rounded-full capitalize">
              À Traiter
            </span>
          </div>
          <div className="flex gap-2">
            {isAccepted && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowConvertModal(true)}
              >
                Convertir en facture
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Prévisualiser
            </Button>

            <Button
              loading={btnLoading}
              variant="outline"
              disabled={isAccepted}
              onClick={handleSave}
            >
              Sauvegarder
            </Button>

            <Button
              disabled={isAccepted}
              onClick={() => {
                handleSendDocumentFirst();
              }}
            >
              Envoyer
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[260px_1fr] gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
              autoScroll={{
                threshold: {
                  x: 0,
                  y: 0.2,
                },
                acceleration: 12,
              }}
              onDragStart={(event) => {
                const data = event.active.data.current;
                if (data?.type === "library-block") {
                  setDraggedBlock(data);
                }
              }}
              onDragEnd={(event) => {
                const { active, over } = event;
                const activeId = active.id as string;

                setDraggedBlock(null);

                const resolvedIndex = getInsertIndexFromOver(
                  over?.id as string,
                  activePageId,
                  pages,
                );

                if (
                  active.data.current?.type === "library-block" &&
                  activePageId &&
                  resolvedIndex !== null
                ) {
                  handleAddBlock(active.data.current.blockKey, resolvedIndex);
                  setInsertIndex(null);
                  return;
                }

                if (!selectedBlocks.some((b) => b.id === activeId)) {
                  setInsertIndex(null);
                  return;
                }

                if (resolvedIndex !== null && activePageId) {
                  setPages((prev) =>
                    prev.map((p) => {
                      if (p.id !== activePageId) return p;

                      const fromIndex = p.blocks.indexOf(activeId);
                      if (fromIndex === -1) return p;

                      const next = [...p.blocks];
                      next.splice(fromIndex, 1);

                      const toIndex = Math.min(resolvedIndex, next.length);
                      next.splice(toIndex, 0, activeId);

                      return { ...p, blocks: next };
                    }),
                  );
                }

                setInsertIndex(null);
              }}
              onDragCancel={() => {
                setDraggedBlock(null);
                setInsertIndex(null);
              }}
            >
              <TemplateLibrary
                onSelectBlock={handleAddBlock}
                structure={data?.structure}
              />

              <div className="relative">
                <TemplateEditor
                  blockRefs={blockRefs}
                  setSelectedBlocks={setSelectedBlocks}
                  selectedBlocks={selectedBlocks}
                  selectedBlockKey={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  companyInfo={companyInfo}
                  blockSettings={blockSettings}
                  setBlockSettings={updateBlockSettings}
                  removeBlock={removeBlock}
                  handlePreview={handlePreview}
                  templateSettings={templateSettings}
                  calculated={calculated}
                  pages={pages}
                  activePageId={activePageId}
                  setActivePageId={setActivePageId}
                  addSlide={addSlide}
                  removeSlide={removeSlide}
                  structure={data?.structure}
                  setPages={setPages}
                  insertIndex={insertIndex}
                  setInsertIndex={setInsertIndex}
                  isDocumentView={true}
                  documentData={documentData}
                />
                <DragOverlay>
                  {draggedBlock ? (
                    <div className="bg-white shadow-lg border rounded p-3 w-52 opacity-90">
                      <div className="text-sm font-semibold">
                        {draggedBlock.title}
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </div>
            </DndContext>
          </div>
        </div>
      </div>

      <OuterModal
        active={showPreview}
        setActive={setShowPreview}
        showClose={true}
      >
        <TemplatePreview data={previewData} setBlockSettings={() => {}} />
      </OuterModal>
      <OuterModal active={showSendModal} setActive={setShowSendModal} showClose>
        <div className="max-w-xl mx-auto bg-white dark:bg-darkmode rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold dark:text-neutral-300">
              Envoyer le bon commande
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <InputGroup
                label="Nom du destinataire *"
                defaultValue={sendForm.recipientName}
                onChange={(e) =>
                  setSendForm({ ...sendForm, recipientName: e.target.value })
                }
              />
            </div>

            <div>
              <InputGroup
                label="Email *"
                defaultValue={sendForm.recipientEmail}
                onChange={(e) =>
                  setSendForm({ ...sendForm, recipientEmail: e.target.value })
                }
              />
            </div>

            <div className="check">
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Modèle d’email *
              </label>

              {templateLoading ? (
                <p className="text-sm text-gray-500">Chargement...</p>
              ) : emailTemplates.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <p className="mb-2 font-medium">
                    Aucun modèle d’email trouvé pour ce document.
                  </p>
                  <p className="mb-3">
                    Veuillez créer un modèle d’email avant de pouvoir envoyer ce
                    document.
                  </p>

                  <Button
                    size="small"
                    variant="outline"
                    onClick={() => {
                      setShowSendModal(false);
                      navigate("/provider/email-templates");
                    }}
                  >
                    Créer un modèle d’email
                  </Button>
                </div>
              ) : (
                <CustomSelect
                  options={emailTemplates.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.language})`,
                  }))}
                  value={
                    emailTemplates
                      .map((t) => ({
                        value: t.id,
                        label: `${t.name} (${t.language})`,
                      }))
                      .find((o) => o.value === selectedTemplateId) || null
                  }
                  onChange={(v: any) => setSelectedTemplateId(v.value)}
                  placeholder="Sélectionner un modèle"
                />
              )}
            </div>

            {/* <div>
              <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Message personnalisé (optionnel)
              </label>
              <textarea
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                value={
                  aiLoading
                    ? "Veuillez patienter, le message est en cours de génération…"
                    : sendForm.message
                }
                disabled={aiLoading}
                onChange={(e) =>
                  setSendForm({ ...sendForm, message: e.target.value })
                }
              />
            </div> */}

            {/* <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  setAiForm((prev) => ({
                    ...prev,
                    prompt: sendForm.message || "",
                  }));
                  setShowAIModal(true);
                }}
              >
                ✨ Formater avec l’IA
              </Button>
            </div> */}
            <div className="flex justify-between items-center">
              <span className="text-sm dark:text-neutral-300">
                Joindre le PDF
              </span>
              <input
                type="checkbox"
                checked={sendForm.documentLink}
                onChange={(e) =>
                  setSendForm({
                    ...sendForm,
                    documentLink: e.target.checked,
                  })
                }
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSendModal(false)}
              >
                Annuler
              </Button>
              <Button
                loading={btnLoading}
                className="flex-1"
                onClick={handleSendDocument}
              >
                Envoyer le document
              </Button>
            </div>
          </div>
        </div>
      </OuterModal>
      <OuterModal
        active={showLockedModal}
        setActive={setShowLockedModal}
        showClose
      >
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-red-600">
            Document verrouillé
          </h3>

          <p className="text-gray-600">
            Ce document a été accepté.
            <br />
            Il ne peut plus être modifié.
          </p>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowLockedModal(false)}>Fermer</Button>
          </div>
        </div>
      </OuterModal>
      <OuterModal
        active={showConvertModal}
        setActive={setShowConvertModal}
        showClose
      >
        <div className="max-w-lg mx-auto bg-white rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-orange-500 text-xl">⚠️</span>
            <h3 className="text-lg font-semibold">
              Confirmer la conversion en facture
            </h3>
          </div>

          <p className="text-gray-600 mb-4">
            Vous êtes sur le point de convertir ce devis accepté en facture.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p className="font-medium text-blue-700 mb-2">Cette action va :</p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Créer une nouvelle facture basée sur ce devis</li>
              <li>Générer un numéro de facture unique et séquentiel</li>
              <li>Conserver le devis original dans son état actuel</li>
              <li>Vous rediriger vers la nouvelle facture</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Le devis original restera disponible dans vos documents. Une fois
            envoyée, une facture ne pourra plus être modifiée.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConvertModal(false)}
            >
              Annuler
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              loading={btnLoading}
              onClick={() => {
                handleConvertToInvoice();
              }}
            >
              Confirmer la conversion
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal active={showAIModal} setActive={setShowAIModal} showClose>
        <div className="max-w-lg mx-auto bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Formater le message avec l’IA
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Langue</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={aiForm.language}
              onChange={(e) =>
                setAiForm({ ...aiForm, language: e.target.value })
              }
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Prompt textarea */}
          <InputGroup
            label="Message à reformuler"
            type="textarea"
            placeholder="Écrivez votre message brut ici..."
            defaultValue={aiForm.prompt}
            onChange={(e) => setAiForm({ ...aiForm, prompt: e.target.value })}
          />
          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAIModal(false)}>
              Annuler
            </Button>

            <Button
              loading={aiLoading}
              onClick={async () => {
                if (!aiForm.prompt) return;

                setAiLoading(true);

                const payload = `
Tu es un assistant chargé de rédiger un message professionnel destiné à un client.

Règles STRICTES :
- Réponds uniquement avec le message final.
- Aucun titre, aucune liste, aucun markdown.
- Aucun conseil, aucune option, aucune explication.
- Une seule version du message.
- Ton professionnel, naturel et humain.
- Le message doit être prêt à être envoyé tel quel.

Langue : ${aiForm.language === "fr" ? "français" : "anglais"}

Message à reformuler :
${aiForm.prompt}
`;

                try {
                  const res = await postRequest(PROVIDER.AICHAT, {
                    prompt: payload,
                  });

                  setSendForm((prev) => ({
                    ...prev,
                    message: res.data?.data?.reply,
                  }));

                  setShowAIModal(false);
                  setAiForm({ ...aiForm, prompt: "" });
                } catch (err) {
                  toast.error("Erreur lors de la génération du message");
                } finally {
                  setAiLoading(false);
                }
              }}
            >
              Générer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default DocumentEditor;
