import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import OuterModal from "../../../components/Custommodal/OuterModal";
import {
  getRequest,
  postRequest,
  patchRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useToast } from "../../../utils/toast";
import { Plus, X } from "lucide-react";
import { uploadFile } from "../../../utils/uploadfile";

const CONTEXT_OPTIONS = [
  { value: "quote", label: "Devis" },
  { value: "invoice", label: "Facture" },
  { value: "email", label: "Email" }, // manual only
  { value: "reminder", label: "Rappel" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "Anglais " },
  { value: "fr", label: "Français" },
];

const PREVIEW_DATA: any = {
  business: { name: "Best Events" },
  customer: { firstName: "John", fullName: "John Doe" },
  document: {
    number: "INV-2026-001",
    totalAmount: "1250 €",
    url: "https://app.example.com/doc/INV-2026-001",
  },
  event: { title: "Wedding Ceremony" },
};

const EmailTemplates = () => {
  const [openSubject, setOpenSubject] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const subjectDropdownRef = useRef<HTMLDivElement | null>(null);
  const editorDropdownRef = useRef<HTMLDivElement | null>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const handleAttachmentUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg";

    input.click();

    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      // ❗ Validate size
      const invalidFiles = files.filter((f) => f.size > MAX_FILE_SIZE);

      if (invalidFiles.length > 0) {
        toast.error(
          `Le fichier "${invalidFiles[0].name}" dépasse la limite de 10 MB`,
        );
        return;
      }

      setUploadingAttachment(true);

      try {
        const uploadedUrls: string[] = [];

        for (const file of files) {
          const { url } = await uploadFile(file);
          uploadedUrls.push(url);
        }

        setAttachments((prev) => [...prev, ...uploadedUrls]);
        toast.success("Pièce jointe ajoutée");
      } catch (err) {
        toast.error("Échec du téléchargement des pièces jointes");
      } finally {
        setUploadingAttachment(false);
      }
    };
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        subjectDropdownRef.current?.contains(e.target) ||
        editorDropdownRef.current?.contains(e.target)
      ) {
        return;
      }

      setOpenSubject(false);
      setOpenEditor(false);
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const handleOptionSelect = (item) => {
    setOpen(false);
  };

  const quillRef = useRef<any>(null);
  const [editorKey, setEditorKey] = useState(0);

  const insertEmailButton = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const range = editor.getSelection(true);

    editor.insertEmbed(range.index, "emailButton", {
      text: "Pay Now",
      href: "https://example.com/pay",
      padding: "14px 24px",
      margin: "20px 0",
      bg: "#16a34a",
      color: "#ffffff",
      radius: "8px",
    });

    editor.setSelection(range.index + 1);
  };
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const { url } = await uploadFile(file);

        const editor = quillRef.current?.getEditor();
        const range = editor.getSelection(true);

        editor.insertEmbed(range.index, "image", url);
        editor.setSelection(range.index + 1);
      } catch (err) {
        toast.error("Image upload failed");
      }
    };
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const [form, setForm] = useState({
    name: "",
    context: "",
    language: "en",
    subject: "",
    bodyHtml: "",
  });

  const previewSource = useMemo(() => {
    return {
      template: {
        name: form.name,
        subject: form.subject,
        body: form.bodyHtml,
        language: form.language,
        context: form.context,
      },
      // you can extend this later if needed
    };
  }, [form]);

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [variablesMap, setVariablesMap] = useState<any>({});

  const variableOptions = useMemo(() => {
    if (!variablesMap || !form.context) return [];

    // EMAIL → manual only

    if (form.context === "email") {
      return (variablesMap.manual || []).map((v: any) => ({
        value: v.key,
        label: v.label,
      }));
    }

    // OTHER CONTEXTS → ONLY their variables

    return (variablesMap[form.context] || []).map((v: any) => ({
      value: v.key,
      label: v.label,
    }));
  }, [form.context, variablesMap]);

  const subjectRef = useRef<HTMLTextAreaElement | null>(null);

  /* ---------------- FETCH ---------------- */

  const fetchTemplates = async () => {
    const res = await getRequest(PROVIDER.EMAIL_TEMPLATES_LIST);
    setTemplates(res?.data?.data || []);
  };

  const fetchVariables = async () => {
    const res = await getRequest(`${PROVIDER.EMAIL_TEMPLATES}/variables`);
    setVariablesMap(res?.data?.data || {});
  };

  useEffect(() => {
    fetchTemplates();
    fetchVariables();
  }, []);

  const handleSelect = async (tpl: any) => {
    const res = await getRequest(`${PROVIDER.EMAIL_TEMPLATES}/${tpl.id}`);
    const data = res?.data?.data;
    setSelectedTemplate(data);
    setEditorKey((k) => k + 1);
    setForm({
      name: data.name || "",
      context: data.context || "",
      language: data.language || "en",
      subject: data.subject || "",
      bodyHtml: data.bodyHtml || "",
    });
    setAttachments(data.attachments || []);
  };

  const insertVariable = (field: "subject" | "bodyHtml", variable: string) => {
    const token = `<%= ${variable} %>`;

    // SUBJECT
    if (field === "subject" && subjectRef.current) {
      const el = subjectRef.current;
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;

      setForm((p) => ({
        ...p,
        subject: p.subject.slice(0, start) + token + p.subject.slice(end),
      }));

      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + token.length, start + token.length);
      });

      return;
    }

    if (field === "bodyHtml") {
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const range = editor.getSelection(true);
      editor.insertText(range.index, token);
      editor.setSelection(range.index + token.length);
    }
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // const renderTemplate = (tpl: string) =>
  //   tpl.replace(/<%=\s*([\w.]+)\s*%>/g, (_, key) => {
  //     return (
  //       key.split(".").reduce((a: any, b: any) => a?.[b], PREVIEW_DATA) ||
  //       `{{ ${key} }}`
  //     );
  //   });

  const renderTemplate = (tpl: string) => tpl;

  const extractVariables = (subject: string, bodyHtml: string) => {
    const decodedBody = decodeHtml(bodyHtml);
    const content = `${subject} ${decodedBody}`;

    const matches = content.match(/<%=\s*([\w.]+)\s*%>/g) || [];

    return Array.from(
      new Set(
        matches.map((v) => v.replace("<%=", "").replace("%>", "").trim()),
      ),
    );
  };

  const toast = useToast();

  const handleSave = async () => {
    const decodedBody = decodeHtml(form.bodyHtml);
    if (!form.name?.trim()) {
      toast.error("Le nom du modèle est obligatoire");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      subject: decodeHtml(form.subject),
      bodyHtml: decodedBody,
      bodyText: decodedBody
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      variables: extractVariables(form.subject, decodedBody),
      isDefault: false,
      attachments,
    };

    try {
      selectedTemplate?.id
        ? await patchRequest(
            `${PROVIDER.EMAIL_TEMPLATES}/${selectedTemplate.id}`,
            payload,
          )
        : await postRequest(PROVIDER.EMAIL_TEMPLATES, payload);

      fetchTemplates();
      toast.success("Modèle enregistré");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }

    setLoading(false);
  };

  return (
    <div data-no-translate className="flex flex-col md:flex-row gap-5">
      {/* LEFT */}
      <div className="w-full md:w-80 bg-white dark:bg-neutral-800 p-4 rounded-lg md:sticky md:top-[80px] max-h-[70vh]">
        <Button
          className="w-full"
          onClick={() => {
            setForm({
              name: "",
              context: "",
              language: "en",
              subject: "",
              bodyHtml: "",
            });
            setAttachments([]);
            setSelectedTemplate(null);
          }}
        >
          <Plus size={18} /> Ajouter Nouveau
        </Button>

        <div className="mt-4">
          <p className="text-gray-600 dark:text-neutral-300 mb-2">
            Modèles disponibles
          </p>
          <div className="overflow-y-auto max-h-[50vh] space-y-2">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="p-2 border border-borderlight dark:border-neutral-700 hover:border-blue-400 dark:hover:border-neutral-700 hover:bg-blue-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer transition-all duration-300"
              >
                <p className="font-medium capitalize dark:text-neutral-300">
                  {tpl.name}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs text-blue-600 capitalize bg-blue-200 px-3 py-1 rounded-full">
                    {tpl.context}
                  </span>

                  <span className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full uppercase">
                    EN
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 p-6 bg-white dark:bg-neutral-800 rounded-lg space-y-4">
        <div>
          <InputGroup
            label="Nom du modèle"
            defaultValue={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <CustomSelect
              label="Contexte"
              options={CONTEXT_OPTIONS}
              value={CONTEXT_OPTIONS.find((o) => o.value === form.context)}
              onChange={(v: any) =>
                setForm((p) => ({
                  ...p,
                  context: v?.value || "",
                }))
              }
            />

            <CustomSelect
              label="Langue"
              options={LANGUAGE_OPTIONS}
              value={LANGUAGE_OPTIONS.find((o) => o.value === form.language)}
              onChange={(v: any) =>
                setForm((p) => ({
                  ...p,
                  language: v?.value || "en",
                }))
              }
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className="block capitalize text-base font-medium text-mainclr dark:text-neutral-300">
              Objet
            </label>

            <div className="relative w-48" ref={subjectDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSubject((p) => !p);
                  setOpenEditor(false);
                }}
                className="flex items-center gap-2 p-2 text-sm dark:text-neutral-300 font-medium rounded-md border border-borderlight dark:border-neutral-700 dark:bg-neutral-800 ms-auto"
              >
                <Plus size={18} />
                Insérer un champ
              </button>

              {openSubject && (
                <div className="absolute right-0 z-10 w-full mt-2 bg-white border border-borderlight rounded-md shadow-lg">
                  <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-auto">
                    {variableOptions.length === 0 && (
                      <li className="px-4 py-2 text-gray-400">
                        Aucun champ disponible
                      </li>
                    )}

                    {variableOptions.map((item: any) => (
                      <li
                        key={item.value}
                        onClick={() => {
                          insertVariable("subject", item.value);
                          setOpenSubject(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <textarea
            ref={subjectRef}
            rows={2}
            className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg rounded-lg focus:border-secondary dark:bg-neutral-800 dark:text-neutral-300"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>

        <div className="items-center  justify-between gap-3 mb-2">
          <div className="flex justify-between">
            <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
              Message
            </label>

            <div
              className="flex justify-end mb-2 relative w-56"
              ref={editorDropdownRef}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEditor((p) => !p);
                  setOpenSubject(false);
                }}
                className="flex items-center gap-2 p-2 text-sm dark:text-neutral-300 font-medium rounded-md border border-borderlight dark:border-neutral-700 dark:bg-neutral-800 ms-auto"
              >
                <Plus size={18} />
                Insérer un champ
              </button>

              {openEditor && (
                <div className="absolute right-0 z-10 w-full mt-2 bg-white border border-borderlight rounded-md shadow-lg">
                  <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-auto">
                    {variableOptions.length === 0 && (
                      <li className="px-4 py-2 text-gray-400">
                        Aucun champ disponible
                      </li>
                    )}

                    {variableOptions.map((item: any) => (
                      <li
                        key={item.value}
                        onClick={() => {
                          insertVariable("bodyHtml", item.value);
                          setOpenEditor(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="min-h-[350px] [&_.ql-container]:min-h-[350px] [&_.ql-editor]:min-h-[320px]">
            <ReactQuill
              key={editorKey}
              ref={quillRef}
              value={form.bodyHtml}
              onChange={(v) => setForm({ ...form, bodyHtml: v })}
              modules={quillModules}
              formats={quillFormats}
              className="rounded-lg"
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-medium text-mainclr dark:text-neutral-300">
                Pièces jointes
              </label>

              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={handleAttachmentUpload}
                loading={uploadingAttachment}
              >
                Ajouter une pièce jointe
              </Button>
            </div>

            {attachments.length === 0 && (
              <p className="text-sm text-gray-400">Aucune pièce jointe</p>
            )}

            <ul className="space-y-2">
              {attachments.map((url, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 border border-borderlight dark:border-neutral-700 rounded-md"
                >
                  <span className="text-sm truncate">
                    {url.split("/").pop()}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setAttachments((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => setPreviewOpen(true)}>
            Aperçu
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <OuterModal active={previewOpen} setActive={setPreviewOpen}>
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
          <button className="absolute top-4 right-4 cursor-pointer">
                      <X
                        className=" dark:text-neutral-300"
                        onClick={() => setPreviewOpen(false)}
                      />
                    </button>

           <div className="mb-6 space-y-4">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Aperçu de l’E-mail
            </h2>
            <p className="dark:text-neutral-300">
              {renderTemplate(form.subject)}
            </p>
          </div>          
       
          <div
            className="dark:text-neutral-100"
            dangerouslySetInnerHTML={{
              __html: renderTemplate(form.bodyHtml),
            }}
          />
          {attachments.length > 0 && (
            <div className="mt-6">
              {/* <h3 className="font-medium mb-2 dark:text-neutral-100">
                Pièces jointes
              </h3> */}

              <ul className="space-y-1">
                {attachments.map((url, idx) => (
                  <li key={idx}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-sm dark:text-neutral-300"
                    >
                      {url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </OuterModal>
    </div>
  );
};

export default EmailTemplates;
