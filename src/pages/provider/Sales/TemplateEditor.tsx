import { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import { uploadFile } from "../../../utils/uploadfile";
import { Plus, PlusIcon, Trash, Trash2 } from "lucide-react";
import CustomDatePicker from "../../../components/DatePicker";
import FileDropzone from "../../../components/imageUpload";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PROVIDER } from "../../../utils/endPoints";
import { getRequest } from "../../../utils/http-client/axiosClient";
import CustomSelect from "../../../components/ui-main/selectBox";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [
      {
        font: ["inter", "montserrat", "roboto", "lato", "opensans", "playfair"],
      },
    ],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "align",
  "list",
  "bullet",
];

type BlockInstance = { id: string; key: string };
type BlockSetting = { blockKey: string; data: any };

interface TemplateEditorProps {
  selectedBlocks: [{ id; key }];
  setSelectedBlocks: (blocks: BlockInstance[]) => void;
  selectedBlockKey: string | null;
  onSelectBlock: (id: string) => void;

  pages: { id: string; blocks: string[] }[];
  setPages: React.Dispatch<
    React.SetStateAction<{ id: string; blocks: string[] }[]>
  >;
  isDocumentView?: boolean;
  activePageId: string | null;
  setActivePageId: (id: string) => void;
  addSlide?: () => void;
  removeSlide?: (id: string) => void;

  structure?: "basic" | "articles";
  documentData?: any;
  templateSettings: {
    coverUrl?: string | null;
  };
  companyInfo: {
    name: string;
    addressLine1: string;
    postalCode: string;
    city: string;
  };
  blockSettings: Record<string, BlockSetting>;
  setBlockSettings: (id: string, updater: any) => void;
  removeBlock: (id: string) => void;
  handlePreview: () => void;
  calculated: any;
  insertIndex: number | null;
  setInsertIndex: (i: number | null) => void;
  blockRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const PAGE_SIZES = {
  A4: {
    label: "A4",
    width: 794, // px @ 96dpi
    height: 1123,
  },
  LETTER: {
    label: "Letter",
    width: 816,
    height: 1056,
  },
};

const resolveBlockData = (
  blockKey: string,
  blockData: any,
  documentData: any,
  isDocumentView?: boolean,
) => {
  console.log(documentData, "sdkjsbdjsdbjkskjb");

  if (blockKey !== "client-info") return blockData;

  if (blockData?.content?.trim()) {
    return blockData;
  }

  //   if (isDocumentView && documentData) {
  //     return {
  //       ...blockData,
  //       content: `${documentData.customerBusiness || ""}
  // ${documentData.customerName || ""}
  // ${documentData.customerAddress || ""}
  // ${documentData.customerPincode || ""} ${
  //         documentData.customerLocation || ""
  //       }`.trim(),
  //     };
  //   }
  if (isDocumentView && documentData) {
    return {
      ...blockData,
      content: `
${documentData.customerName || ""}
${documentData.customerAddress || ""}
${documentData.customerPincode || ""} ${
        documentData.customerLocation || ""
      }`.trim(),
    };
  }

  return blockData;
};

// const DropLine = ({ pageId, index, setInsertIndex }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id: `drop-${pageId}-${index}`,
//   });

//   // useEffect(() => {
//   //   if (isOver) {
//   //     setInsertIndex(index);
//   //   }
//   // }, [isOver, index, setInsertIndex]);

//   return (
//     <div
//       ref={setNodeRef}
//       className={`transition-all ${isOver ? "h-2 bg-blue-500 my-2" : "h-1"}`}
//     />
//   );
// };

const DropLine = ({ pageId, index, setInsertIndex }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${pageId}-${index}`,
  });

  useEffect(() => {
    if (isOver) {
      setInsertIndex(index);
    }
  }, [isOver, index, setInsertIndex]);

  return (
    <div
      ref={setNodeRef}
      className={`
        transition-all
        ${isOver ? "h-3 bg-blue-500 my-2" : "h-1"}
        w-full
      `}
    />
  );
};

const EmptyPageDropZone = ({ pageId, setInsertIndex }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `empty-page-${pageId}`,
  });

  useEffect(() => {
    if (isOver) setInsertIndex(0);
  }, [isOver]);

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center
        border-2 border-dashed rounded-lg
        transition-all
        ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        min-h-[300px]`}
    >
      <span className="text-gray-400 text-sm">Drop blocks here</span>
    </div>
  );
};

const SortableBlock = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      animateLayoutChanges: () => false,
      // transition: {
      //   duration: 200,
      //   easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      // },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === "function"
        ? children({ attributes, listeners })
        : children}
    </div>
  );
};

// const SortableBlock = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform } = useSortable({
//     id,
//     animateLayoutChanges: () => false,
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       {children({ attributes, listeners })}
//     </div>
//   );
// };

