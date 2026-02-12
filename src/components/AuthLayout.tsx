import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import lightmode from "../assets/images/Login-Screen.jpg";
import darkmode from "../assets/images/dashboard-dark.jpg";
import ThemeToggleSwitch from "./Mode";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(localStorage.getItem("theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="fixed top-5 right-5">
      <ThemeToggleSwitch />
      </div>
      <div
        className="w-full min-h-screen bg-cover bg-fixed flex justify-center pt-2 pb-10 flex-col"
        style={{
          backgroundImage: `url(${theme === "light" ? lightmode : darkmode})`,
        }}
      >
        <div className="container flex items-center justify-center mx-auto">
          <Logo />
        </div>
        <div className="container-1180">
        <div className="w-full max-w-lg mx-auto p-5 md:p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <h1 className="text-3xl font-bold text-center mb-3 dark:text-neutral-300">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-base text-center dark:text-neutral-300">
              {subtitle}
            </p>
          )}

          <div className="mt-10">{children}</div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
