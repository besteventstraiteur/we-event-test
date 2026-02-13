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
import ProvidersList from "../pages/ProvidersList";
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
import ProviderDetailsV2 from "../pages/ProviderDetailsV2";
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
// Test Pages - All Modules
import GlobalSystemTestPage from "../pages/GlobalSystemTestPage";
import EventModuleTestPage from "../pages/EventModuleTestPage";
import PackageModuleTestPage from "../pages/PackageModuleTestPage";
import BookingModuleTestPage from "../pages/BookingModuleTestPage";
import MessageModuleTestPage from "../pages/MessageModuleTestPage";
import RatingModuleTestPage from "../pages/RatingModuleTestPage";
import PhotoModuleTestPage from "../pages/PhotoModuleTestPage";
import VideoModuleTestPage from "../pages/VideoModuleTestPage";
import TaskModuleTestPage from "../pages/TaskModuleTestPage";
import ContractModuleTestPage from "../pages/ContractModuleTestPage";
import InvoiceModuleTestPage from "../pages/InvoiceModuleTestPage";
import InspirationModuleTestPage from "../pages/InspirationModuleTestPage";
import CategoryModuleTestPage from "../pages/CategoryModuleTestPage";
import PodcastModuleTestPage from "../pages/PodcastModuleTestPage";
import BadgeModuleTestPage from "../pages/BadgeModuleTestPage";
import ReviewModuleTestPage from "../pages/ReviewModuleTestPage";
import NotificationModuleTestPage from "../pages/NotificationModuleTestPage";
import DisputeModuleTestPage from "../pages/DisputeModuleTestPage";
import PlaylistModuleTestPage from "../pages/PlaylistModuleTestPage";
import MenuModuleTestPage from "../pages/MenuModuleTestPage";
import FloorPlanModuleTestPage from "../pages/FloorPlanModuleTestPage";
import MiniSiteModuleTestPage from "../pages/MiniSiteModuleTestPage";
import AmbassadorModuleTestPage from "../pages/AmbassadorModuleTestPage";
import AnalyticsModuleTestPage from "../pages/AnalyticsModuleTestPage";

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Test Module Routes - All 23 Modules */}
          <Route path="/test/global-system" element={<GlobalSystemTestPage />} />
          <Route path="/test/event-module" element={<EventModuleTestPage />} />
          <Route path="/test/package-module" element={<PackageModuleTestPage />} />
          <Route path="/test/booking-module" element={<BookingModuleTestPage />} />
          <Route path="/test/message-module" element={<MessageModuleTestPage />} />
          <Route path="/test/rating-module" element={<RatingModuleTestPage />} />
          <Route path="/test/photo-module" element={<PhotoModuleTestPage />} />
          <Route path="/test/video-module" element={<VideoModuleTestPage />} />
          <Route path="/test/task-module" element={<TaskModuleTestPage />} />
          <Route path="/test/contract-module" element={<ContractModuleTestPage />} />
          <Route path="/test/invoice-module" element={<InvoiceModuleTestPage />} />
          <Route path="/test/inspiration-module" element={<InspirationModuleTestPage />} />
          <Route path="/test/category-module" element={<CategoryModuleTestPage />} />
          <Route path="/test/podcast-module" element={<PodcastModuleTestPage />} />
          <Route path="/test/badge-module" element={<BadgeModuleTestPage />} />
          <Route path="/test/review-module" element={<ReviewModuleTestPage />} />
          <Route path="/test/notification-module" element={<NotificationModuleTestPage />} />
          <Route path="/test/dispute-module" element={<DisputeModuleTestPage />} />
          <Route path="/test/playlist-module" element={<PlaylistModuleTestPage />} />
          <Route path="/test/menu-module" element={<MenuModuleTestPage />} />
          <Route path="/test/floorplan-module" element={<FloorPlanModuleTestPage />} />
          <Route path="/test/minisite-module" element={<MiniSiteModuleTestPage />} />
          <Route path="/test/ambassador-module" element={<AmbassadorModuleTestPage />} />
          <Route path="/test/analytics-module" element={<AnalyticsModuleTestPage />} />
          
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
          />
          <Route
            path="/providers-list"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <ProvidersList />
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
            path="/partners-v2/:id"
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <ProviderDetailsV2 />
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
