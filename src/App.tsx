import { Suspense, useEffect, useState } from "react";
import "./App.css";
import AppWrapper from "./AppWrapper";
import LazyLoadingFallback from "./components/shared/LazyLoadingFallback";
import AppRouter from "./components/AppRouter";
import MetaTags from "./components/seo/MetaTags";
import { ToastProvider } from "./utils/toast";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./redux/store";
import LanguageSwitcherWithImages from "./components/Header/LanguageSwitcherWithImages";
import { PersistGate } from "redux-persist/integration/react";
import { ChevronsUp } from "lucide-react";
import { motion } from "motion/react";
import ScrollToTop from "./components/ui/scrooltotop";
import Loaderimage from "../src/assets/images/Loader.gif";
import { useLocation } from "react-router-dom";
import { requestNotificationPermission } from "./utils/notifications";

function AppContent() {
  const [open, setOpen] = useState(false);
  const loader = useSelector((state: any) => state?.request?.loader);

  const { pathname } = useLocation();

  // ROUTES WHERE LANG SWITCHER MUST NOT APPEAR
  const hiddenRoutesExact = [
    "/",
    "/home",
    "/login",
    "/register",
    "/payment-success",
    "/payment-failed",
    "/account-created",
    "/email-sent",
    "/forget-password",
    "/password-changed",
    "/contact",
    "/partners",
  ];
  useEffect(() => {
    const initNotifications = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        await saveFcmToken(token);
      }
    };

    initNotifications();
  }, []);

  const hiddenRoutesStartsWith = [
    "/partners/",
    "/reset-password/",
    "/view-document/",
  ];

  const hideLanguageSwitcher =
    hiddenRoutesExact.includes(pathname) ||
    hiddenRoutesStartsWith.some((r) => pathname.startsWith(r));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(() => console.log("✅ FCM SW registered"))
      .catch(console.error);
  }

  return (
    <>
      <ScrollToTop />
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          {!hideLanguageSwitcher && (
            <div
              className={`fixed right-3 z-10 transition-all duration-300 bg-white py-3 px-6 rounded-tl-2xl cursor-pointer rounded-tr-2xl w-[280px] shadow-2xl ${
                open ? "bottom-0" : "-bottom-14"
              }`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-base">Select language</p>
                <div className="overflow-hidden w-5 h-5">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -20 }}
                    transition={{
                      duration: 0.75,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <ChevronsUp />
                  </motion.div>
                </div>
              </div>

              {/* <LanguageSwitcherWithImages /> */}
            </div>
          )}

          {loader && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center hero-section backdrop-blur-xs text-white">
              <img src={Loaderimage} alt="loader" className="max-w-52" />
            </div>
          )}

          <Suspense fallback={<LazyLoadingFallback />}>
            <div id="app-content">
              <MetaTags
                title="Bienvenue sur We Event"
                description="WeEvent est la plateforme tout-en-un pour organiser vos événements."
              />
              <AppRouter />
            </div>
          </Suspense>
        </ToastProvider>
      </PersistGate>
    </>
  );
}

export default function App() {
  return (
    <AppWrapper>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </AppWrapper>
  );
}
