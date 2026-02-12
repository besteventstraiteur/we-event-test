import { useEffect, useRef, useState } from "react";
import InputGroup from "../../components/ui-main/InputGroup";
import {
  MessageCircle,
  Paperclip,
  Plus,
  SendHorizonal,
  X,
  Loader2,
  File,
  ArrowLeft,
} from "lucide-react";
import OuterModal from "../../components/Custommodal/OuterModal";
import Button from "../../components/ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { uploadFile } from "../../utils/uploadfile";
import { IMAGE_URL } from "../../utils/constants";
import { io } from "socket.io-client";
import * as msgpack from "@msgpack/msgpack";
import { useSelector } from "react-redux";
import moment from "moment";

const PAGE_SIZE = 10;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const timeAgo = (date: string | null) => {
  if (!date) return ""; // or "No messages"

  return moment(date).fromNow();
};

const ClientChat = () => {
  const login = useSelector((state: any) => state.login);
  const userId = Number(login?.user?.id);

  const socketRef = useRef<any>(null);
  const roomRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const dedupeMap = useRef(new Set<string>());

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [uploading, setUploading] = useState(false);
  const [attachment, setAttachment] = useState<any>(null);
  const [showchatModal, setShowchatModal] = useState(false);
  const [chatvisibility, Setchatvisibility] = useState(false);

  useEffect(() => {
    if (!userId) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { userId },
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("✅ SOCKET CONNECTED:", socket.id));
    socket.on("disconnect", () => console.log("❌ SOCKET DISCONNECTED"));

    socket.on("binary-message", (raw: ArrayBuffer) => {
      const { e, p } = msgpack.decode(new Uint8Array(raw)) as any;

    
      if (e === "receive-message") {
        const key = `${p.conversationId}_${p.senderId}_${p.message}_${p.createdAt}`;

        if (dedupeMap.current.has(key)) {
          
          return;
        }

        dedupeMap.current.add(key);
        setMessages((prev) => [...prev, p]);
      }

      if (e === "user-joined") {
        console.log("👥 USER JOINED ROOM:", p.room);
      }

      if (e === "user-left") {
        console.log("👋 USER LEFT ROOM:", p.room);
      }
    });

    return () => {
      socket.disconnect();
      initializedRef.current = false;
      dedupeMap.current.clear();
    };
  }, [userId]);

  useEffect(() => {
    if (!activeConversation || !socketRef.current) return;

    const room = String(activeConversation.id);

    if (roomRef.current) {
      console.log("👋 Leaving room:", roomRef.current);
      socketRef.current.emit(
        "binary-message",
        msgpack.encode({ e: "leave-room", p: { room: roomRef.current } })
      );
    }

    console.log("🚪 Joining room:", room);

    socketRef.current.emit(
      "binary-message",
      msgpack.encode({ e: "join-room", p: { room } })
    );

    roomRef.current = room;
    dedupeMap.current.clear();
    fetchMessages(room);
  }, [activeConversation]);

  useEffect(() => {
    fetchConversations();
  }, [page, search]);

  const fetchConversations = async () => {
    const res = await getRequest(
      `${PROVIDER.GET_CONVERSTIONS}?search=${search}&page=${page}&limit=${PAGE_SIZE}`
    );
    setConversations(res?.data?.data?.data || []);
  };

  const fetchMessages = async (id: string) => {
    const res = await getRequest(
      `${PROVIDER.GET_CONVERSTION_BY_ID}/${id}/messages`
    );

    const list = res?.data?.data?.messages || [];

    const sorted = [...list].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sorted.forEach((m) => {
      const key = `${m.conversationId}_${m.senderId}_${m.message}_${m.createdAt}`;
      dedupeMap.current.add(key);
    });

    setMessages(sorted);
  };

  /* ---------------- FILE ---------------- */
  const handleFileSelect = async (file: File) => {
    setUploading(true);
    const uploaded = await uploadFile(file);

    let type = "file";
    if (file.type.startsWith("image")) type = "image";
    if (file.type.startsWith("video")) type = "video";
    if (file.type.startsWith("audio")) type = "audio";

    setAttachment({
      file: uploaded.file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type,
    });

    setUploading(false);
  };

  const sendMessage = async () => {
    if (!activeConversation || (!input.trim() && !attachment)) return;

    const payload = {
      conversationId: String(activeConversation.id),
      senderId: userId,
      message: input.trim(),
      attachmentUrl: attachment?.file || "",
      type: attachment?.type || "text",
      createdAt: new Date().toISOString(),
    };

    console.log("📤 SEND:", payload);

    setMessages((prev) => [...prev, payload]);

    const key = `${payload.conversationId}_${payload.senderId}_${payload.message}_${payload.createdAt}`;
    dedupeMap.current.add(key);

    socketRef.current.emit(
      "binary-message",
      msgpack.encode({ e: "receive-message", p: payload })
    );

    setInput("");
    setAttachment(null);

    await postRequest(PROVIDER.SEND_MESSAGE, payload);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <>
      <h1 className="text-2xl dark:text-neutral-100 font-bold mb-4 hidden md:block">Messages</h1>
      <div className="flex flex-nowrap w-full whitespace-nowrap overflow-hidden md:overflow-visible md:gap-2">
        <div className="bg-white dark:bg-darkmode basis-full flex-shrink-0 md:basis-auto md:w-80">
          {/* <div className="flex justify-between border-b border-gray-200 p-3">
            <span className="dark:text-neutral-300">Messages</span>
            <Plus
              size={20}
              className="cursor-pointer hover:text-secondary dark:text-neutral-300"
              onClick={() => setShowchatModal(true)}
            />
          </div> */}

          <div className="p-3">
            <InputGroup
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher"
            />
          </div>

          <div className="h-[calc(100dvh-220px)] overflow-y-auto">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConversation(c)}
                className="p-3 hover:bg-gray-100 hover:dark:bg-white/5 cursor-pointer user-listing"
              >
                <div className="flex items-center gap-2">
                  {c.profileImg ? (
                    <img
                      src={c.profileImg}
                      className="w-9 h-9 shrink-0 rounded-full object-cover"
                      alt={c.name}
                    />
                  ) : (
                    <div className="w-9 h-9 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
                      {c?.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 truncate">
                    <p className="font-medium dark:text-neutral-300">{c.name}</p>
                    <p className="text-xs text-gray-600 dark:text-neutral-300">
                      {c.lastMessage}
                    </p>
                  </div>
                  <small className="text-xs dark:text-neutral-300">
                    {c.lastMessageAt ? timeAgo(c.lastMessageAt) : ""}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`bg-white dark:bg-darkmode basis-full flex-shrink-0 md:basis-auto md:flex-1 flex flex-col
    ${activeConversation ? "ml-[-100%] md:ml-0" : ""}
  `}
        >
          {activeConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-200 p-3 dark:text-neutral-300">
                <ArrowLeft
                  onClick={() => setActiveConversation(null)}
                  className="cursor-pointer hover:text-secondary block md:hidden"
                />
                {activeConversation.name}
              </div>

              <div className="h-[calc(100dvh-300px)] overflow-y-auto p-3">
                {messages.map((m, i) => {
                  const mine = Number(m.senderId) === userId;
                  const url = `${IMAGE_URL}/${m.attachmentUrl}`;

                  return (
                    <div key={i} className={mine ? "text-right" : ""}>
                      <div
                        className={`inline-block p-2 mb-2 rounded text-sm ${
                          mine ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                      >
                        {m.type === "image" && (
                          <img src={url} className="mb-2 rounded max-w-3xs" />
                        )}
                        {m.type === "video" && (
                          <video
                            src={url}
                            controls
                            className="mb-2 max-w-3xs"
                          />
                        )}
                        {m.type === "audio" && <audio src={url} controls />}
                        {m.type === "file" && (
                          <a href={url}>
                            <File size={16} /> {m.attachmentUrl}
                          </a>
                        )}
                        <div>{m.message}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {attachment && (
                <div className="border-t border-gray-200 p-2 flex gap-2 items-center bg-gray-100">
                  {attachment.type === "image" && (
                    <img src={attachment.preview} className="w-20 rounded" />
                  )}
                  {attachment.type === "video" && (
                    <video src={attachment.preview} controls className="w-28" />
                  )}
                  {attachment.type === "audio" && (
                    <audio src={attachment.preview} controls />
                  )}
                  {attachment.type === "file" && <span>{attachment.name}</span>}
                  <X
                    className="cursor-pointer text-red-600"
                    onClick={() => setAttachment(null)}
                  />
                </div>
              )}

              <div className="flex gap-2 p-3">
                <div className="flex items-center">
                  <input
                    hidden
                    type="file"
                    id="chat-file"
                    onChange={(e: any) => handleFileSelect(e.target.files[0])}
                  />
                  <label htmlFor="chat-file">
                    {uploading ? (
                      <Loader2
                        size={18}
                        className="text-blue-500 animate-spin"
                      />
                    ) : (
                      <Paperclip
                        size={18}
                        className="text-gray-600 cursor-pointer hover:text-blue-500"
                      />
                    )}
                  </label>
                </div>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full px-3 py-3 sm:text-base outline-none border-inputborder placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                  placeholder="Tapez votre message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                  onClick={sendMessage}
                  className="bg-blue-500 w-[49.6px] h-[49.6px] rounded-full flex justify-center items-center shrink-0 text-white cursor-pointer transition-all hover:bg-blue-700"
                >
                  <SendHorizonal />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <MessageCircle className="dark:text-neutral-300" />{" "}
              <span className="ml-2 dark:text-neutral-300">Sélectionner une conversation</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat modal */}

      <OuterModal active={showchatModal} setActive={setShowchatModal}>
        <div className="max-w-lg mx-auto bg-white dark:bg-darkmode p-6 rounded-xl shadow-lg mt-10 relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setShowchatModal(false);
            }}
          />
          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-300">
            Nouvelle conversation
          </h2>

          <form className="space-y-3">
            <div>
              <InputGroup
                label="Nom"
                placeholder="Recherche d’un prestataire de services"
              />
            </div>
            <div>
              <InputGroup
                type="textarea"
                label="Message"
                placeholder="Écrivez votre message ici..."
              />
            </div>

            <div>
              <Button
                size="large"
                className="w-full"
                onClick={() => setShowchatModal(false)}
              >
                Envoyer le message
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
    </>
  );
};

export default ClientChat;
