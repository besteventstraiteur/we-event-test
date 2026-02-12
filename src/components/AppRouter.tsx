import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from "./LoadingFallback";
import NotFound from "../module/NotFound";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import WebsiteLayout from "../module/layout/WebsiteLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProviderDashboardLayout from "../module/layout/ProviderDashboardLayout";
import LazyLoadingFallback from "./shared/LazyLoadingFallback";
import PartnersList from "../pages/PartnersList";
import ContactPage from "../pages/ContactPage";
import AccountCreatedPage from "../pages/AccountCreatedPage";
import ConfirmEmailPage from "../pages/Confirmmail";
import ForgetpasswordPage from "../pages/ForgetPassword";
import ResetpasswordPage from "../pages/ResetPassword";
import PasswordChangedSuccess from "../pages/Resetpasswordconfirm";
import ClientRoutes from "../routes/ClientRoutes";
import AdminDashboardLayout from "../module/layout/AdminDashboardLayout";
import AdminRoutes from "../routes/AdminRoutes";
import TermsPage from "../pages/TermsPage";
import PrivacyPage from "../pages/PrivacyPage";
import Providerdetails from "../pages/Provider-details";
import ProviderDetailsNew from "../pages/ProviderDetailsNew";
import ClientDashboardLayout from "../module/layout/ClientDashboardLayout";
import ProviderRoutes from "../routes/ProviderRoutes";
import ClientRequests from "../pages/client/Requests";
import Favourite from "../pages/client/Favourite";
import PaymentSuccess from "../pages/provider/PaymentSuccess";
import PaymentCancel from "../pages/provider/PaymentCancled";
import countdown from "../assets/images/countdown-2.webp";
import MiniSitePreview from "../pages/Minisite-Preview";
import Certificate from "../pages/Certificate";
import ViewDocument from "../pages/provider/Sales/DocumentView";

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentCancel />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/partners"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <PartnersList />
              </Suspense>
            }
          />{" "}
          <Route
            path="/partners/:id"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <Providerdetails />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route path="/account-created" element={<AccountCreatedPage />} />
          <Route path="/email-sent" element={<ConfirmEmailPage />} />
          <Route path="/forget-password" element={<ForgetpasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetpasswordPage />}
          />
          <Route
            path="/password-changed"
            element={<PasswordChangedSuccess />}
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Route>
        <Route path="/view-document/:id" element={<ViewDocument />} />
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              Layout={AdminDashboardLayout}
            />
          }
        >
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["partner"]}
              Layout={ProviderDashboardLayout}
            />
          }
        >
          <Route path="/provider/*" element={<ProviderRoutes />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["client"]}
              Layout={ClientDashboardLayout}
            />
          }
        >
          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/client/requests/:id" element={<ClientRequests />} />
          <Route path="/client/favourite" element={<Favourite />} />
        </Route>

        <Route path="*" element={<NotFound />} />

        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy-policy" element={<PrivacyPage />} />

        <Route path="mini-site-preview/:slug" element={<MiniSitePreview />} />
        <Route path="/:slug" element={<MiniSitePreview />} />
        <Route path="certificate" element={<Certificate />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
