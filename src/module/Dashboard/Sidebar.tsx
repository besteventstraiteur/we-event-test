// Sidebar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Logo from "../../assets/images/WE-Event-Logo.svg";
import CustomModal from "../../components/Custommodal";
import { useState } from "react";
import Button from "../../components/ui/Button";
import { X } from "lucide-react";
import OuterModal from "../../components/Custommodal/OuterModal";
export type SidebarLink = {
  to?: string;
  labelKey: string;
  icon: ReactNode;
  end?: boolean;
  children?: SidebarLink[];
  requiredFeature?: string;
};

type SidebarProps = {
  links: SidebarLink[];
  bottomLink?: SidebarLink;
  className?: string;
  widthClass?: string;
  onNavigate?: (to?: string) => boolean;
};

function Sidebar({
  open,
  setOpen,
  links,
  bottomLink,
  className = "",
  widthClass = "w-72",
  onNavigate,
}: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const baseItem =
    "flex items-center gap-3 capitalize p-3 rounded-lg transition-all duration-300";
  const inactiveItem =
    "border border-transparent hover:border-secondary text-gray-600  hover:text-secondary";
  const activeItem = "bg-secondary text-white hover:bg-tertiary";

  const bottomInactive =
    "border border-white text-gray-600 bg-gray-300 dark:bg-white hover:bg-secondary hover:text-white";
  const bottomActive = "bg-primary text-white";

  const [addExpense, setAddExpense] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
    setAddExpense(false);
  };
  return (
    <>
      <div
        className={`w-full lg:w-72 h-dvh lg:h-dvh bg-white dark:bg-darkmode border-r border-gray-200 dark:border-gray-600 py-5 px-6 fixed z-30 lg:sticky top-0 transition-all duration-300 ease-in-out ${
          open ? ` left-0  ${className}` : ` -left-full ${className}`
        } `}
      >
        <div className="flex flex-col h-dvh justify-between gap-5">
          <div>
            <Link to="/">
              <img
                src={Logo}
                alt="we event"
                className="max-w-[180px] lg:mx-auto mb-6"
              />
            </Link>

            <X
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 lg:hidden dark:text-primary"
            />

            <div
              className="nav-overflow overflow-y-auto"
              style={{ maxHeight: "calc(100dvh - 150px)" }}
            >
              <ul className="space-y-2">
                {links.map((link) => {
                  const isDropdown = !!link.children;
                  const isOpen = openDropdown === link.labelKey;

                  return (
                    <li key={link.labelKey}>
                      <div
                        onClick={() => {
                          if (isDropdown) {
                            setOpenDropdown(isOpen ? null : link.labelKey);
                          } else {
                            const canNavigate = onNavigate
                              ? onNavigate(link.to, link.requiredFeature)
                              : true;

                            if (!canNavigate) return;

                            navigate(link.to!);
                            setOpen(false);
                          }
                        }}
                        className={`${baseItem} ${inactiveItem} cursor-pointer flex justify-between items-center`}
                      >
                        <div className="flex items-center gap-3">
                          {link.icon}
                          {link.labelKey}
                        </div>

                        {isDropdown && (
                          <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
                        )}
                      </div>

                      {isDropdown && isOpen && (
                        <ul className="ml-5 mt-1 space-y-1">
                          {link.children!.map((child) => (
                            <li key={child.to}>
                              <NavLink
                                to={child.to!}
                                onClick={(e) => {
                                  const canNavigate = onNavigate
                                    ? onNavigate(
                                        child.to,
                                        child.requiredFeature,
                                      )
                                    : true;

                                  if (!canNavigate) {
                                    e.preventDefault();
                                    return;
                                  }

                                  setOpen(false);
                                }}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 p-2 rounded-md text-sm ${
                                    isActive
                                      ? "bg-secondary text-white"
                                      : "text-gray-600 hover:text-secondary"
                                  }`
                                }
                              >
                                {child.icon}
                                {child.labelKey}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {bottomLink && (
            <div className="mb-10">
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  setAddExpense(true);
                }}
                to={bottomLink.to}
                end={bottomLink.end}
                className={({ isActive }) =>
                  `${baseItem} ${isActive ? bottomActive : bottomInactive}`
                }
              >
                {bottomLink.icon}
                {bottomLink.labelKey}
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <OuterModal active={addExpense} setActive={setAddExpense}>
        <div className="container-1180">
          <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E]">
            <h2 className="text-2xl font-bold text-center mb-3 dark:text-neutral-300">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </h2>
            <p className="text-gray-600 text-base text-center dark:text-neutral-300">
              Vous serez déconnecté de votre compte
            </p>

            <div className="event-create mt-10">{/* Form fields here */}</div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => setAddExpense(false)}
                className="w-full"
                variant="outline"
                size="large"
              >
                Rester connecté
              </Button>

              <Button
                className="w-full"
                variant="danger"
                size="large"
                onClick={() => handleLogout()}
              >
              Oui, se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </OuterModal>
    </>
  );
}

export default Sidebar;
