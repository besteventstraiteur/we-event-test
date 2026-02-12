import React from "react";
import HomeHeader from "../../components/Header";
import Footer from "../../components/Footer";
import { Outlet, useLocation, matchPath } from "react-router-dom";

const WebsiteLayout: React.FC = () => {
  const location = useLocation();

  // Exact static paths
  const noHeaderFooterPages = [
    "/login",
    "/register",
    "/account-created",
    "/forget-password",
    "/email-sent",
    "/password-changed",
  ];

  // Match either static OR dynamic paths
  const hideHeaderFooter =
    noHeaderFooterPages.includes(location.pathname) ||
    matchPath("/reset-password/:token", location.pathname);

  return (
    <>
      {!hideHeaderFooter && <HomeHeader />}

      <Outlet />

      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default WebsiteLayout;
