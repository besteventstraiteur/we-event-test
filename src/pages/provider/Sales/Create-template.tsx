import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";
import TemplateLibrary from "./TemplateLibrary";
import TemplateEditor from "./TemplateEditor";
import TemplateSettings from "./TemplateSettings";
import OuterModal from "../../../components/Custommodal/OuterModal";
import TemplatePreview from "./TemplatePreview";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRequest,
  patchRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useEffect } from "react";
import { useToast } from "../../../utils/toast";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MeasuringStrategy } from "@dnd-kit/core";
import { useSelector } from "react-redux";

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

const Createtemplate = () => {
  const { id } = useParams();
  const login = useSelector((state: any) => state);
  console.log(login, "sdbjksdkjsbdjksbdjks");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const [selectedBlocks, setSelectedBlocks] = useState<BlockInstance[]>([]);
  const [templateSettings, setTemplateSettings] = useState<{
    coverUrl: string | null;
    pageSize?: "A4" | "LETTER";
  }>({
    coverUrl: null,
    pageSize: "A4",
  });
  const [calculated, setCalculated] = useState<any>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // company info for header block
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    addressLine1: "",
    postalCode: "",
    city: "",

    phone: "",
    email: "",
    website: "",
    siret: "",
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [data, setData] = useState({});
  const [blockSettings, setBlockSettings] = useState<
    Record<string, BlockSetting>
  >({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

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
          text: "Titre",
          align: "center",
        };

      case "slide-text":
        return {
          text: "Votre texte ici",
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

  const addPage = () => {
    const id = crypto.randomUUID();

    setPages((prev) => [...prev, { id, blocks: [] }]);
    setActivePageId(id);
  };

  const removePage = (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  const addSlide = () => {
    const page = createEmptyPage();
    setPages((prev) => [...prev, page]);
    setActivePageId(page.id);
  };

  const removeSlide = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (activePageId === id) {
      setActivePageId((prev) => prev[0]?.id || null);
    }
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

    setBlockSettings((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    if (selectedBlockId === id) setSelectedBlockId(null);
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

  const fetchTemplate = async () => {
    try {
      setLoading(true);

      const res = await getRequest(`${PROVIDER.TEMPLATE}/${id}`);
      const tpl = res?.data?.data;

      if (!tpl?.templateJson) {
        setLoading(false);
        return;
      }

      setData(tpl);

      const {
        pages = [],
        blockSettings = {},
        companyInfo,
        globalStyle,
      } = tpl.templateJson;

      setPages(pages);
      setActivePageId(pages[0]?.id || null);

      const registry: BlockInstance[] = Object.entries(blockSettings).map(
        ([blockId, setting]: any) => ({
          id: blockId,
          key: setting.blockKey,
        }),
      );
      setSelectedBlocks(registry);

      setBlockSettings(blockSettings);

      const firstBlockId = pages[0]?.blocks?.[0] || null;
      setSelectedBlockId(firstBlockId);

      if (companyInfo) {
        setCompanyInfo((prev) => ({
          ...prev,
          ...companyInfo,
        }));
      }

      if (globalStyle) {
        setTemplateSettings((prev) => ({
          ...prev,
          pageSize: globalStyle.pageSize || "A4",
          ...globalStyle,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch template →", err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

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

    // 4. DOWN PAYMENT
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
      name: data?.name,
      type: data?.type,
      structure: data?.structure,
      isDefault: true,
      thumbnail: data?.coverUrl,
      templateJson: {
        structure: data?.structure,
        blocks: selectedBlocks.map((b) => b.id),
        companyInfo: companyInfo,
        calculated,
        globalStyle: templateSettings,
        pages,
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
    console.log(payload, "payloadpayloadpayload");

    try {
      await patchRequest(`${PROVIDER.TEMPLATE}/${id}`, payload);
      fetchTemplate();
      navigate("/provider/templates");
    } catch (error) {
      toast.error("Quelque chose s'est mal passé");
    }
    setbtnLoading(false);
  };

  const fetchProfile = async () => {
    try {
      const res = await getRequest(PROVIDER.GET_PROFILE);
      const profile = res?.data?.data;

      if (profile) {
        setCompanyInfo((prev) => ({
          ...prev,
          name: profile?.name || prev.name,
          addressLine1: profile?.address || prev.addressLine1,
          postalCode: profile?.postcode || prev.postalCode,
          city: profile?.city || prev.city,
          phone: profile?.phoneNumber || prev.phone,
          email: profile?.email || prev.email,
          website: profile?.webUrl || prev.website,
          siret: profile?.companyRegNo || prev.siret,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProfile();
    fetchTemplate();
  }, [id]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold dark:text-neutral-100">
          Créer un modèle
        </h1>
      </div>

      <div className="flex gap-3 justify-between items-center my-3">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate("/provider/templates")}
          >
            <ArrowLeft size={18} /> Retour
          </Button>
          <span className="dark:text-neutral-300">Modèle Devis - Standard</span>
        </div>
        <div className="flex-1">
          <span className="bg-blue-100 text-blue-500 text-sm px-3 py-1 rounded-full capitalize">
            À Traiter
          </span>
        </div>
        <Button loading={btnLoading} onClick={handleSave}>
          Enregistrer
        </Button>
      </div>

      <div>
        <div className="grid grid-cols-[260px_1fr_300px] gap-4">
          <DndContext
            collisionDetection={pointerWithin}
            sensors={sensors}
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
              activePage={pages.find((p) => p.id === activePageId)}
              setTemplateSettings={setTemplateSettings}
            />

            <DragOverlay dropAnimation={null}>
              {draggedBlock ? (
                <div className="bg-white shadow-lg border rounded p-3 w-52 opacity-90">
                  <div className="text-sm font-semibold">
                    {draggedBlock.title}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
            <TemplateSettings
              selectedBlock={
                selectedBlocks.find((b) => b.id === selectedBlockId) || null
              }
              companyInfo={companyInfo}
              onCompanyInfoChange={handleCompanyInfoChange}
              blockSettings={blockSettings}
              setBlockSettings={updateBlockSettings}
              templateSettings={templateSettings}
              setTemplateSettings={setTemplateSettings}
              activePage={pages.find((p) => p.id === activePageId)}
              setPages={setPages}
            />
          </DndContext>
        </div>
      </div>

      <OuterModal
        active={showPreview}
        setActive={setShowPreview}
        showClose={true}
      >
        <TemplatePreview
          data={previewData}
          setBlockSettings={setBlockSettings}
        />
      </OuterModal>
    </>
  );
};

export default Createtemplate;
