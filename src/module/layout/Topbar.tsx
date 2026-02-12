import { Bell } from "lucide-react";
import ThemeToggleSwitch from "../../components/Mode";
import { useEffect, useRef, useState } from "react";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Topbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const login = useSelector((state: any) => state.login);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${PROVIDER.NOTIFACTIONS}/list?page=1&limit=3`
      );
      
      setNotifications(res?.data?.data?.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <Bell size={36} className="mb-3 text-gray-300" />
      <span className="text-sm">Aucune notification</span>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-3 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();
  
  return (
    <>
      <div className="bg-white w-full dark:bg-darkmode px-0 sm:px-4 sm:py-3 flex items-center justify-between">
        <div className="hidden sm:block">
          <span
            data-no-translate
            className="md:text-lg capitalize dark:text-neutral-300"
          >
            Bonjour, {login?.user?.firstName || "User"}
          </span>
        </div>

        <div
          className="relative flex gap-1 sm:gap-3 items-center"
          ref={dropdownRef}
        >
          {/* Bell */}
          {login?.user?.role !== "admin" && (
            <button
              onClick={() => setOpen((p) => !p)}
              className="w-8 h-8 sm:w-10 sm:h-10 border border-borderlight dark:border-gray-600 flex justify-center items-center rounded-full hover:bg-gray-50 cursor-pointer"
            >
              <Bell className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* Dropdown */}

          {open && (
            <div className="absolute right-0 top-12 w-60 sm:w-80 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-white/20 text-sm dark:text-neutral-300">
                Notifications
              </div>

              {/* CONTENT */}
              <div className="max-h-80 overflow-y-auto">
                <div className="divide-y-1 divide-gray-200 dark:divide-white/20">
                  {loading ? (
                    <SkeletonList />
                  ) : notifications.length === 0 ? (
                    <EmptyState />
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-500"
                      >
                        <p className="text-sm font-medium dark:text-neutral-300">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 dark:text-neutral-300">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-white/20 text-center">
                <button
                  onClick={() => {
                    if (login?.user?.role === "partner") {
                      navigate("/provider/notifications");
                    } else {
                      navigate("/client/notifications");
                    }
                    setOpen(false);
                  }}
                  className="hover:text-secondary dark:text-neutral-300 text-sm cursor-pointer"
                >
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}

          <div className="accessbility-mode">
            <ThemeToggleSwitch />
          </div>
        </div>
      </div>
    </>
  );
}

export default Topbar;
