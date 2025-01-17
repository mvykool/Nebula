import { useState } from "react";
import { Page } from "../types/page.type";
import { useNavigate } from "react-router-dom";

interface PublicSidebarProps {
  projectName: string;
  pages: Page[];
  slug: string;
}

const PublicSidebar = ({ projectName, pages, slug }: PublicSidebarProps) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const navigate = useNavigate();

  const hideSidebar = () => {
    setIsHidden((previous) => !previous);
  };

  return (
    <div className={` absolute z-50 ${isHidden ? "w-2" : "w-2/12"}`}>
      <div
        className={`fixed left-0 top-40 h-[70vh] rounded-md transform transition-transform duration-200 ease-in-out
          ${isHidden ? "-translate-x-full" : "translate-x-0"}
          border border-gray-800 dark:border-gray-400 w-[10wv] text-black dark:text-white bg-bgLight dark:bg-bgDark`}
      >
        {/* Header */}
        <div className="flex justify-end items-center p-2">
          <button onClick={hideSidebar}>
            <i className="bx bxs-chevrons-left px-2 text-2xl border border-white rounded-lg"></i>
          </button>
        </div>

        {/* Pages List */}
        <div className="mt-2">
          <div className="flex gap-2 ml-5 w-[205px]">
            <button
              onClick={() => navigate(`/p/${slug}`)}
              className="font-bold tracking-wide text-black dark:text-white text-lg"
            >
              {projectName}
            </button>
          </div>

          <div className="w-full mt-2 px-4 space-y-2">
            {pages?.map((page: Page) => (
              <button
                key={page.id}
                onClick={() => navigate(`/p/${slug}/pages/${page.id}`)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle button when hidden */}
      <button
        className="fixed top-40 transition-transform duration-300 ease-in-out"
        onClick={hideSidebar}
      >
        <i
          className={`bx ${isHidden ? "bxs-chevrons-right bg-bgDark rounded-l h-20 flex items-center border border-white" : "hidden"} px-2 text-2xl border border-gray-800 rounded-lg`}
        ></i>
      </button>
    </div>
  );
};

export default PublicSidebar;
