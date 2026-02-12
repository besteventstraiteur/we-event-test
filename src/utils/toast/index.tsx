// src/ui/toast/ToastProvider.tsx
import { createContext, useContext, useRef, useMemo, ReactNode } from "react";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css";               // core styles
import "primeicons/primeicons.css";                            // icons
type ShowToast = (msg: ToastMessage | ToastMessage[]) => void;

type ToastContextValue = {
  show: ShowToast;
  success: (summary: string, detail?: string, life?: number) => void;
  info: (summary: string, detail?: string, life?: number) => void;
  warn: (summary: string, detail?: string, life?: number) => void;
  error: (summary: string, detail?: string, life?: number) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const api = useMemo<ToastContextValue>(
    () => ({
      show: (msg) => toastRef.current?.show(msg),
      success: (summary, detail, life = 3000) =>
        toastRef.current?.show({ severity: "success", summary, detail, life }),
      info: (summary, detail, life = 3000) =>
        toastRef.current?.show({ severity: "info", summary, detail, life }),
      warn: (summary, detail, life = 4000) =>
        toastRef.current?.show({ severity: "warn", summary, detail, life }),
      error: (summary, detail, life = 5000) =>
        toastRef.current?.show({ severity: "error", summary, detail, life }),
      clear: () => toastRef.current?.clear(),
    }),
    []
  );

  return (
    <ToastContext.Provider value={api as ToastContextValue}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};
