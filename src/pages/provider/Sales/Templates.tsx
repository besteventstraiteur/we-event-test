import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Copy,
  EllipsisVertical,
  Eye,
  File,
  FileStack,
  FileText,
  Filter,
  Pencil,
  Star,
  Table,
  Trash,
  X,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Globaltabs from "./Globaltabs";
import Staticscard from "./Statics-card";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Eventthumb from "../../../assets/images/event.webp";
import { uploadFile } from "../../../utils/uploadfile";
import FileDropzone from "../../../components/imageUpload";
import OuterModal from "../../../components/Custommodal/OuterModal";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";

const priority = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Critical" },
];
const templateSchema = Yup.object().shape({
  name: Yup.string().required("Model name is required"),
  type: Yup.string().required("Document type is required"),
  structure: Yup.string().required("Structure selection required"),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
});
const documentTypes = [
  { value: "devis", label: "Devis" },
  { value: "invoice", label: "Facture" },
  { value: "purchase-order", label: "Bon de commande" },
  { value: "delivery-note", label: "Bon de livraison" },
  { value: "credit-note", label: "Avoir" },
];

const structures = [
  { value: "basic", label: "Esthétique" },
  { value: "articles", label: "Avec articles" },
];

const Templates = () => {
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(templateSchema),
    defaultValues: {
      name: "",
      type: "",
      structure: "",
      isDefault: false,
      thumbnail: null,
    },
  });
  // Thumbnail state (for FileDropzone)
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [priorityValue, setPriorityValue] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [createDocModal, setCreateDocModal] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [selectedTemplateForDoc, setSelectedTemplateForDoc] =
    useState<any>(null);

  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getRequest(`${PROVIDER.TEMPLATE}?page=1&limit=10`);

      const list = res?.data?.data?.data || [];

      setTemplates(list);
    } catch (err: any) {
      console.error("Failed to fetch templates:", err);
      setError("Impossible de charger les modèles. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await getRequest(`${PROVIDER.GET_CONTACTS}?page=1&limit=50`);

      setContacts(res?.data?.data?.records || []);
    } catch (err) {
      console.error("Failed to fetch contacts →", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplate = async (id: number) => {
    try {
      setLoading(true);

      const res = await getRequest(`${PROVIDER.TEMPLATE}/${id}`);
      const tpl = res?.data?.data;

      if (!tpl) {
        setLoading(false);
        return;
      }

      // Store template data for document creation
      setSelectedTemplateForDoc(tpl);
    } catch (err) {
      console.error("Failed to fetch template →", err);
    } finally {
      setLoading(false);
    }
  };

  const toast = useToast();
  const onSubmit = async (data: any) => {
    setBtnloading(true);
    let uploadedThumbnail = "";

    if (thumbnailFiles.length > 0) {
      const uploaded = await uploadFile(thumbnailFiles[0]);
      uploadedThumbnail = uploaded.url;
    }

    const uid = () => Math.random().toString(36).substring(2, 10);

    const blocks: string[] = [];
    const blockSettings: Record<string, any> = {};

    const add = (blockKey: string, settings: any = {}) => {
      const id = uid();
      blocks.push(id);
      blockSettings[id] = {
        blockKey,
        ...settings,
      };
    };

    if (data.structure === "basic") {
      add("hero-image", {
        data: {
          image: "",
          height: "100vh",
        },
      });

      add("big-title", {
        data: {
          text: "VOTRE DEVIS TRAITEUR",
          subtitle: "Mariage 2025 / 2026",
        },
      });

      add("image-gallery", {
        data: {
          images: [],
          columns: 3,
        },
      });

      add("testimonials", {
        data: {
          items: [
            { name: "Camille & Julien", text: "" },
            { name: "Élodie & Thomas", text: "" },
          ],
        },
      });

      add("features", {
        data: {
          items: [
            { title: "Vaisselle & verrerie", image: "" },
            { title: "Produits frais", image: "" },
          ],
        },
      });
    }

    add("stubborn-header", {
      data: {
        showLogo: true,
        showCompany: true,
        title: "DEVIS",
        subtitle: "Proposition commerciale",
      },
    });

    add("client-info", {
      data: {
        title: "Adresse de facturation",
        content: `{{client.name}}
{{client.address}}
{{client.zip}} {{client.city}}`,
      },
    });

    add("document-object", {
      data: {
        title: "Objet",
        value: "{{doc.subject}}",
      },
    });

    add("event-date", {
      data: {
        content: "{{event.date}} à {{event.location}}",
        align: "left",
        variant: "h2",
      },
    });

    add("image-block", {
      data: {
        images: [],
        layout: "single",
        size: "medium",
      },
    });

    if (data.structure === "articles") {
      add("article-table", {
        data: {
          sections: [
            {
              id: uid(),
              title: "Section 1",
              items: [],
            },
          ],
        },
      });
    }

    add("totals-block", {
      data: {
        vat: 20,
        downPayment: 30,
        subtotal: 0,
      },
    });

    add("signature-block", {
      data: {
        title: `Signature du client précédée de la mention "Lu et approuvé"`,
        boxHeight: 80,
      },
    });

    add("footer-block", {
      data: {
        showCompanyInfo: true,
        showLegalNotice: false,
        customText: "",
      },
    });

    const pageId = uid();

    const templateJson = {
      structure: data.structure,

      pages: [
        {
          id: pageId,
          blocks,
        },
      ],

      blockSettings,
      globalStyle: {},
      companyInfo: {},
    };
    const payload = {
      name: data.name,
      type: data.type,
      structure: data.structure,
      isDefault: false,
      thumbnail: uploadedThumbnail,
      templateJson,
    };

    try {
      await postRequest(PROVIDER.CREATE_TEMPLATE, payload);
      await fetchTemplates();
      setOpenModal(false);
      reset();
      setThumbnailFiles([]);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé");
    }
    setBtnloading(false);
  };
  const handlleDuplicateTemplate = async (id) => {
    setBtnloading(true);

    const payload = {
      templateId: id,
    };
    try {
      await postRequest(`${PROVIDER.CREATE_TEMPLATE}/duplicate`, payload);
      await fetchTemplates();
      setOpenModal(false);
      reset();
      setThumbnailFiles([]);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé");
    }
    setBtnloading(false);
  };
  const handleGenerateDocument = async () => {
    try {
      setBtnloading(true);

      if (!selectedContact || !selectedTemplateForDoc) return;

      const calculated = selectedTemplateForDoc.templateJson?.calculated || {};
      console.log(
        selectedTemplateForDoc.templateJson,
        "selectedTemplateForDoc.templateJsonsdsdsddssd",
      );
      const payload = {
        clientId: selectedContact.id,
        preTaxAmount: calculated.preTaxAmount || 0,
        taxAmount: calculated.taxAmount || 0,
        totalAmount: calculated.totalAmount || 0,
        minPayableAmount: calculated.minPayableAmount || 0,
        balanceAmount: calculated.balanceAmount || 0,
        dueDate: calculated.dueDate || null,
        templateJson: selectedTemplateForDoc.templateJson,
      };

      const res = await postRequest(`${PROVIDER.DOCUMENT}`, payload);

      navigate("/provider/document-editor/" + res?.data?.data.id);
      setCreateDocModal(false);
      setSelectedContact(null);
      setSelectedTemplateForDoc(null);
      setBtnloading(false);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé");
    }
  };

  const handleDeleteTemplate = async (id) => {
    setBtnloading(true);

    try {
      await deleteRequest(`${PROVIDER.TEMPLATE}/${id}`);
      await fetchTemplates();
      setDeleteModal(false);
      reset();
      setThumbnailFiles([]);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé");
    }
    setBtnloading(false);
  };
  useEffect(() => {
    fetchTemplates();
  }, []);
  const getDocTypeLabel = (type: string) => {
    return documentTypes.find((d) => d.value === type)?.label || type;
  };

  return (
    <>
      <div>
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 mb-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-wider capitalize dark:text-neutral-100 mb-0">
              Modèles de documents
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Créez et gérez vos modèles de devis, de factures et de bons de
              commande.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Button size="medium" onClick={() => setOpenModal(true)}>
              Nouveau modèle
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading && <p>Chargement des modèles...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && templates.length === 0 && (
            <p className="text-gray-500">Aucun modèle trouvé.</p>
          )}

          {templates.map((tpl: any) => (
            <div
              key={tpl.id}
              className="bg-white dark:bg-neutral-800 flex flex-col gap-4 justify-between rounded-2xl shadow-lg relative top-0 transition-linear duration-300 hover:-top-2"
            >
              <div className="space-y-3">
                <div
                  className="p-4 rounded-t-2xl h-40 relative z-10 before:content-[] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/30 before:-z-1 before:rounded-t-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${tpl.thumbnail || Eventthumb})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* {tpl.isDefault && (
                        <span className="bg-yellow-400 text-white rounded-full flex items-center gap-2 text-xs px-2 py-1 capitalize">
                          <Star size={16} />
                          Défaut
                        </span>
                      )} */}

                    <span className="bg-gray-100 rounded-full flex items-center gap-2 text-xs px-3 py-1 capitalize">
                      {getDocTypeLabel(tpl.type)}
                    </span>
                  </div>
                </div>

                <div className="px-3">
                  <h4 className="text-lg font-semibold capitalize tracking-wider dark:text-neutral-300">
                    {tpl.name}
                  </h4>
                </div>
              </div>

              <div className="px-3 pb-3">
                <div className="flex gap-2 mb-4">
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => {
                      navigate(`/provider/create-template/${tpl?.id}`);
                    }}
                    className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                  >
                    <Pencil
                      size={14}
                      className="text-gray-600 dark:text-neutral-300"
                    />

                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                       opacity-0 group-hover:opacity-100
                                       bg-gray-800 text-white text-xs px-2 py-1 rounded
                                       transition-opacity duration-300 whitespace-nowrap"
                    >
                      Modifier
                    </span>
                  </button>

                  {/* DUPLICATE */}
                  <button
                    className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                    onClick={() => {
                      handlleDuplicateTemplate(tpl.id);
                    }}
                  >
                    <Copy
                      size={14}
                      className="text-gray-600 dark:text-neutral-300"
                    />

                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                                               opacity-0 group-hover:opacity-100
                                                               bg-gray-800 text-white text-xs px-2 py-1 rounded
                                                               transition-opacity duration-300 whitespace-nowrap"
                    >
                      Copier
                    </span>
                  </button>

                  {/* DELETE */}
                  <button
                    className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setDeleteModal(true);
                    }}
                  >
                    <Trash
                      size={14}
                      className="text-gray-600 dark:text-neutral-300"
                    />

                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                                               opacity-0 group-hover:opacity-100
                                                               bg-gray-800 text-white text-xs px-2 py-1 rounded
                                                               transition-opacity duration-300 whitespace-nowrap"
                    >
                      Supprimer
                    </span>
                  </button>
                </div>

                <Button
                  size="medium"
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplateForDoc(tpl);
                    setCreateDocModal(true);
                    setStep(2);
                    fetchTemplate(tpl.id);
                    fetchContacts();
                  }}
                >
                  Créer un document
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="max-w-2xl mx-auto border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 md:p-8 relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-white"
            onClick={() => setOpenModal(false)}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Créer un nouveau modèle de document
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <InputGroup
                label="Nom du modèle"
                placeholder="Ex: Devis Standard, Facture Corporate..."
                error={errors.name}
                inputProps={register("name")}
              />
            </div>

            {/* DOCUMENT TYPE SELECT */}
            <div>
              <CustomSelect
                label="Type de document"
                options={documentTypes}
                placeholder="Sélectionner un type..."
                value={documentTypes.find((d) => d.value === watch("type"))}
                onChange={(e: any) => setValue("type", e.value)}
                error={errors.type?.message}
              />
            </div>

            {/* STRUCTURE SELECT */}
            <div className="space-y-2">
              <label className="block mb-2 font-medium text-gray-700 dark:text-neutral-300">
                Structure du modèle *
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* OPTION 1 — Esthétique */}
                <div
                  onClick={() => setValue("structure", "basic")}
                  className={`
        border-2 rounded-xl p-4 cursor-pointer transition
        ${
          watch("structure") === "basic"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }
      `}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <FileText size={36} className="text-blue-600" />

                    <h3 className="font-semibold dark:text-neutral-100 tracking-widest">
                      Esthétique
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Document minimaliste sans tableau détaillé
                    </p>
                  </div>
                </div>

                {/* OPTION 2 — Avec articles */}
                <div
                  onClick={() => setValue("structure", "articles")}
                  className={`
        border-2 rounded-xl p-4 cursor-pointer transition
        ${
          watch("structure") === "articles"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }
      `}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <Table size={36} className="text-green-600" />

                    <h3 className="font-semibold dark:text-neutral-100 tracking-widest">
                      Avec articles
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Document détaillé avec tableau de lignes d’articles
                    </p>
                  </div>
                </div>
              </div>

              {errors.structure && (
                <p className="text-red-500 text-xs">
                  {errors.structure.message}
                </p>
              )}
            </div>

            {/* THUMBNAIL UPLOAD */}
            <div>
              <label className="block mb-2 text-base font-medium dark:text-neutral-100">
                Image miniature
              </label>
              <FileDropzone
                value={thumbnailFiles}
                onChange={(files) => {
                  setThumbnailFiles(files);
                  setValue("thumbnail", files[0]);
                }}
                maxFiles={1}
                accept={{ "image/*": [] }}
                error={errors.thumbnail?.message}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col md:flex-row justify-end gap-3 mt-10">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Annuler
              </Button>
              <Button className="flex-1" loading={btnloading} type="submit">
                Créer le modèle
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="max-w-2xl mx-auto border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 md:p-10">
          <div className="mb-6 space-y-4 text-center">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Supprimer le modèle
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
              Êtes-vous sûr de vouloir supprimer le modèle{" "}
              <span className="font-semibold text-black dark:text-neutral-300">
                {selectedTemplate?.name}
              </span>
              ? Cette action est irréversible.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-10">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Annuler
            </Button>

            <Button
              className="flex-1"
              variant="danger"
              loading={btnloading}
              onClick={() => {
                handleDeleteTemplate(selectedTemplate?.id);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </OuterModal>
      <OuterModal
        active={createDocModal}
        setActive={setCreateDocModal}
        showClose
      >
        <div className="max-w-xl mx-auto bg-white rounded-xl p-6">
          {/* HEADER */}
          <h2 className="text-xl font-semibold mb-1">
            Créer un nouveau document
          </h2>
          <p className="text-gray-500 mb-6">
            Suivez les étapes pour générer votre document commercial.
          </p>

          {/* STEPS */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                1
              </div>
              <span className="text-sm">Choix du modèle</span>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                2
              </div>
              <span className="text-sm font-medium">Assignation Client</span>
            </div>
          </div>

          {/* STEP 2 CONTENT */}
          <h3 className="text-lg font-semibold mb-4">
            Étape 2: Associez un client
          </h3>

          <div className="border rounded-xl p-5">
            <h4 className="font-semibold mb-1">Sélection du Contact</h4>
            <p className="text-sm text-gray-500 mb-4">
              Choisissez le client ou prospect pour ce document.
            </p>

            {/* CONTACT SELECT */}
            <CustomSelect
              label="Contact"
              placeholder="Sélectionner un contact..."
              options={contacts.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              value={
                selectedContact
                  ? {
                      label: selectedContact.name,
                      value: selectedContact.id,
                    }
                  : null
              }
              onChange={(opt: any) => {
                const contact = contacts.find((c) => c.id === opt.value);
                setSelectedContact(contact);
              }}
            />

            {/* CONTACT PREVIEW */}
            {selectedContact && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold">{selectedContact.name}</p>
                <p className="text-sm text-gray-600">{selectedContact.email}</p>
                <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                {/* <p className="text-sm text-gray-600">
                  {selectedContact.city} ({selectedContact.postalCode})
                </p> */}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col md:flex-row gap-3 justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCreateDocModal(false)}
                className="flex-1"
              >
                Retour
              </Button>

              <Button
                loading={btnloading}
                disabled={!selectedContact}
                onClick={() => handleGenerateDocument()}
                className="flex-1"
              >
                Générer le Document
              </Button>
            </div>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Templates;
