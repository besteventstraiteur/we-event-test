import React from "react";
import { CircleX } from "lucide-react";

function OuterModal({
  children,
  active,
  setActive,
  showClose,
}: {
  children: React.ReactNode;
  active: boolean;
  showClose: boolean;
  setActive: (v: boolean) => void;
}) {
  if (!active) return null;
  return (
    <div
      translate="no"
      className={`w-full bg-black/60 min-h-screen overflow-y-auto fixed top-0 left-0 h-100 px-5 pt-10 pb-10 z-50 transition-all duration-300
          ${active ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      {showClose && (
        <span
          className="flex items-center gap-1 bg-gray-200 fixed top-5 right-5 rounded-3xl px-3 py-2 cursor-pointer transition-all duration-300 hover:bg-black hover:text-white"
          onClick={() => setActive(false)}
        >
          <CircleX /> Close
        </span>
      )}

      {children}
    </div>
  );
}

export default OuterModal;
