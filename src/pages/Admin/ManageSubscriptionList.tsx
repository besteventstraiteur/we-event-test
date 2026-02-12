import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import DataTable from "../../components/ui/Datatable";
import Button from "../../components/ui/Button";
import OuterModal from "../../components/Custommodal/OuterModal";
import InputGroup from "../../components/ui-main/InputGroup";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import CustomSelect from "../../components/ui-main/selectBox";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { Mail, Send, Eye, Percent, X } from "lucide-react";
import Staticscard from "../provider/Sales/Statics-card";

type Subscriber = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
};

export default function ManageSubscribers() {
  const toast = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState(""); // real HTML
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];
  /* ---------------- TABLE STATE ---------------- */
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  /* ---------------- MODAL STATE ---------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);

  /* ---------------- FETCH ---------------- */
  const fetchSubscribers = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${PROVIDER.SUBSCRIBE_ALL}?page=${pageNo}&limit=${limit}`,
      );

      const data = res?.data?.data;

      setRows(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || 1);
    } catch (error) {
      console.error("FETCH SUBSCRIBERS ERROR:", error);
      toast.error("Erreur", "Impossible de charger les abonnés.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletterStats = async () => {
    try {
      setStatsLoading(true);

      const res = await getRequest(PROVIDER.NEWSLETTER_STATS);
      setStats(res?.data?.data || null);
    } catch (error) {
     
      toast.error("Erreur", "Impossible de charger les statistiques.");
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    const res = await getRequest(PROVIDER.EMAIL_TEMPLATES_LIST);
    setTemplates(res?.data?.data || []);
  };

  const templateOptions = useMemo(
    () =>
      templates
        .filter((t) => t.context === "newsletter")
        .map((t) => ({
          value: t.id,
          label: t.name,
        })),
    [templates],
  );

  useEffect(() => {
    fetchTemplates();
    fetchNewsletterStats();
    fetchSubscribers(page);
  }, [page]);

  const fetchTemplateById = async (id: string) => {
    try {
      const res = await getRequest(`${PROVIDER.EMAIL_TEMPLATES}/${id}`);
      const data = res?.data?.data;

      setTitle(data?.subject || "");
      setHtmlContent(data?.bodyHtml || "");
      setAttachments(data?.attachments || []);
      setContent(data?.bodyHtml || "");
    } catch (error) {
      console.error("FETCH TEMPLATE ERROR:", error);
      toast.error("Erreur", "Impossible de charger le modèle d’e-mail.");
    }
  };

  const handleTemplateChange = (option: any) => {
    setSelectedTemplate(option);

    if (option?.value) {
      fetchTemplateById(option.value);
    }
  };

  /* ---------------- DATE FORMAT ---------------- */
  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch {
      return "—";
    }
  };
  const handleEditorChange = (value: string) => {
    setContent(value); // what user sees
    setHtmlContent(value); // what goes in payload
  };
  /* ---------------- SEND NEWSLETTER ---------------- */
  const sendMessage = async () => {
    if (!title.trim()) {
      return toast.warn("Titre requis", "Veuillez entrer un titre.");
    }

    if (!htmlContent.trim()) {
      return toast.warn("Message requis", "Veuillez sélectionner un modèle.");
    }

    try {
      setSending(true);

      await postRequest(PROVIDER.SUBSCRIBE_SEND_MESSAGE, {
        title,
        content: htmlContent,
        attachments: attachments,
      });

      toast.success("Message envoyé", "Newsletter envoyée à tous les abonnés.");

      setModalOpen(false);
      setTitle("");
      setContent("");
      setHtmlContent("");
      setSelectedTemplate(null);
    } catch (error: any) {
      toast.error(
        "Erreur",
        error?.response?.data?.message || "Échec de l'envoi du message.",
      );
    } finally {
      setSending(false);
    }
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = useMemo(
    () => [
      { key: "email", label: "E-mail" },
      {
        key: "isActive",
        label: "Statut",
        render: (row: Subscriber) => (
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              row.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {row.isActive ? "Actif" : "Inactif"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Abonné le",
        render: (row: Subscriber) => formatDate(row.createdAt),
      },
    ],
    [],
  );
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setShowEditor(true);
  }, []);

  return (
    <>

      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold dark:text-neutral-300">
          Abonnés à la newsletter
        </h2>

        <Button onClick={() => setModalOpen(true)}>
          Envoyer la newsletter
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Staticscard
          heading="Total des newsletters"
          value={statsLoading ? "—" : (stats?.totalNewsletters ?? 0)}
          subheading="Created so far"
          icon={<Mail size={16} />}
          bgcolor="bg-blue-100"
          iconcolor="text-blue-700"
        />

        <Staticscard
          heading="Total envoyés"
          value={statsLoading ? "—" : (stats?.totalSent ?? 0)}
          subheading="Emails delivered"
          icon={<Send size={16} />}
          bgcolor="bg-green-100"
          iconcolor="text-green-700"
        />

        <Staticscard
          heading="Total ouverts"
          value={statsLoading ? "—" : (stats?.totalOpen ?? 0)}
          subheading="Emails opened"
          icon={<Eye size={16} />}
          bgcolor="bg-purple-100"
          iconcolor="text-purple-700"
        />

        <Staticscard
          heading="Taux d’ouverture"
          value={
            statsLoading ? "—" : `${Number(stats?.openRate || 0).toFixed(2)}%`
          }
          subheading="Engagement rate"
          icon={<Percent size={16} />}
          bgcolor="bg-orange-100"
          iconcolor="text-orange-700"
        />
      </div>

      {/* TABLE */}
      <DataTable<Subscriber>
        columns={columns}
        data={rows}
        loading={loading}
        skeletonRows={8}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => setPage(p)}
        emptyText="Aucun abonné trouvé"
      />

      {/* ---------- MODAL ---------- */}
      <OuterModal active={modalOpen} setActive={setModalOpen}>
        <div className="max-w-xl w-full mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
          <button className="absolute top-4 right-4 cursor-pointer">
          <X
            className="dark:text-neutral-300"
            onClick={() => setModalOpen(false)}
          />
          </button>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
            Envoyer la newsletter à tous les abonnés
          </h2>
          </div>

          <div className="space-y-4">
            <div>
              <CustomSelect
                label="Modèle d’e-mail"
                options={templateOptions}
                value={selectedTemplate}
                onChange={handleTemplateChange}
                placeholder="Sélectionner un modèle…"
              />
            </div>
            <div>
              <InputGroup
                label="Titre"
                inputProps={{
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                }}
              />
            </div>

            <div>
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Contenu
              </label>

              {showEditor && (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-neutral-800 rounded-xl"
                  style={{ minHeight: "250px" }}
                />
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row justify-end gap-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={sending}
            >
              Annuler
            </Button>

            <Button className="flex-1" onClick={sendMessage} disabled={sending}>
              {sending ? "Envoi en cours…" : "Envoyer"}
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
}
