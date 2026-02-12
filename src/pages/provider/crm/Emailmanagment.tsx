import {
  Archive,
  CheckCircle,
  Inbox,
  Mail,
  RefreshCcw,
  Send,
  Trash,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useEffect, useState } from "react";
import { useToast } from "../../../utils/toast";
import OuterModal from "../../../components/Custommodal/OuterModal";
const normalizeHtml = (value: any): string => {
  if (typeof value === "string") return value;
  if (value?.html && typeof value.html === "string") return value.html;
  if (value?.message && typeof value.message === "string") return value.message;
  return "";
};
const Emails = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const toast = useToast();
  const [emails, setEmails] = useState<any[]>([]);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [sendForm, setSendForm] = useState<{
    to: string;
    subject: string;
    html: string;
  }>({
    to: "",
    subject: "",
    html: "",
  });

  const [sendLoading, setSendLoading] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const [emailsLoading, setEmailsLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [conectedEmail, setConnectedEmail] = useState("");
  const [aiReplyModal, setAiReplyModal] = useState(false);
  const [aiReplyLoading, setAiReplyLoading] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [aiComposeText, setAiComposeText] = useState("");

  const [aiConfig, setAiConfig] = useState({
    tone: "professionnel",
    length: "moyen",
    language: "english",
  });
  const [activeFolder, setActiveFolder] = useState<
    "inbox" | "sent" | "archive" | "trash" | "spam"
  >("inbox");

  const [emailDetailsLoading, setEmailDetailsLoading] = useState(false);
  const [emailDetails, setEmailDetails] = useState<any>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [aiComposeModal, setAiComposeModal] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectedServices, setSelectedServices] = useState<
    { label: string; value: number }[]
  >([]);

  const fetchEmailDetails = async (messageId: string) => {
    setEmailDetailsLoading(true);
    try {
      const res = await getRequest(`${PROVIDER.MAIL}/${messageId}`);
      setEmailDetails(res?.data?.data || null);
    } catch (err) {
      console.error("Fetch email details error", err);
    } finally {
      setEmailDetailsLoading(false);
    }
  };
 
  const handleSendEmail = async () => {
    if (!sendForm.to || !sendForm.subject || !sendForm?.html) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSendLoading(true);

      await postRequest(`${PROVIDER.MAIL}/send`, {
        to: sendForm.to.split(",").map((e) => e.trim()),
        subject: sendForm.subject,
        html: sendForm?.html,
      });

      toast.success("Email sent successfully");
      setSendModalOpen(false);
      setSendForm({ to: "", subject: "", html: "" });
    } catch (e) {
      toast.error("Failed to send email");
    } finally {
      setSendLoading(false);
    }
  };

  const fetchEmails = async (
    folder: string,
    pageToken: string | null = null,
    append = false
  ) => {
    append ? setLoadingMore(true) : setEmailsLoading(true);

    try {
      const url = pageToken
        ? `${PROVIDER.MAIL_LIST}?folder=${folder}&pageToken=${pageToken}`
        : `${PROVIDER.MAIL_LIST}?folder=${folder}`;

      const res = await getRequest(url);

      const newEmails = res?.data?.data?.emails || [];
      const token = res?.data?.data?.nextPageToken || null;
      setConnectedEmail(res?.data?.data?.connectedEmail || "");
      setEmails((prev) => (append ? [...prev, ...newEmails] : newEmails));
      setNextPageToken(token);
    } catch (err) {
      console.error("Fetch emails error", err);
    } finally {
      setEmailsLoading(false);
      setLoadingMore(false);
    }
  };

  const handleConnectGmail = async () => {
    setBtnLoading(true);
    try {
      const res = await getRequest(PROVIDER.CONNECT_GMAIL);

      const authUrl = res?.data?.data?.url;

      if (!authUrl) {
        toast.error("Gmail auth URL not found");
        return;
      }

      window.open(authUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error("Failed to connect to Gmail. Please try again.");
      console.error("Gmail connect error", error);
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    setSelectedEmail(null);
    fetchEmails(activeFolder);
  }, [activeFolder]);

  const handleSelectEmail = async (mail: any) => {
    setSelectedEmail(mail);
    fetchEmailDetails(mail.id);

    if (!mail.isRead) {
      try {
        await patchRequest(`${PROVIDER.MAIL}/${mail.id}/mark-read`);

        setEmails((prev) =>
          prev.map((e) => (e.id === mail.id ? { ...e, isRead: true } : e))
        );
      } catch (err) {
        console.error("Mark read error", err);
      }
    }
  };

  const handleDelete = async (mail: any) => {
    try {
      await deleteRequest(`${PROVIDER.MAIL}/${mail.id}/delete`);

      setEmails((prev) => prev.filter((e) => e.id !== mail.id));
      setSelectedEmail(null);
      setEmailDetails(null);
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleArchive = async (mail: any) => {
    try {
      await patchRequest(`${PROVIDER.MAIL}/${mail.id}/archive`);

      setEmails((prev) => prev.filter((e) => e.id !== mail.id));
      setSelectedEmail(null);
    } catch (err) {
      console.error("Archive error", err);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText) return;

    try {
      setReplyLoading(true);

      await postRequest(`${PROVIDER.MAIL}/reply/${messageId}`, {
        html: `<p>${replyText}</p>`,
        text: replyText,
      });

      toast.success("Reply sent");
      setReplyText("");
      fetchEmailDetails(messageId);
    } catch (error) {
      
      toast.error("Reply failed");
    } finally {
      setReplyLoading(false);
    }
  };

  const generateAIReply = async () => {
    try {
      setAiReplyLoading(true);

      const res = await postRequest(`${PROVIDER.MAIL}/ai-reply`, {
        emailId: selectedEmail.id,
        tone: aiConfig.tone,
        length: aiConfig.length,
        language: aiConfig.language,
      });
     
      setReplyText(res?.data?.data || "");
      setAiReplyModal(false);
    } catch {
     
      toast.error("AI reply failed");
    } finally {
      setAiReplyLoading(false);
    }
  };

  const EmailSkeleton = () => (
    <div className="space-y-1 p-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
    </div>
  );
  

  const buildEmailFormatPrompt = (rawText: string) => `
You are a professional email assistant.

Rewrite and format the following content into a clean, polite, professional business email.
- Keep the original intent
- Improve grammar and clarity
- Use proper paragraphs
- Do NOT add new information
- Return only HTML body (no subject)

CONTENT:
${rawText}
`;

  const formatWithAI = async () => {
    if (!sendForm.html.trim()) return;

    try {
      setFormatting(true);
      const res = await postRequest(`${PROVIDER.AICHAT}`, {
        prompt: buildEmailFormatPrompt(sendForm.html),
      });

      setSendForm((prev) => ({
        ...prev,
        html: normalizeHtml(res?.data?.data),
      }));
    } catch {
      toast.error("AI formatting failed");
    } finally {
      setFormatting(false);
    }
  };

  const handleComposeAIFormat = async () => {
    if (!aiComposeText.trim()) {
      toast.error("Please write a message first");
      return;
    }

    try {
      setFormatting(true);

      if (!originalDraft) {
        setOriginalDraft(aiComposeText);
      }

      const res = await postRequest(`${PROVIDER.AICHAT}`, {
        prompt: `
Tone: ${aiConfig.tone}
Length: ${aiConfig.length}
Language: ${aiConfig.language}

${buildEmailFormatPrompt(aiComposeText)}
      `,
      });

      setSendForm((prev) => ({
        ...prev,
        html: normalizeHtml(res?.data?.data?.reply || prev.html),
      }));

      setAiComposeModal(false);
    } catch {
      toast.error("AI formatting failed");
    } finally {
      setFormatting(false);
    }
  };

 


  return (
    <>
      <div>
        <div className="bg-white dark:bg-darkmode p-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
            <h2 className="text-xl tracking-wider font-bold dark:text-neutral-300">
              Emails
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="small"
                onClick={() => fetchEmails("inbox")}
              >
                <RefreshCcw size={16} />
                Synchroniser
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => setSendModalOpen(true)}
              >
                <Send size={16} />
                Compose
              </Button>
              <Button
                size="small"
                loading={btnLoading}
                onClick={handleConnectGmail}
              >
                <Mail size={16} /> Connecter Gmail
              </Button>
              {/* <Button variant="outline">
                <Mail size={16} /> Connecter Outlook
              </Button> */}
            </div>
          </div>

          <div>
            <span className="bg-gray-200 text-gray-600 inline-flex py-1 px-2 gap-2 text-xs rounded-full">
              {conectedEmail ? conectedEmail : "No email connected"}{" "}
              <CheckCircle size={16} className="text-green-900" />{" "}
            </span>
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className="border-r border-gray-200 w-full lg:w-[400px] shrink-0">
            <div className="px-3 my-5">
              <InputGroup
                placeholder="Search for an email.."
                className="!py-2 bg-white !text-sm"
              />
            </div>

            <div>
              <div className="flex px-3 py-1 bg-gray-100 dark:bg-black gap-2 font-medium capitalize text-sm mb-2">
                <button
                  type="button"
                  className={`flex-1 flex justify-center gap-2 items-center p-1 text-center cursor-pointer transition-all duration-300 ${
                    activeFolder === "inbox"
                      ? "bg-white dark:bg-darkmode text-secondary"
                      : "text-gray-600 hover:text-secondary hover:bg-white"
                  }`}
                  onClick={() => setActiveFolder("inbox")}
                >
                  <Inbox size={16} />
                  Receipts
                </button>

                <button
                  type="button"
                  className={`flex-1 flex justify-center gap-2 items-center p-1 text-center cursor-pointer transition-all duration-300 ${
                    activeFolder === "sent"
                      ? "bg-white dark:bg-darkmode text-secondary"
                      : "text-gray-600 hover:text-secondary hover:bg-white"
                  }`}
                  onClick={() => setActiveFolder("sent")}
                >
                  <Send size={16} /> Sent
                </button>

                <button
                  type="button"
                  className={`flex-1 flex justify-center gap-2 items-center p-1 text-center cursor-pointer transition-all duration-300 ${
                    activeFolder === "archive"
                      ? "bg-white dark:bg-darkmode text-secondary"
                      : "text-gray-600 hover:text-secondary hover:bg-white"
                  }`}
                  onClick={() => setActiveFolder("archive")}
                >
                  <Archive size={16} /> Archives
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100dvh-420px)] dark:bg-darkmode">
                <div className="divide-y divide-gray-200">
                  {emailsLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <EmailSkeleton key={i} />
                      ))}
                    </>
                  ) : emails.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No emails found
                    </div>
                  ) : (
                    emails.map((mail) => (
                      <div
                        key={mail.id}
                        onClick={() => handleSelectEmail(mail)}
                        className={`space-y-1 p-4 border-l-2 cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-black ${
                          selectedEmail?.id === mail.id
                            ? "border-l-blue-600 bg-white dark:bg-darkmode"
                            : "border-l-transparent"
                        } ${!mail.isRead ? "bg-gray-50 dark:bg-black" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-sm dark:text-neutral-300">
                            {mail.from}
                          </span>
                          <span
                            className={`text-xs dark:text-neutral-300 ${
                              !mail.isRead ? "text-gray-600 " : ""
                            }`}
                          >
                            {new Date(mail.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span
                            className={`text-sm block dark:text-neutral-300 ${
                              !mail.isRead ? "font-semibold " : ""
                            }`}
                          >
                            {mail.subject || "(No subject)"}
                          </span>
                          <p className="text-gray-600 !text-xs truncate dark:text-neutral-300">
                            {mail.snippet}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {nextPageToken && !emailsLoading && (
                <div className="p-4 text-center">
                  <Button
                    variant="outline"
                    loading={loadingMore}
                    onClick={() =>
                      fetchEmails(activeFolder, nextPageToken, true)
                    }
                  >
                    Load more
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-darkmode p-4 flex-1 shrink-0">
            {emailDetailsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            ) : emailDetails ? (
              (() => {
                const messages =
                  Array.isArray(emailDetails.messages) &&
                  emailDetails.messages.length > 0
                    ? emailDetails.messages
                    : [];

                const latestMessage = messages.length
                  ? messages[messages.length - 1]
                  : emailDetails;

                const replyTargetMessageId =
                  messages.length > 0
                    ? messages[messages.length - 1].id
                    : emailDetails.id;
                return (
                  <>
                    {/* ---------- HEADER ---------- */}
                    <div className="flex justify-between items-start gap-4 border-b border-gray-200 pb-4">
                      <div className="space-y-2">
                        <span className="text-xl block dark:text-neutral-300">
                          {latestMessage.subject || "(No subject)"}
                        </span>

                        <div className="flex gap-2 text-sm">
                          <span className="dark:text-neutral-300">
                            {latestMessage.from}
                          </span>
                          <span className="text-gray-600 dark:text-neutral-300">
                            •
                          </span>
                          <span className="text-gray-600 dark:text-neutral-300">
                            {latestMessage.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleArchive(latestMessage)}
                          className="p-2 bg-gray-100 dark:bg-transparent border border-transparent dark:border-white rounded-md hover:bg-gray-200 hover:dark:bg-darkmode cursor-pointer group relative"
                        >
                          <Archive
                            size={14}
                            className="text-gray-600 dark:text-neutral-300"
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            Archive
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(latestMessage)}
                          className="p-2 bg-gray-100 dark:bg-transparent border border-transparent dark:border-white rounded-md hover:bg-gray-200 hover:dark:bg-darkmode cursor-pointer group relative"
                        >
                          <Trash
                            size={14}
                            className="text-gray-600 dark:text-neutral-300"
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-600 space-y-6 mt-4 text-sm h-[calc(100dvh-300px)] overflow-y-auto dark:!text-white">
                      {messages.length > 0 ? (
                        messages.map((msg: any) => (
                          <div
                            key={msg.id}
                            className="border-b border-borderlight pb-4"
                          >
                            <div className="text-xs text-gray-500 mb-2">
                              <b className="dark:text-neutral-300">{msg.from}</b>
                              <span className="mx-1">•</span>
                              {msg.date}
                            </div>

                            {msg.body?.html?.trim() ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: msg.body.html,
                                }}
                              />
                            ) : msg.body?.text ? (
                              <pre className="whitespace-pre-wrap">
                                {msg.body.text}
                              </pre>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                {msg.snippet}
                              </p>
                            )}
                          </div>
                        ))
                      ) : emailDetails.body?.html ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: emailDetails.body.html,
                          }}
                        />
                      ) : (
                        <>
                          <pre className="whitespace-pre-wrap">
                            {emailDetails.body?.text}
                          </pre>
                          <div className="pt-4 mt-6">
                            <div className="w-full">
                              <textarea
                                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                                placeholder="Write your reply..."
                                value={
                                  replyText
                                    ? replyText
                                        .replace(/<br\s*\/?>/gi, "\n")
                                        .replace(/<\/p>/gi, "\n\n")
                                        .replace(/<[^>]+>/g, "")
                                    : ""
                                }
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                            </div>

                            <div className="flex gap-2 mt-3">
                              <Button
                                loading={replyLoading}
                                onClick={() =>
                                  handleReply(replyTargetMessageId)
                                }
                                disabled={!replyText.trim()}
                              >
                                Send Reply
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() => setAiReplyModal(true)}
                              >
                                ✨ Reply with AI
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="pt-4 mt-6 sticky bottom-0 bg-white">
                        <textarea
                          className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                          placeholder="Write your reply..."
                          defaultValue={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />

                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <Button
                            loading={replyLoading}
                            onClick={() => handleReply(replyTargetMessageId)}
                            disabled={!replyText.trim()}
                          >
                            Send Reply
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => setAiReplyModal(true)}
                          >
                            ✨ Reply with AI
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="p-6 text-gray-500 text-sm">
                Select an email to view details
              </div>
            )}
          </div>
        </div>
      </div>
      <OuterModal active={sendModalOpen} setActive={setSendModalOpen} showClose>
        <div className="bg-white dark:bg-darkmode max-w-2xl mx-auto rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-300">
            Send Email
          </h2>

          <div className="space-y-4">
            <InputGroup
              label="To (comma separated)"
              placeholder="email1@gmail.com, email2@gmail.com"
              value={sendForm.to}
              onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
            />

            <InputGroup
              label="Subject"
              placeholder="Subject"
              value={sendForm.subject}
              onChange={(e) =>
                setSendForm({ ...sendForm, subject: e.target.value })
              }
            />
            {/* <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
              Message
            </label> */}
            <div className="space-y-2">
              <label>Message</label>
              <textarea
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                placeholder="Write your email..."
                rows={4}
                value={
                  sendForm.html
                    ? sendForm.html
                        .replace(/<br\s*\/?>/gi, "\n")
                        .replace(/<\/p>/gi, "\n\n")
                        .replace(/<[^>]+>/g, "")
                    : ""
                }
                onChange={(e) =>
                  setSendForm({ ...sendForm, html: e.target.value })
                }
              />

              {/* <textarea
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                rows={6}
                placeholder="Write your email..."
                value={
                  sendForm.html
                    ? sendForm?.html
                        ?.replace(/<br\s*\/?>/gi, "\n")
                        ?.replace(/<\/p>/gi, "\n\n")
                        ?.replace(/<[^>]+>/g, "")
                    : ""
                }
                onChange={(e) =>
                  setSendForm({ ...sendForm, html: e.target.value })
                }
              /> */}
            </div>
            <div className="flex">
              <Button
                variant="outline"
                className="bg-gray-200 border-0"
                onClick={() => {
                  setAiComposeText(sendForm?.html || "");
                  setAiComposeModal(true);
                }}
              >
                ✨ Format with AI
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setSendModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={sendLoading}
              onClick={handleSendEmail}
            >
              Send
            </Button>
          </div>
        </div>
      </OuterModal>

      <OuterModal active={aiReplyModal} setActive={setAiReplyModal} showClose>
        <div className="bg-white dark:bg-darkmode max-w-xl mx-auto rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-300">
            Assistant de Réponse IA
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium dark:text-neutral-300">
                Ton du message
              </label>
              <select
                className="border border-borderlight p-3 rounded-lg text-sm outline-0 w-full"
                value={aiConfig.tone}
                onChange={(e) =>
                  setAiConfig({ ...aiConfig, tone: e.target.value })
                }
              >
                <option value="professionnel">Professionnel</option>
                <option value="amical">Amical</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium dark:text-neutral-300">
                Longueur du message
              </label>
              <select
                className="border border-borderlight p-3 rounded-lg text-sm outline-0 w-full"
                value={aiConfig.length}
                onChange={(e) =>
                  setAiConfig({ ...aiConfig, length: e.target.value })
                }
              >
                <option value="court">Court</option>
                <option value="moyen">Moyen</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium dark:text-neutral-300">
                Language
              </label>
              <select
                className="border border-borderlight p-3 rounded-lg text-sm outline-0 w-full"
                value={aiConfig.language}
                onChange={(e) =>
                  setAiConfig({ ...aiConfig, language: e.target.value })
                }
              >
                <option value="english">English</option>
                <option value="french">Français</option>
              </select>
            </div>
          </div>

          <Button
            loading={aiReplyLoading}
            className="w-full mt-5"
            onClick={generateAIReply}
          >
            ✨ Générer le brouillon
          </Button>
        </div>
      </OuterModal>
      <OuterModal
        active={aiComposeModal}
        setActive={setAiComposeModal}
        showClose
      >
        <div className="bg-white dark:bg-darkmode max-w-xl mx-auto rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-300">
            Assistant de Rédaction IA
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={aiConfig.tone}
              onChange={(e) =>
                setAiConfig({ ...aiConfig, tone: e.target.value })
              }
            >
              <option value="professionnel">Professionnel</option>
              <option value="amical">Amical</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={aiConfig.length}
              onChange={(e) =>
                setAiConfig({ ...aiConfig, length: e.target.value })
              }
            >
              <option value="court">Court</option>
              <option value="moyen">Moyen</option>
              <option value="long">Long</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={aiConfig.language}
              onChange={(e) =>
                setAiConfig({ ...aiConfig, language: e.target.value })
              }
            >
              <option value="english">English</option>
              <option value="french">Français</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium dark:text-neutral-300">
              Message
            </label>
            <textarea
              className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              rows={5}
              placeholder="Write or paste your message here..."
              value={
                aiComposeText
                  ? aiComposeText
                      .replace(/<br\s*\/?>/gi, "\n")
                      .replace(/<\/p>/gi, "\n\n")
                      .replace(/<[^>]+>/g, "")
                  : ""
              }
              onChange={(e) => setAiComposeText(e.target.value)}
            />
          </div>
          <Button
            loading={formatting}
            className="w-full"
            onClick={handleComposeAIFormat}
          >
            ✨ Générer le brouillon
          </Button>
        </div>
      </OuterModal>
    </>
  );
};

export default Emails;
