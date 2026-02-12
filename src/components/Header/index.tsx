import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import WeEventLogo from "../WeEventLogo";
import logo from "../../assets/images/WE-Event-Logo.svg";
import { useSelector } from "react-redux";
import { LogOut, Menu, NotebookPen, User, X } from "lucide-react";

const HomeHeader: React.FC = () => {
  
  const login = useSelector((state: any) => state.login);
  const [mobilemenu, setMobilemenu] = useState(false);
 
  useEffect(() => {
    if (mobilemenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [mobilemenu]);

  return (
    <header className="container-large bg-primary  fixed top-0 left-0 right-0 z-50 px-0 rounded-b-4xl shadow-sm">
      <div className="bg-secondary flex justify-center py-2 px-4">
        <p className="text-white text-sm">Bienvenue sur We Event</p>
      </div>
      <div className="w-full py-2 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="items-start shrink-0 flex">
            <img
              src={logo}
              alt="We Event"
              className="w-full max-h-12 max-w-36"
            />
          </Link>

          <nav className="flex items-center gap-4 ml-auto lg:ml-0 md:gap-16">
            <div className="hidden lg:flex gap-10">
              <Link
                to="/"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                Accueil
              </Link>

              {/* <Link
                to="/"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                Explorer
              </Link> */}

              {/* <Link
                to="/"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                Prestataires
              </Link> */}

              {/* <Link
                to="/contact"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                FAQ
              </Link> */}

              <Link
                to="/partners"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                Partenaires
              </Link>
              <Link
                to="/contact"
                className="font-inter text-base text-gray-600 hover:text-[#1f79aa] transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>
          <div className="hidden [@media(min-width:567px)]:flex">
            {login?.user?.email ? (
              <div className="flex gap-3">
                <Link
                  to={
                    login?.user?.role === "admin"
                      ? "/admin/dashboard"
                      : login?.user?.role === "partner"
                      ? "/provider/dashboard"
                      : "/client/dashboard"
                  }
                >
                  <Button
                    variant="primary"
                    size="medium"
                    className="!rounded-full !py-1 hover:!bg-[#1f79aa"
                  >
                    <User size={20} className="mr-1" /> Profil
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login">
                  <Button
                    variant="primary"
                    size="medium"
                    className="!rounded-full !bg-white !text-secondary !py-1 hover:!text-white hover:!bg-[#1f79aa]"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="medium"
                    className="!rounded-full !py-1"
                  >
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div
            className={`mobile-menu flex flex-col gap-8 justify-between bg-white fixed z-50 w-full h-dvh top-0 px-5 py-10 lg:hidden transition-all duration-300 
          ${mobilemenu ? "left-0" : "-left-full"}`}
          >
            <X
              className="absolute right-5 top-5"
              id="close-toggle"
              onClick={() => setMobilemenu(false)}
            />
            <div>
              <img src={logo} alt="we event" className="max-w-48 mb-5" />
              <div className="space-y-4">
                <div>
                  <Link
                    to="/"
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setMobilemenu(false)}
                  >
                    Accueil
                  </Link>
                </div>

                {/* <div>
                  <Link
                    to="/"
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setMobilemenu(false)}
                  >
                    Explorer
                  </Link>
                </div> */}

                <div>
                  <Link
                    to="/partners"
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setMobilemenu(false)}
                  >
                    Prestataires
                  </Link>
                </div>

                {/* <div>
                  <Link
                    to="/"
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setMobilemenu(false)}
                  >
                    {t("Providers")}
                  </Link>
                </div> */}

                {/* <div>
                  <Link
                    to="/contact"
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setMobilemenu(false)}
                  >
                    FAQ
                  </Link>
                </div> */}

                <div>
                  <Link
                    to="/contact"
                    onClick={() => setMobilemenu(false)}
                    className="font-inter text-base text-gray-600 hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <div>
              {login?.user?.email ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    className="w-full"
                    to={`${
                      login?.user?.role === "admin"
                        ? "/admin/dashboard"
                        : login?.user?.role === "partner"
                        ? "/provider/dashboard"
                        : "/client/dashboard"
                    }`}
                  >
                    <Button variant="primary" size="medium" className="!w-full">
                      <User size={20} className="mr-1" /> Profil
                    </Button>
                  </Link>

                  <Link
                    className="w-full"
                    to={`${
                      login?.user?.role === "admin"
                        ? "/admin/dashboard"
                        : "/provider/dashboard"
                    }`}
                  >
                    <Button variant="outline" size="medium" className="!w-full">
                      <LogOut
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        size={20}
                        className="mr-1"
                      />{" "}
                      Déconnexion
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login">
                    <Button variant="primary" size="medium" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="medium" className="w-full">
                      Inscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <Menu
            className="lg:hidden ml-2"
            id="landing-toggle"
            onClick={() => setMobilemenu(true)}
          />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
