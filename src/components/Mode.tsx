import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleSwitch() {
  const [dark, setDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
                 bg-secondary dark:bg-gray-800 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {/* Sun */}
      <Sun
        className={`absolute w-5 h-5 transition-all duration-300
          ${dark ? "scale-0 rotate-90 opacity-0" : "scale-100 opacity-100 text-yellow-500"}`}
      />

      {/* Moon */}
      <Moon
        className={`absolute w-5 h-5 transition-all duration-300
          ${dark ? "scale-100 opacity-100 text-blue-400" : "scale-0 -rotate-90 opacity-0"}`}
      />
    </button>
  );
}