const TemplateEditor = ({
  selectedBlocks,
  selectedBlockKey,
  onSelectBlock,
  companyInfo,
  blockSettings,
  setBlockSettings,
  templateSettings,
  removeBlock,
  setSelectedBlocks,
  setTemplateSettings,
  handlePreview,
  calculated,
  isDocumentView,
  setPages,
  pages,
  activePageId,
  setActivePageId,
  addSlide,
  removeSlide,
  structure,
  insertIndex,
  documentData,
  blockRefs,
  setInsertIndex,
}: TemplateEditorProps) => {
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { setNodeRef } = useDroppable({
    id: "editor-canvas",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductSelect, setShowProductSelect] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const Row = ({
    label,
    value,
    bold,
  }: {
    label: string;
    value: string;
    bold?: boolean;
  }) => (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={bold ? "font-semibold text-lg" : ""}>{value}</span>
    </div>
  );

  const moveBlockToNextPage = (blockId: string) => {
    const pageIndex = pages?.findIndex((p) => p.id === activePageId);
    if (pageIndex === -1) return;

    const nextPage =
      pages[pageIndex + 1] ||
      (() => {
        const newId = crypto.randomUUID();
        setPages((prev) => [...prev, { id: newId, blocks: [] }]);
        return { id: newId };
      })();

    setPages((prev) =>
      prev.map((p) => {
        if (p.id === activePageId) {
          return { ...p, blocks: p.blocks.filter((id) => id !== blockId) };
        }
        if (p.id === nextPage.id) {
          return { ...p, blocks: [...p.blocks, blockId] };
        }
        return p;
      }),
    );
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const activePage = pages?.find((p) => p.id === activePageId);
  // const visibleBlockIds = activePage
  //   ? activePage.blocks.filter((id) => selectedBlocks.some((b) => b.id === id))
  //   : [];

  const visibleBlockIds = activePage ? activePage.blocks : [];

  const primaryColor = templateSettings?.colors?.primary || "#111827";

  const secondaryColor = templateSettings?.colors?.secondary || "#F3F4F6";

  const bg = activePage?.background;
  console.log(bg, "dsnsdjnsjdnsdkjsd");
  const pageSize = PAGE_SIZES[templateSettings?.pageSize || "A4"];

  const fetchProducts = async (pageNo = 1, category = null) => {
    setLoadingProducts(true);
    try {
      let url = `${PROVIDER.CATELOGUE}/list?page=${pageNo}&limit=50`;
      if (category?.value) url += `&category=${category.value}`;

      const res = await getRequest(url);
      setProducts(res.data.data.catalogues || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingProducts(false);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      ref={setNodeRef}
      className="relative p-3 pt-0 max-h-[calc(100dvh-200px)]"
    >
      <div className="bg-white dark:bg-neutral-800 flex items-center justify-between border-b border-borderlight dark:border-neutral-700 p-3 mb-3">
        <span className="text-lg block dark:text-neutral-100">
          {isDocumentView ? "Éditeur de documents" : "Éditeur de modèles"}
        </span>
        <div className="flex gap-3">
          {!isDocumentView && (
            <>
              {selectedBlocks?.length !== 0 && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePreview()}
                >
                  Aperçu
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className="max-h-[calc(100dvh-200px)] overflow-y-auto"
        data-dnd-scroll-container
      >
        {structure && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
              Page {pages?.findIndex((p) => p.id === activePageId) + 1} /{" "}
              {pages.length}
            </span>

            <Button size="small" variant="outline" onClick={addSlide}>
              <Plus size={16} /> Nouvelle page
            </Button>

            {pages.length > 1 && (
              <Button
                size="small"
                variant="danger"
                onClick={() => removeSlide?.(activePageId!)}
              >
                <Trash2 size={16} /> Remove Page
              </Button>
            )}

            {/* <div className="text-sm font-semibold mb-2 dark:text-neutral-300">Page format</div> */}
            <select
              className="border border-borderlight outline-0 rounded px-3 py-2 text-sm dark:text-neutral-300"
              value={templateSettings.pageSize || "A4"}
              onChange={(e) =>
                setTemplateSettings((prev) => ({
                  ...prev,
                  pageSize: e.target.value as "A4" | "LETTER",
                }))
              }
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="LETTER">Letter (8.5 × 11 in)</option>
            </select>
          </div>
        )}
        <div className="flex gap-2 mb-4">
          {pages?.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              className={`px-3 py-1 rounded text-xs cursor-pointer ${
                p.id === activePageId ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              Page {i + 1}
            </button>
          ))}
        </div>

        <div
          className="relative mx-auto my-4  rounded shadow !w-full"
          style={{
            // width: `${pageSize.width}px`,
            // minHeight: `${pageSize.height}px`,
            backgroundColor: bg?.color || "#ffffff",
            backgroundImage: bg?.image ? `url("${bg.image}")` : "none",
            backgroundSize: bg?.size || "cover",
            backgroundPosition: bg?.position || "center",
            backgroundRepeat: bg?.repeat || "no-repeat",
          }}
        >
          {bg?.image && bg.overlayOpacity ? (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: bg.overlayColor || "#000",
                opacity: bg.overlayOpacity,
              }}
            />
          ) : null}

          <div className="relative z-10 p-6 template-area">
            <SortableContext
              items={visibleBlockIds}
              // strategy={verticalListSortingStrategy}
            >
              {visibleBlockIds.length === 0 ? (
                <EmptyPageDropZone
                  pageId={activePageId}
                  setInsertIndex={setInsertIndex}
                />
              ) : (
                visibleBlockIds.map((blockId, index) => {
                  const block = selectedBlocks.find((b) => b.id === blockId);
                  if (!block) return null;

                  const blockKey = block.key;
                  const data = blockSettings[blockId]?.data || {};

                  if (blockKey === "stubborn-header") {
                    const headerSettings = data || {};

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        {/* DROP BEFORE BLOCK */}
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />

                        {/* BLOCK */}
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg p-4 cursor-pointer mb-4 relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* YOUR EXISTING JSX */}
                                <div className="flex items-start gap-4">
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 p-2 rounded-full"
                                  >
                                    <Trash size={13} />
                                  </button>

                                  {headerSettings.showLogo &&
                                    headerSettings.logoUrl && (
                                      <img
                                        src={headerSettings.logoUrl}
                                        alt="Logo"
                                        className="h-12 object-contain"
                                      />
                                    )}

                                  {headerSettings.showCompany !== false && (
                                    <div className="flex-1 text-sm">
                                      <div className="font-semibold">
                                        {companyInfo.name}
                                      </div>
                                      <div>{companyInfo.addressLine1}</div>
                                      <div>
                                        {companyInfo.postalCode}{" "}
                                        {companyInfo.city}
                                      </div>
                                    </div>
                                  )}

                                  <div className="w-64 flex flex-col gap-2">
                                    <div className="border border-borderlight rounded-md px-4 py-2 flex justify-between items-center text-sm">
                                      <span />
                                      <span className="font-semibold">
                                        {headerSettings.title || "DEVIS"}
                                      </span>
                                    </div>

                                    <div className="border border-borderlight rounded-md px-4 py-2 text-xs text-right text-gray-500">
                                      {headerSettings.subtitle ||
                                        "Proposition commerciale"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "cover-page") {
                    const coverSettings = data || {};
                    const coverFiles = coverSettings.files || [];

                    const handleCoverFilesChange = async (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;

                      setIsCoverUploading(true);

                      const uploaded: {
                        name: string;
                        size: number;
                        url: string;
                      }[] = [];

                      for (const file of files) {
                        try {
                          const res = await uploadFile(file);
                          uploaded.push({
                            name: file.name,
                            size: file.size,
                            url: res.url,
                          });
                        } catch (err) {
                          console.error("PDF upload failed", err);
                        }
                      }

                      setBlockSettings(blockId, (prev: any) => {
                        const prevFiles = prev?.files || [];
                        return {
                          ...prev,
                          files: [...prevFiles, ...uploaded],
                        };
                      });

                      setIsCoverUploading(false);
                      if (coverInputRef.current)
                        coverInputRef.current.value = "";
                    };

                    const handleRemovePdf = (i: number) => {
                      setBlockSettings(blockId, (prev: any) => {
                        const existing = prev?.files || [];
                        const next = existing.filter(
                          (_: any, index: number) => index !== i,
                        );
                        return { ...prev, files: next };
                      });
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        {/* DROP LINE BEFORE */}
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg cursor-pointer mb-4 relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* DRAG HANDLE */}
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  {/* DELETE BUTTON */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  {/* CONTENT */}
                                  <div className="flex-1">
                                    {/* PDF LIST */}
                                    {coverFiles.length > 0 && (
                                      <div className="mb-4 space-y-2">
                                        {coverFiles.map(
                                          (file: any, i: number) => {
                                            const sizeMb = (
                                              file.size /
                                              (1024 * 1024)
                                            ).toFixed(2);

                                            return (
                                              <div
                                                key={i}
                                                className="flex items-center justify-between border border-borderlight rounded-md px-4 py-2"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">
                                                    PDF
                                                  </div>
                                                  <div className="text-sm">
                                                    <div className="font-medium truncate max-w-xs">
                                                      {file.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                      {sizeMb} MB
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs">
                                                  <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                  >
                                                    Voir
                                                  </a>
                                                  <button
                                                    type="button"
                                                    className="text-red-500"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRemovePdf(i);
                                                    }}
                                                  >
                                                    X
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    )}

                                    {/* INPUT */}
                                    <input
                                      ref={coverInputRef}
                                      type="file"
                                      accept="application/pdf"
                                      multiple
                                      className="hidden"
                                      onChange={handleCoverFilesChange}
                                    />

                                    {/* UPLOAD */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCoverClick();
                                      }}
                                      className="w-full"
                                    >
                                      <div className="border-2 border-dashed border-blue-300 rounded-md px-4 py-3 text-center text-sm text-gray-600">
                                        {isCoverUploading ? (
                                          <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                                            <span>
                                              Téléchargement en cours...
                                            </span>
                                          </span>
                                        ) : (
                                          <span>
                                            {coverFiles.length
                                              ? "Ajouter d'autres PDF"
                                              : "Télécharger des PDF"}
                                          </span>
                                        )}
                                      </div>
                                    </button>

                                    <p className="mt-2 text-xs text-gray-500 text-center">
                                      Les PDF seront ajoutés en pièces jointes à
                                      votre document numérique
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "client-info") {
                    const clientSettings = resolveBlockData(
                      "client-info",
                      data || {},
                      documentData,
                      isDocumentView,
                    );
                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* DRAG HANDLE */}
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  {/* DELETE BUTTON */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  {/* CONTENT */}
                                  <div className="flex-1">
                                    {/* TITLE */}
                                    <input
                                      readOnly
                                      className="w-full border border-borderlight rounded px-3 py-2 text-sm font-medium mb-2"
                                      value={clientSettings.title || ""}
                                    />

                                    {/* CONTENT EDITABLE */}
                                    <textarea
                                      rows={6}
                                      className="w-full border border-borderlight rounded-md p-3 text-sm"
                                      value={clientSettings.content || ""}
                                      onChange={(e) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            content: e.target.value,
                                          }),
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "document-object") {
                    const docSettings =
                      data ||
                      ({
                        title: "Objet",
                        value: "{{doc.subject}}",
                      } as any);

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg  mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  {/* DRAG */}
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <input
                                    className="border border-inputborder outline-0 rounded px-3 py-2 text-sm w-40"
                                    value={docSettings.title}
                                    placeholder="Objet"
                                    onChange={(e) =>
                                      setBlockSettings(
                                        blockId,
                                        (prev: any) => ({
                                          ...prev,
                                          title: e.target.value,
                                        }),
                                      )
                                    }
                                  />

                                  <input
                                    className="border border-inputborder outline-0 rounded px-3 py-2 text-sm flex-1"
                                    value={docSettings.value}
                                    placeholder="{{doc.subject}}"
                                    onChange={(e) =>
                                      setBlockSettings(
                                        blockId,
                                        (prev: any) => ({
                                          ...prev,
                                          value: e.target.value,
                                        }),
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "event-date") {
                    const eventSettings = data || {
                      title: "Date et lieu",
                      date: null,
                      location: "",
                      align: "left",
                      variant: "h2",
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* DRAG */}
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  {/* DELETE */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <div className="flex-1 space-y-4">
                                    {/* DATE PICKER */}
                                    <div>
                                      <label className="block text-sm mb-1">
                                        Date
                                      </label>
                                      <CustomDatePicker
                                        placeholderText="Sélectionner une date"
                                        className="!py-2 !rounded !bg-white !text-sm dark:!border-borderlight"
                                        selected={
                                          eventSettings.date
                                            ? new Date(eventSettings.date)
                                            : null
                                        }
                                        onChange={(date: Date | null) =>
                                          setBlockSettings(
                                            blockId,
                                            (prev: any) => ({
                                              ...prev,
                                              date: date
                                                ? date.toISOString()
                                                : null, // ✅ SAVE STRING
                                            }),
                                          )
                                        }
                                      />
                                    </div>

                                    {/* LOCATION */}
                                    <div>
                                      <label className="block text-sm mb-1 ">
                                        Lieu
                                      </label>
                                      <input
                                        className="w-full border border-borderlight rounded px-3 py-2 text-sm"
                                        placeholder="Ex: Paris"
                                        value={eventSettings.location || ""}
                                        onChange={(e) =>
                                          setBlockSettings(
                                            blockId,
                                            (prev: any) => ({
                                              ...prev,
                                              location: e.target.value,
                                            }),
                                          )
                                        }
                                      />
                                    </div>

                                    {/* ALIGN + VARIANT */}
                                    <div className="flex gap-2">
                                      <select
                                        className="border border-borderlight text-sm rounded px-2 py-1 text-sm"
                                        value={eventSettings.align}
                                        onChange={(e) =>
                                          setBlockSettings(
                                            blockId,
                                            (prev: any) => ({
                                              ...prev,
                                              align: e.target.value,
                                            }),
                                          )
                                        }
                                      >
                                        <option value="left">Gauche</option>
                                        <option value="center">Centre</option>
                                        <option value="right">Droite</option>
                                      </select>

                                      <select
                                        className="border border-borderlight rounded px-2 py-1 text-sm"
                                        value={eventSettings.variant}
                                        onChange={(e) =>
                                          setBlockSettings(
                                            blockId,
                                            (prev: any) => ({
                                              ...prev,
                                              variant: e.target.value,
                                            }),
                                          )
                                        }
                                      >
                                        <option value="h1">Titre 1</option>
                                        <option value="h2">Titre 2</option>
                                        <option value="h3">Titre 3</option>
                                        <option value="p">Paragraphe</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "image-block") {
                    const imageSettings = {
                      images: Array.isArray(data?.images)
                        ? data.images
                        : data?.url
                          ? [{ url: data.url, caption: data.caption || "" }]
                          : [],
                      layout: data?.layout || "auto",
                      size: data?.size || "medium",
                    };

                    const updateImageBlock = (patch: any) => {
                      setBlockSettings(blockId, (prev: any) => ({
                        ...prev,
                        ...patch,
                      }));
                    };

                    const addImage = () => {
                      updateImageBlock({
                        images: [
                          ...(imageSettings.images || []),
                          { url: "", caption: "" },
                        ],
                      });
                    };

                    const removeImage = (imgIndex: number) => {
                      updateImageBlock({
                        images: imageSettings.images.filter(
                          (_, i) => i !== imgIndex,
                        ),
                      });

                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          // isPaginatingRef.current = false;
                          // autoPaginate();
                        });
                      });
                    };

                    const updateImage = (
                      index: number,
                      field: string,
                      value: string,
                    ) => {
                      const next = (imageSettings.images || []).map(
                        (img: any, i: number) =>
                          i === index ? { ...img, [field]: value } : img,
                      );
                      updateImageBlock({ images: next });
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg  mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {/* DRAG HANDLE */}
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  {/* DELETE BLOCK */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <div className="w-full">
                                    <div className="font-semibold mb-3">
                                      Image(s)
                                    </div>

                                    {/* IMAGE ITEMS */}
                                    {(imageSettings.images || []).map(
                                      (img: any, i: number) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-3 mb-3 bg-gray-50 p-2 rounded-md place-items-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {/* THUMBNAIL */}
                                          {img.url && (
                                            <img
                                              src={
                                                img.url || "/placeholder.png"
                                              }
                                              className="w-12 h-12 object-cover rounded-md border"
                                            />
                                          )}

                                          {/* URL INPUT */}
                                          <input
                                            placeholder="URL de l'image"
                                            className="border border-inputborder dark:border-inputdarkborder outline-0 rounded px-3 py-2 text-sm flex-1"
                                            value={img.url}
                                            onChange={(e) =>
                                              updateImage(
                                                i,
                                                "url",
                                                e.target.value,
                                              )
                                            }
                                          />

                                          {/* CAPTION */}
                                          <input
                                            placeholder="Légende (optionnel)"
                                            className="border border-inputborder dark:border-inputdarkborder outline-0 rounded px-3 py-2 text-sm flex-1"
                                            value={img.caption}
                                            onChange={(e) =>
                                              updateImage(
                                                i,
                                                "caption",
                                                e.target.value,
                                              )
                                            }
                                          />

                                          {/* REMOVE IMAGE */}
                                          <button
                                            className="text-red-500"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeImage(i);
                                            }}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ),
                                    )}

                                    {/* ADD IMAGE BUTTON */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addImage();
                                      }}
                                      className="bg-lightbg border border-borderlight dark:border-inputdarkborder outline-0 px-4 py-2 rounded-md text-sm flex items-center gap-2 mt-3 mb-5 cursor-pointer"
                                    >
                                      <Trash2 size={16} /> Ajouter une image
                                    </button>

                                    {/* OPTIONS ROW */}
                                    <div className="grid grid-cols-2 gap-4">
                                      {/* LAYOUT */}
                                      <div>
                                        <label className="text-sm block mb-1">
                                          Disposition
                                        </label>
                                        <select
                                          className="border border-borderlight text-sm"
                                          value={imageSettings.layout}
                                          onChange={(e) => {
                                            updateImageBlock({
                                              layout: e.target.value,
                                            });

                                            requestAnimationFrame(() => {
                                              requestAnimationFrame(() => {
                                                // isPaginatingRef.current = false;
                                                // autoPaginate();
                                              });
                                            });
                                          }}
                                        >
                                          <option value="single">
                                            Image seule
                                          </option>
                                          <option value="grid-2">
                                            Grille 2 colonnes
                                          </option>
                                          <option value="grid-3">
                                            Grille 3 colonnes
                                          </option>
                                        </select>
                                      </div>

                                      {/* SIZE */}
                                      <div>
                                        <label className="text-sm block mb-1">
                                          Taille
                                        </label>
                                        <select
                                          value={imageSettings.size}
                                          className="border border-borderlight  dark:border-inputdarkborder outline-0 rounded-md w-full px-2 py-2 text-sm"
                                          onChange={(e) =>
                                            updateImageBlock({
                                              size: e.target.value,
                                            })
                                          }
                                        >
                                          <option value="small">Petite</option>
                                          <option value="medium">
                                            Moyenne
                                          </option>
                                          <option value="large">Grande</option>
                                          <option value="full">
                                            Pleine largeur
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "article-table") {
                    const table = data || {
                      sections: [
                        {
                          id: Date.now(),
                          title: "Nouvelle section",
                          items: [],
                        },
                      ],
                    };

                    const productOptions = products.map((p: any) => ({
                      value: p.id,
                      label: `${p.name} – ${p.unitPrice} €`,
                    }));

                    const updateTable = (next: any) => {
                      setBlockSettings(blockId, (prev: any) => ({
                        ...prev,
                        ...next,
                      }));
                    };

                    const addSection = () => {
                      updateTable({
                        sections: [
                          ...table.sections,
                          {
                            id: Date.now(),
                            title: "Nouvelle section",
                            items: [],
                          },
                        ],
                      });
                    };

                    // const addCatalogueItem = (
                    //   sectionId: number,
                    //   product?: any,
                    // ) => {
                    //   if (!product) return;

                    //   updateTable({
                    //     sections: table.sections.map((s: any) =>
                    //       s.id === sectionId
                    //         ? {
                    //             ...s,
                    //             items: [
                    //               ...s.items,
                    //               {
                    //                 id: Date.now(),
                    //                 productId: product.id,
                    //                 image: product.imageUrl,
                    //                 name: product.name,
                    //                 description: product.description,
                    //                 qty: 1,
                    //                 unit:
                    //                   product.servings > 1
                    //                     ? "personne"
                    //                     : "unité",
                    //                 price: Number(product.unitPrice),
                    //                 discount: 0,
                    //                 vatRate: product.vatRate,
                    //               },
                    //             ],
                    //           }
                    //         : s,
                    //     ),
                    //   });

                    //   // reset select
                    //   setSelectedProduct(null);
                    //   setShowProductSelect(false);
                    // };

                    // const addItem = (sid: number) => {
                    //   updateTable({
                    //     sections: table.sections.map((s: any) =>
                    //       s.id === sid
                    //         ? {
                    //             ...s,
                    //             items: [
                    //               ...s.items,
                    //               {
                    //                 id: Date.now(),
                    //                 description: "",
                    //                 qty: 1,
                    //                 unit: "unité",
                    //                 price: 0,
                    //                 discount: 0,
                    //               },
                    //             ],
                    //           }
                    //         : s,
                    //     ),
                    //   });
                    // };

                    const addCatalogueItem = (
                      sectionId: number,
                      product?: any,
                    ) => {
                      if (!product) return;

                      updateTable({
                        sections: table.sections.map((s: any) =>
                          s.id === sectionId
                            ? {
                                ...s,
                                items: [
                                  ...s.items,
                                  {
                                    id: Date.now(),
                                    isManual: false,
                                    productId: product.id,
                                    image: product.imageUrl,
                                    name: product.name,
                                    description: product.description,
                                    qty: 1,
                                    unit:
                                      product.servings > 1
                                        ? "personne"
                                        : "unité",
                                    price: Number(product.unitPrice),
                                    discount: 0,
                                    vatRate: product.vatRate,
                                  },
                                ],
                              }
                            : s,
                        ),
                      });

                      setSelectedProduct(null);
                      setShowProductSelect(false);
                    };

                    const addItem = (sid: number) => {
                      updateTable({
                        sections: table.sections.map((s: any) =>
                          s.id === sid
                            ? {
                                ...s,
                                items: [
                                  ...s.items,
                                  {
                                    id: Date.now(),
                                    isManual: true,
                                    name: "",
                                    description: "",
                                    qty: 1,
                                    unit: "unité",
                                    price: 0,
                                    discount: 0,
                                  },
                                ],
                              }
                            : s,
                        ),
                      });
                    };

                    const updateItem = (
                      sid: number,
                      iid: number,
                      field: string,
                      value: any,
                    ) => {
                      updateTable({
                        sections: table.sections.map((s: any) =>
                          s.id === sid
                            ? {
                                ...s,
                                items: s.items.map((i: any) =>
                                  i.id === iid ? { ...i, [field]: value } : i,
                                ),
                              }
                            : s,
                        ),
                      });
                    };

                    const removeItem = (sid: number, iid: number) => {
                      updateTable({
                        sections: table.sections.map((s: any) =>
                          s.id === sid
                            ? {
                                ...s,
                                items: s.items.filter((i: any) => i.id !== iid),
                              }
                            : s,
                        ),
                      });
                    };

                    const removeSection = (id: number) => {
                      updateTable({
                        sections: table.sections.filter(
                          (s: any) => s.id !== id,
                        ),
                      });
                    };

                    const updateSectionTitle = (id: number, value: string) => {
                      updateTable({
                        sections: table.sections.map((s: any) =>
                          s.id === id ? { ...s, title: value } : s,
                        ),
                      });
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />

                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* DRAG */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 text-red-500 rounded-full p-2"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* HEADER */}
                                <div
                                  className="grid grid-cols-7 bg-gray-900 text-white text-sm px-3 py-2 rounded-md"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <div>Produit</div>
                                  <div>Description</div>
                                  <div>Qté</div>
                                  <div>Unité</div>
                                  <div>P.U. HT</div>
                                  <div>Remise %</div>
                                  <div>Total HT</div>
                                </div>

                                {/* SECTIONS */}
                                {table.sections.map((section: any) => (
                                  <div
                                    key={section.id}
                                    className="mt-3 space-y-3"
                                  >
                                    <div className="flex gap-2 items-center">
                                      <input
                                        className="border border-borderlight rounded w-full px-3 py-2 text-sm"
                                        value={section.title}
                                        onChange={(e) =>
                                          updateSectionTitle(
                                            section.id,
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <Trash
                                        size={16}
                                        className="text-red-500 cursor-pointer"
                                        onClick={() =>
                                          removeSection(section.id)
                                        }
                                      />
                                    </div>

                                    {section.items.map((item: any) => {
                                      const total =
                                        Number(item.qty) *
                                        Number(item.price) *
                                        (1 - Number(item.discount || 0) / 100);

                                      return (
                                        <div
                                          key={item.id}
                                          className="grid grid-cols-7 gap-3 items-center pb-3"
                                        >
                                          <div className="flex flex-col gap-1">
                                            {item.image && (
                                              <img
                                                src={item.image}
                                                className="w-full h-12 rounded object-cover"
                                              />
                                            )}
                                            <div>
                                              {item.isManual ? (
                                                <input
                                                  className="border border-borderlight rounded px-2 py-1 text-sm w-full"
                                                  placeholder="Nom du produit"
                                                  value={item.name}
                                                  onChange={(e) =>
                                                    updateItem(
                                                      section.id,
                                                      item.id,
                                                      "name",
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <div className="text-sm">
                                                  {item.name}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          {item.isManual ? (
                                            <textarea
                                              rows={2}
                                              className="border border-borderlight rounded p-2 text-sm"
                                              value={item.description || ""}
                                              onChange={(e) =>
                                                updateItem(
                                                  section.id,
                                                  item.id,
                                                  "description",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          ) : (
                                            <textarea
                                              rows={2}
                                              className="border border-borderlight rounded p-2 text-sm"
                                              value={item.description || ""}
                                              onChange={(e) =>
                                                updateItem(
                                                  section.id,
                                                  item.id,
                                                  "description",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          )}

                                          {/* <input
                                            type="number"
                                            className="border border-borderlight rounded px-2 py-1 text-sm"
                                            value={item.qty}
                                            onChange={(e) =>
                                              updateItem(
                                                section.id,
                                                item.id,
                                                "qty",
                                                Number(e.target.value),
                                              )
                                            }
                                          /> */}

                                          {/* <input
                                            type="number"
                                            className="border border-borderlight rounded px-2 py-1 text-sm"
                                            value={item.price}
                                            disabled={!item.isManual}
                                            onChange={(e) =>
                                              updateItem(
                                                section.id,
                                                item.id,
                                                "price",
                                                Number(e.target.value),
                                              )
                                            }
                                          /> */}

                                          <select
                                            className="border border-borderlight rounded px-2 py-1 text-sm"
                                            value={item.unit}
                                            onChange={(e) =>
                                              updateItem(
                                                section.id,
                                                item.id,
                                                "unit",
                                                e.target.value,
                                              )
                                            }
                                          >
                                            <option>unité</option>
                                            <option>heure</option>
                                            <option>jour</option>
                                            <option>personne</option>
                                            <option>forfait</option>
                                          </select>

                                          <input
                                            type="number"
                                            className="border border-borderlight rounded px-2 py-1 text-sm"
                                            value={item.price}
                                            onChange={(e) =>
                                              updateItem(
                                                section.id,
                                                item.id,
                                                "price",
                                                Number(e.target.value),
                                              )
                                            }
                                          />

                                          <input
                                            type="number"
                                            className="border border-borderlight rounded px-2 py-1 text-sm"
                                            value={item.discount}
                                            onChange={(e) =>
                                              updateItem(
                                                section.id,
                                                item.id,
                                                "discount",
                                                Number(e.target.value),
                                              )
                                            }
                                          />

                                          <div className="text-right text-sm">
                                            {total.toFixed(2)} €
                                          </div>

                                          <Trash
                                            size={14}
                                            className="text-red-500 cursor-pointer"
                                            onClick={() =>
                                              removeItem(section.id, item.id)
                                            }
                                          />
                                        </div>
                                      );
                                    })}
                                    {showProductSelect && (
                                      <div className="mt-3">
                                        <CustomSelect
                                          options={productOptions}
                                          value={selectedProduct}
                                          className="dark:!bg-white"
                                          placeholder="Sélectionner un produit du catalogue"
                                          onChange={(opt: any) => {
                                            setSelectedProduct(opt);

                                            const product = products.find(
                                              (p: any) => p.id === opt?.value,
                                            );

                                            addCatalogueItem(
                                              section.id,
                                              product,
                                            );
                                          }}
                                        />
                                      </div>
                                    )}
                                    {/* <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowProductSelect((prev) => !prev);
                                      }}
                                      className="w-full flex justify-center transition-all bg-gray-200 hover:bg-gray-300 rounded p-2 text-sm cursor-pointer"
                                    >
                                      <PlusIcon size={18} /> Ajouter un article
                                      manuel
                                    </button> */}
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowProductSelect(true)
                                        }
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 rounded p-2 text-sm"
                                      >
                                        📦 Ajouter depuis le catalogue
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => addItem(section.id)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 rounded p-2 text-sm"
                                      >
                                        ✍️ Ajouter un article manuel
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={addSection}
                                  className="mt-4 bg-secondary text-white px-3 py-2 text-sm rounded-lg"
                                >
                                  + Ajouter une section
                                </button>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "totals-block") {
                    const totals =
                      data ||
                      ({
                        vat: 20,
                        downPayment: 30,
                        subtotal: 0,
                      } as any);

                    const vat = Number(totals.vat || 0);
                    console.log(vat, "sdsdsdmskdss", totals);
                    const downPayment = Number(totals.downPayment || 0);

                    const calculatedData = calculated || {};

                    const subtotal = calculatedData.preTaxAmount || 0;
                    const vatRate = Number(totals.vat || 20);

                    const vatAmount = (subtotal * vatRate) / 100;
                    const totalTTC = subtotal + vatAmount;
                    const advance = calculatedData.minPayableAmount || 0;

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-6 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                >
                                  <Trash size={14} />
                                </button>

                                <div className="space-y-3 text-sm max-w-xs ml-auto">
                                  <Row
                                    label="Total HT"
                                    value={`${subtotal.toFixed(2)} €`}
                                  />

                                  <Row
                                    label={`TVA (${vat}%)`}
                                    value={`${vatAmount.toFixed(2)} €`}
                                  />

                                  <hr />

                                  <Row
                                    label="Total TTC"
                                    value={`${totalTTC.toFixed(2)} €`}
                                    bold
                                  />

                                  <Row
                                    label={`Acompte (${downPayment}%)`}
                                    value={`${advance.toFixed(2)} €`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "banking-info") {
                    const banking = data || {
                      title: "Informations de paiement",
                      bankName: "",
                      accountHolder: "",
                      iban: "",
                      bic: "",
                      conditions: "",
                    };

                    const updateBanking = (patch: any) => {
                      setBlockSettings(blockId, (prev: any) => ({
                        ...prev,
                        ...patch,
                      }));
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* DRAG */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE BLOCK */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* SECTION TITLE */}
                                <input
                                  className="w-full border border-inputborder  outline-0 rounded px-3 py-2 mb-4 font-medium"
                                  value={banking.title}
                                  onChange={(e) =>
                                    updateBanking({ title: e.target.value })
                                  }
                                />

                                {/* BANK NAME & ACCOUNT HOLDER */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm mb-1">
                                      Nom de la banque
                                    </label>
                                    <input
                                      className="w-full border border-inputborder  outline-0 rounded px-3 py-2"
                                      value={banking.bankName}
                                      placeholder="Ex: BNP Paribas"
                                      onChange={(e) =>
                                        updateBanking({
                                          bankName: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm mb-1">
                                      Titulaire du compte
                                    </label>
                                    <input
                                      className="w-full border border-inputborder outline-0 rounded px-3 py-2"
                                      value={banking.accountHolder}
                                      placeholder="Nom du titulaire"
                                      onChange={(e) =>
                                        updateBanking({
                                          accountHolder: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                {/* IBAN */}
                                <div className="mb-4">
                                  <label className="block text-sm mb-1">
                                    IBAN
                                  </label>
                                  <input
                                    className="w-full border border-inputborder  outline-0 rounded px-3 py-2"
                                    value={banking.iban}
                                    onChange={(e) =>
                                      updateBanking({
                                        iban: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                {/* BIC / SWIFT */}
                                <div className="mb-4">
                                  <label className="block text-sm mb-1">
                                    BIC/SWIFT
                                  </label>
                                  <input
                                    className="w-full border border-inputborder  outline-0 rounded px-3 py-2"
                                    value={banking.bic}
                                    onChange={(e) =>
                                      updateBanking({ bic: e.target.value })
                                    }
                                  />
                                </div>

                                {/* CONDITIONS */}
                                <div>
                                  <label className="block text-sm mb-1">
                                    Conditions de paiement
                                  </label>
                                  <textarea
                                    className="w-full border border-inputborder  outline-0 rounded px-3 py-2 h-24"
                                    value={banking.conditions}
                                    onChange={(e) =>
                                      updateBanking({
                                        conditions: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }
                  if (blockKey === "terms-cgv") {
                    const terms = data || {};

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-6 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* DRAG HANDLE */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* TITLE */}
                                <input
                                  className="w-full border border-inputborder  outline-0 rounded px-3 py-2 mb-4 text-sm"
                                  placeholder="Titre (par exemple : Conditions générales de vente)"
                                  value={terms.title || ""}
                                  onChange={(e) =>
                                    setBlockSettings(blockId, (prev: any) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                />

                                {/* CONTENT */}
                                <textarea
                                  rows={8}
                                  placeholder="Saisissez ici vos conditions générales de vente…"
                                  className="border border-inputborder  outline-0 rounded px-3 py-2 text-sm w-full resize-y"
                                  value={terms.content || ""}
                                  onChange={(e) =>
                                    setBlockSettings(blockId, (prev: any) => ({
                                      ...prev,
                                      content: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "signature-block") {
                    const s = data || {};
                    const height = Number(s.boxHeight) || 80;

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* DRAG */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* TITLE */}
                                {s.title && (
                                  <p className="text-sm text-gray-700 mb-2">
                                    {s.title}
                                  </p>
                                )}

                                {/* PLACEHOLDER ONLY */}
                                <div
                                  className="border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center text-xs text-gray-400"
                                  style={{ height }}
                                >
                                  Zone de signature (visible en aperçu)
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "footer-block") {
                    const footer = data || {};

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white  rounded-lg  mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-6 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 cursor-pointer"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* TOP LINE */}
                                <div className="border-t border-gray-300 mb-4"></div>

                                {/* TITLE */}
                                <div className="font-medium text-sm mb-3">
                                  Pied de page
                                </div>

                                {/* CHECKBOXES */}
                                <div className="space-y-2 mb-4 text-sm">
                                  {/* Company Info */}
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={!!footer.showCompanyInfo}
                                      onChange={(e) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            showCompanyInfo: e.target.checked,
                                          }),
                                        )
                                      }
                                    />
                                    <span>
                                      Afficher les coordonnées de l'entreprise
                                    </span>
                                  </label>

                                  {/* Legal Notice */}
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={!!footer.showLegalNotice}
                                      onChange={(e) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            showLegalNotice: e.target.checked,
                                          }),
                                        )
                                      }
                                    />
                                    <span>Afficher les mentions légales</span>
                                  </label>
                                </div>

                                {/* CUSTOM TEXT AREA */}
                                <div className="text-sm font-medium mb-1">
                                  Texte personnalisé (optionnel)
                                </div>

                                <textarea
                                  rows={4}
                                  className="border border-inputborder dark:border-inputdarkborder outline-0 rounded-md w-full p-3 text-sm"
                                  placeholder="Ajoutez un texte personnalisé pour le pied de page..."
                                  value={footer.customText || ""}
                                  onChange={(e) =>
                                    setBlockSettings(blockId, (prev: any) => ({
                                      ...prev,
                                      customText: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }
                  if (blockKey === "slide-title") {
                    const slide = data || { text: "", align: "center" };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 rounded-full p-2"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <div className="flex-1">
                                    <ReactQuill
                                      theme="snow"
                                      value={slide.text}
                                      modules={quillModules}
                                      formats={quillFormats}
                                      onChange={(value) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            text: value,
                                          }),
                                        )
                                      }
                                      placeholder="Slide title"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "slide-subtitle") {
                    const slide = data || { text: "" };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div className="border border-borderlight rounded-md p-4">
                                <div className="flex items-start gap-4">
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 rounded-full p-2"
                                  >
                                    <Trash size={14} />
                                  </button>
                                  <div className="flex-1">
                                    <ReactQuill
                                      theme="snow"
                                      value={slide.text}
                                      modules={quillModules}
                                      formats={quillFormats}
                                      onChange={(value) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            text: value,
                                          }),
                                        )
                                      }
                                      placeholder="Subtitle text"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }
                  if (blockKey === "slide-image") {
                    const imageSettings = {
                      images: Array.isArray(data?.images) ? data.images : [],
                      size: data?.size || "medium",
                      layout: data?.layout || "auto", // auto | 1 | 2 | 3 | masonry | hero-left | hero-right
                    };

                    const updateImageBlock = (patch: any) => {
                      setBlockSettings(blockId, (prev: any) => ({
                        ...prev,
                        ...patch,
                      }));
                    };

                    const addImage = () => {
                      updateImageBlock({
                        images: [
                          ...imageSettings.images,
                          { url: "", caption: "" },
                        ],
                      });

                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {});
                      });
                    };

                    const removeImage = (imgIndex: number) => {
                      updateImageBlock({
                        images: imageSettings.images.filter(
                          (_, i) => i !== imgIndex,
                        ),
                      });
                    };

                    const updateImage = (
                      imgIndex: number,
                      field: string,
                      value: string,
                    ) => {
                      updateImageBlock({
                        images: imageSettings.images.map((img, i) =>
                          i === imgIndex ? { ...img, [field]: value } : img,
                        ),
                      });
                    };

                    /** 🔁 REORDER */
                    const moveImage = (from: number, to: number) => {
                      if (to < 0 || to >= imageSettings.images.length) return;
                      const next = [...imageSettings.images];
                      const [item] = next.splice(from, 1);
                      next.splice(to, 0, item);
                      updateImageBlock({ images: next });
                    };

                    const handleUpload = async (
                      files: File[],
                      imgIndex: number,
                    ) => {
                      if (!files.length) return;

                      try {
                        setUploadingIndex(imgIndex);
                        const res = await uploadFile(files[0]);

                        updateImageBlock({
                          images: imageSettings.images.map((img, i) =>
                            i === imgIndex ? { ...img, url: res.url } : img,
                          ),
                        });
                      } finally {
                        setUploadingIndex(null);
                      }
                    };

                    const renderImageItem = (img: any, imgIndex: number) => {
                      const inputId = `img-upload-${blockId}-${imgIndex}`;

                      return (
                        <div
                          key={imgIndex}
                          className="bg-gray-50 p-3 rounded-md space-y-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* IMAGE / UPLOAD */}
                          {img.url ? (
                            <div
                              className="relative cursor-pointer aspect-video"
                              onClick={() =>
                                document.getElementById(inputId)?.click()
                              }
                            >
                              <img
                                src={img.url}
                                className="w-full h-full object-cover rounded-md"
                              />

                              <input
                                id={inputId}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpload([file], imgIndex);
                                }}
                              />

                              {uploadingIndex === imgIndex && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                                  Uploading…
                                </div>
                              )}
                            </div>
                          ) : (
                            <FileDropzone
                              value={[]}
                              onChange={(files) =>
                                handleUpload(files, imgIndex)
                              }
                              accept={{ "image/*": [] }}
                              maxFiles={1}
                            />
                          )}

                          {/* CAPTION */}
                          <input
                            placeholder="Légende (facultatif)"
                            className="w-full border border-borderlight rounded px-3 py-2 text-sm"
                            value={img.caption || ""}
                            onChange={(e) =>
                              updateImage(imgIndex, "caption", e.target.value)
                            }
                          />

                          {/* ACTIONS */}
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex gap-2">
                              <button
                                disabled={imgIndex === 0}
                                onClick={() =>
                                  moveImage(imgIndex, imgIndex - 1)
                                }
                                className="border px-2 py-1 rounded disabled:opacity-40"
                              >
                                ↑
                              </button>
                              <button
                                disabled={
                                  imgIndex === imageSettings.images.length - 1
                                }
                                onClick={() =>
                                  moveImage(imgIndex, imgIndex + 1)
                                }
                                className="border px-2 py-1 rounded disabled:opacity-40"
                              >
                                ↓
                              </button>
                            </div>

                            <button
                              onClick={() => removeImage(imgIndex)}
                              className="text-red-500"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    };

                    const layoutClassMap: Record<string, string> = {
                      auto: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                      "1": "grid grid-cols-1 gap-4",
                      "2": "grid grid-cols-2 gap-4",
                      "3": "grid grid-cols-3 gap-4",
                      masonry:
                        "grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max",
                      "hero-left": "grid gap-4",
                      "hero-right": "grid gap-4",
                    };

                    const notifyLayoutChange = () => {
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          // autoPaginate();
                        });
                      });
                    };
                    const sizeClass =
                      imageSettings.size === "small"
                        ? "max-w-sm"
                        : imageSettings.size === "medium"
                          ? "max-w-md"
                          : imageSettings.size === "large"
                            ? "max-w-lg"
                            : "w-full";

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />

                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 relative"
                            >
                              <div
                                className={`border rounded-md p-4 ${
                                  selectedBlockKey === blockId
                                    ? "border-blue-400"
                                    : "border-borderlight"
                                }`}
                              >
                                {/* DRAG */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="text-xs text-gray-400 cursor-move"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 p-2 rounded-full"
                                >
                                  <Trash size={14} />
                                </button>

                                <div className="font-semibold mb-3">Images</div>

                                {/* IMAGES */}
                                <div className="w-full">
                                  <div
                                    className={
                                      layoutClassMap[imageSettings.layout] ||
                                      "grid grid-cols-1 gap-4 w-full"
                                    }
                                    style={
                                      imageSettings.layout === "hero-left"
                                        ? { gridTemplateColumns: "2fr 1fr" }
                                        : imageSettings.layout === "hero-right"
                                          ? { gridTemplateColumns: "1fr 2fr" }
                                          : undefined
                                    }
                                  >
                                    {imageSettings.images.map(
                                      (img, imgIndex) =>
                                        imageSettings.layout === "masonry" ? (
                                          <div
                                            key={imgIndex}
                                            className="break-inside-avoid mb-4"
                                          >
                                            {renderImageItem(img, imgIndex)}
                                          </div>
                                        ) : (
                                          renderImageItem(img, imgIndex)
                                        ),
                                    )}
                                  </div>
                                </div>

                                {/* ADD IMAGE */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addImage();
                                  }}
                                  className="flex items-center gap-1 transition-all duration-300 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm cursor-pointer mt-3"
                                >
                                  <PlusIcon size={18} /> Ajouter une image
                                </button>

                                {/* SETTINGS */}
                                <div className="grid grid-cols-1 gap-4 mt-4">
                                  <div>
                                    <label className="text-sm block mb-1">
                                      Mise en page
                                    </label>
                                    <select
                                      className="border border-borderlight outline-0 text-sm px-3 py-2 rounded-md w-full"
                                      value={imageSettings.layout}
                                      onChange={(e) => {
                                        updateImageBlock({
                                          layout: e.target.value,
                                        });
                                        // notifyLayoutChange();
                                      }}
                                    >
                                      <option value="auto">Auto</option>
                                      <option value="1">1 colonne</option>
                                      <option value="2">2 colonnes</option>
                                      <option value="3">3 colonnes</option>
                                      <option value="masonry">Mosaïque</option>
                                      <option value="hero-left">
                                        Couverture à gauche
                                      </option>
                                      <option value="hero-right">
                                        Couverture à droite
                                      </option>
                                    </select>
                                  </div>

                                  {/* <div>
                                  <label className="text-sm block mb-1">
                                    Size
                                  </label>
                                  <select
                                    value={imageSettings.size}
                                    className="border border-borderlight outline-0 text-sm px-3 py-2 rounded-md w-full"
                                    onChange={(e) =>
                                      updateImageBlock({ size: e.target.value })
                                    }
                                  >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="full">Full width</option>
                                  </select>
                                </div> */}
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                      </div>
                    );
                  }

                  if (blockKey === "slide-two-column") {
                    const slide = data || { left: "", right: "" };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div className="border border-borderlight rounded-md p-4">
                                <div className="flex items-start gap-4">
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 rounded-full p-2"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 w-full">
                                    <ReactQuill
                                      className="auto-height-quill"
                                      theme="snow"
                                      value={slide.left}
                                      modules={quillModules}
                                      formats={quillFormats}
                                      onChange={(value) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            left: value,
                                          }),
                                        )
                                      }
                                      placeholder="Colonne de gauche"
                                    />

                                    <ReactQuill
                                      className="auto-height-quill"
                                      theme="snow"
                                      value={slide.right}
                                      modules={quillModules}
                                      formats={quillFormats}
                                      onChange={(value) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            right: value,
                                          }),
                                        )
                                      }
                                      placeholder="Colonne de droite"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "slide-text") {
                    const slide = data || { text: "" };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />
                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div className="rounded-md p-4">
                                <div className="flex items-start gap-4">
                                  <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-xs text-gray-400 cursor-move mt-1 w-fit"
                                  >
                                    &#9776;
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBlock(blockId);
                                    }}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 
                                  rounded-full p-2"
                                  >
                                    <Trash size={14} />
                                  </button>

                                  <div className="flex-1">
                                    <ReactQuill
                                      theme="snow"
                                      value={slide.text}
                                      modules={quillModules}
                                      formats={quillFormats}
                                      onChange={(value) =>
                                        setBlockSettings(
                                          blockId,
                                          (prev: any) => ({
                                            ...prev,
                                            text: value,
                                          }),
                                        )
                                      }
                                      placeholder="Add slide content…"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  if (blockKey === "hero-image") {
                    const hero = data || { image: "", height: "100vh" };

                    const update = (patch: any) =>
                      setBlockSettings(blockId, (prev: any) => ({
                        ...prev,
                        ...patch,
                      }));

                    const handleUpload = async (files: File[]) => {
                      if (!files.length) return;
                      const res = await uploadFile(files[0]);
                      update({ image: res.url });
                    };

                    return (
                      <div
                        key={blockId}
                        ref={(el) => (blockRefs.current[blockId] = el)}
                      >
                        <DropLine
                          pageId={activePageId}
                          index={index}
                          setInsertIndex={setInsertIndex}
                        />

                        <SortableBlock id={blockId}>
                          {({ attributes, listeners }) => (
                            <div
                              onClick={() => onSelectBlock(blockId)}
                              className="bg-white rounded-lg mb-4 cursor-pointer relative"
                            >
                              <div className="border border-light rounded-md p-4">
                                {/* DRAG */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="cursor-move text-xs"
                                >
                                  &#9776;
                                </div>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeBlock(blockId);
                                  }}
                                  className="absolute top-2 right-2 bg-red-100 p-2 text-red-500 rounded-full"
                                >
                                  <Trash size={14} />
                                </button>

                                {/* UPLOAD / PREVIEW */}
                                {!hero.image ? (
                                  <FileDropzone
                                    value={[]}
                                    onChange={handleUpload}
                                    accept={{ "image/*": [] }}
                                    maxFiles={1}
                                    dropLabel="Téléverser l’image principale"
                                  />
                                ) : (
                                  <img
                                    src={hero.image}
                                    className="w-full h-64 object-cover rounded-lg"
                                  />
                                )}

                                {/* HEIGHT */}
                                <div className="mt-3">
                                  <label className="text-sm block mb-1">
                                    Hauteur
                                  </label>
                                  <input
                                    value={hero.height}
                                    onChange={(e) =>
                                      update({ height: e.target.value })
                                    }
                                    className="border border-borderlight outline-0 rounded px-3 py-2 text-sm w-full"
                                    placeholder="100vh or 600px"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableBlock>
                      </div>
                    );
                  }

                  return null;
                })
              )}
            </SortableContext>

            {/* DROP AFTER LAST BLOCK */}
            <DropLine
              index={visibleBlockIds.length}
              pageId={activePageId}
              setInsertIndex={setInsertIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
