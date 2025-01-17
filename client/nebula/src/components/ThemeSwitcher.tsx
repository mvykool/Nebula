import { useState } from "react";

export const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <>
      {" "}
      <button
        type="button"
        className="rounded-full hover:bg-hover dark:hover:bg-opacity-30"
        onClick={toggleTheme}
      >
        {isDark ? (
          <i className="bx bx-moon text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
        ) : (
          <i className="bx bx-sun text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
        )}
      </button>
    </>
  );
};
