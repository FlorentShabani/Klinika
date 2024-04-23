import { ReactNode, Fragment, useEffect } from "react";
import {
  patient_routes as patient,
  developer_routes as dev,
  Starred,
} from "../features/sidebar/__sidebar";
import { CaretDown, Folder, FolderOpen } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import { categoryRender } from "../util/category-render";
import { Header, Profile, Resizer } from "../features/sidebar/__sidebar";
import { zNavigation } from "../features/navigation/__navigation";

interface InnerProp {
  user: string;
  children: ReactNode;
}

export default function Sidebar({ user, children }: InnerProp) {
  const {
    sidebar,
    notification,
    isCollapsed,
    handleCategory,
    active_category,
    setData,
    data,
    setType,
    collapse,
    handleActiveLink,
    folder,
    handleFolder,
    handleRecents,
    active_link,
  } = zNavigation();

  useEffect(() => {
    setType(user);
    switch (user) {
      case "dev":
        setData(dev);
        break;
      case "patient":
        setData(patient);
        break;
      default:
        break;
    }
  }, [user]);

  return (
    <div className="z-10 flex flex-row bg-white">
      <div
        className={`z-40 relative border-r-2 transition-all duration-300 overflow-hidden ${
          sidebar
            ? `${
                isCollapsed
                  ? "w-20 min-w-[5rem] max-w-[10rem]"
                  : "w-[22rem] min-w-[19rem] max-w-[22rem]"
              } max-h-fit`
            : "h-0 w-0"
        }`}
      >
        <div className="flex items-center justify-center p-2">
          {sidebar && (
            <div className="flex flex-col items-center justify-between w-full py-1.5">
              <Profile effect={isCollapsed} />
              <Starred />
              <div className="flex flex-col px-2 justify-between w-full overflow-clip">
                {data.map((link) => (
                  <Fragment key={link.id}>
                    <button
                      type="button"
                      onClick={() => {
                        handleCategory(link.id);
                        {
                          isCollapsed && collapse();
                        }
                      }}
                      className={`flex w-full select-none items-center justify-between py-2 text-black active:bg-gray-50 `}
                    >
                      <div
                        className={`flex items-center gap-1 transition duration-300 truncate ${
                          isCollapsed
                            ? "w-full justify-center hover:opacity-70"
                            : "w-40 justify-start"
                        } ${
                          active_category.includes(link.id)
                            ? "text-black"
                            : "text-neutral-600"
                        }`}
                      >
                        {categoryRender(link.category)}
                        {!isCollapsed && <span>{link.category}</span>}
                      </div>
                      {!isCollapsed && (
                        <span
                          className={`transition duration-500 ${
                            active_category.includes(link.id)
                              ? "rotate-180 text-black"
                              : "text-gray-400"
                          }`}
                        >
                          <CaretDown size={18} weight="bold" />
                        </span>
                      )}
                    </button>
                    <div className="ml-3 pl-4 border-l-2 border-zinc-200">
                      {!isCollapsed &&
                        active_category.includes(link.id) &&
                        link.folders.map((folders) => (
                          <Fragment key={folders.id}>
                            <button
                              title={folders.name}
                              type="button"
                              onClick={() => handleFolder(folders.id)}
                              className={`flex flex-row gap-1.5 py-1.5 items-center w-full`}
                            >
                              {folder.includes(folders.id) ? (
                                <FolderOpen size={22} weight="duotone" />
                              ) : (
                                <Folder size={22} weight="duotone" />
                              )}
                              <span className="text-sm">{folders.name}</span>
                            </button>
                            <div className="flex flex-col items-center ml-2 border-l-2 border-zinc-400">
                              {folder.includes(folders.id) &&
                                folders.links.map((links) => {
                                  const mark = {
                                    to: links.to,
                                    text: links.text,
                                  };
                                  return (
                                    <div
                                      key={links.text}
                                      className="flex flex-row py-0.5 pl-2 items-center w-56"
                                    >
                                      <NavLink
                                        key={links.to}
                                        to={links.to}
                                        onClick={() => {
                                          handleActiveLink(mark);
                                          handleRecents(mark);
                                        }}
                                        className={({ isActive }) =>
                                          `text-black ${
                                            isActive
                                              ? "bg-zinc-50 text-gray-900"
                                              : " text-gray-600 hover:text-gray-800"
                                          } truncate w-full px-2 text-start rounded-sm gap-1 py-0.5 text-sm font-normal transition duration-300`
                                        }
                                      >
                                        {!isCollapsed && links.text}
                                      </NavLink>
                                    </div>
                                  );
                                })}
                            </div>
                          </Fragment>
                        ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full relative">
        {sidebar && <Resizer />}

        <Header />
        {children}
      </div>
      <div
        className={`z-40 relative border-l-2 transition-all duration-300 overflow-hidden ${
          notification ? "w-80 max-h-fit" : "h-0 w-0"
        }`}
      ></div>
    </div>
  );
}

// function handleRecent(recent: string) {
//   if (links.recent_links.length <= 3) {
//     setLinks((prev) => {
//       const isActive = prev.recent_links.includes(recent);
//       if (isActive) {
//         return {
//           ...prev,
//           recent_links: prev.recent_links.filter(
//             (recents) => recents !== recent
//           ),
//         };
//       } else {
//         return {
//           ...prev,
//           recent_links: [...prev.recent_links, recent],
//           active_link: recent,
//         };
//       }
//     });
//   } else {
//     console.log("filled stack");
//   }
// }
