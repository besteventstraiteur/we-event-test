import React, { useState } from "react";
import Logo from "../../components/Logo";
import lightmode from "../../assets/images/Login-Screen.jpg";
import darkmode from "../../assets/images/dashboard-dark.jpg";
import { CircleX } from "lucide-react";
import { Link } from "react-router-dom";

function CustomModal({
  children,
  active,
  setActive,
}: {
  children: React.ReactNode;
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );
  return (
    <div
      className={`w-full min-h-screen bg-cover bg-fixed overflow-y-auto fixed top-0 left-0 h-100 flex pt-2 pb-10 z-80 flex-col transition-all duration-300
          ${active ? "visible opacity-100" : "invisible opacity-0"}`}
      style={{
        backgroundImage: `url(${theme === "light" ? lightmode : darkmode})`,
      }}
    >
      <span
        className="flex items-center gap-1 bg-gray-200 fixed top-5 right-5 rounded-3xl px-3 py-2 cursor-pointer transition-all duration-300 hover:bg-black hover:text-white"
        onClick={() => setActive(false)}
      >
        <CircleX /> Close
      </span>
      <div className="container flex items-center justify-center">
        <Logo />
      </div>

      {children}
    </div>
  );
}

export default CustomModal;
