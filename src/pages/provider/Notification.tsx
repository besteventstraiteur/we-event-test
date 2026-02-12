import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const LIMIT = 5;

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const login = useSelector((state: any) => state.login);
  
  const navigate = useNavigate();

  const fetchNotifications = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${PROVIDER.NOTIFACTIONS}/list?page=${pageNo}&limit=${LIMIT}`
      );

      const data = res?.data?.data;
      setNotifications(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("Fetch notifications error", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await patchRequest(`${PROVIDER.NOTIFACTIONS}/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark read error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await patchRequest(`${PROVIDER.NOTIFACTIONS}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all read error", err);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handleNotificationClick = async (item: any) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    if (item.type === "quote") {
      if (login?.user?.role === "partner") {
        navigate("/provider/requests");
      } else {
        return;
      }
    }
  };

  return (
    <>
      <div className="mb-6">
             <h1 className="text-2xl font-bold dark:text-neutral-300 mb-0">
              Notifications
            </h1>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">

        {/* Mark all read */}

        <div className="text-right">
          <button
            onClick={markAllAsRead}
            className="hover:text-secondary dark:text-neutral-300 text-sm cursor-pointer outline-0"
          >
            Tout marquer comme lu
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center text-sm text-gray-500 dark:text-neutral-300">
            Chargement des notifications...
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-neutral-300">
            Aucune notification trouvée
          </p>
        ) : (
          notifications.map((item) => {
            const isUnread = !item.isRead;

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`flex gap-2 p-3 rounded-lg border border-gray-100 relative pl-9 cursor-pointer
                  ${
                    isUnread
                      ? "bg-blue-100 dark:bg-blue-100 before:content-[''] before:absolute before:w-2 before:h-2 before:bg-green-400 before:left-[20px] before:top-[24px] before:rounded-full"
                      : "bg-white/70 dark:bg-blue-50"
                  }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                  {login?.user?.profilePictureUrl ? (
                    <img
                      src={login.user.profilePictureUrl}
                      alt={login?.user?.firstName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm uppercase">
                      {login?.user?.firstName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-600 text-sm">{item.message}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="disabled:opacity-50"
            >
              <ArrowLeft size={16} /> Précédent
            </Button>
         
            <Button
            variant="outline"
             size="small"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="disabled:opacity-50"
            >
              Suivant <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
