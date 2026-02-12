import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "../module/NotFound";
import Profile from "../pages/client/Profile";
import Businessinfo from "../pages/provider/Business-info";
import Roadmap from "../pages/provider/Roadmap";
import Requests from "../pages/provider/Requests";
import Showcase from "../pages/provider/Createshowcase";
import Plans from "../pages/provider/Plans";
import Refferal from "../pages/provider/Refferal";
import Providerdashboard from "../pages/provider/Partner-dashboard";
import ReferralPayoutsPartner from "../pages/provider/ViewPayouts";
import ViewReferralD3 from "../pages/Admin/Viewrefferal";
import Tasks from "../pages/provider/Tasks";
import Recommendations from "../pages/provider/Recommendations";
import ProviderChat from "../pages/provider/Provider-Chat";
import Vendortraining from "../pages/provider/Vendortraining";
import Catalogue from "../pages/provider/Sales/Catalogue";
import Document from "../pages/provider/Sales/Document";
import Templates from "../pages/provider/Sales/Templates";
import Finance from "../pages/provider/Finance/Finance";
import Contacts from "../pages/provider/crm/Contacts";
import Scoring from "../pages/provider/crm/Scoring";
import Opportunites from "../pages/provider/crm/Opportunites";
import Emails from "../pages/provider/crm/Emailmanagment";
import Createtemplate from "../pages/provider/Sales/Create-template";
import Appointment from "../pages/provider/crm/Appointement";
import AIAssistant from "../pages/provider/crm/Ai-assistant";
import CrmOverview from "../pages/provider/crm/Overview";
import Automation from "../pages/provider/crm/Automation";
import Treasury from "../pages/provider/Finance/Treasury";
import Paymentsetting from "../pages/provider/Finance/Payment-setting";
import DocumentEditor from "../pages/provider/Sales/DocumentEditor";
import SupplierPage from "../pages/provider/crm/Supplier";
import Notifications from "../pages/provider/Notification";
import EmailTemplates from "../pages/provider/crm/Emailtemplate";
import FeatureRoute from "./FeatureRoute";

const ProviderRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="profile" element={<Profile />} />
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="/add-business-info" element={<Businessinfo />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/showcase" element={<Showcase />} />
      <Route path="/dashboard" element={<Providerdashboard />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/plans" element={<Plans />} />

      <Route
        path="/refferal"
        element={
          <FeatureRoute
            feature="referral"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Refferal />
          </FeatureRoute>
        }
      />

      <Route path="/view-payouts" element={<ReferralPayoutsPartner />} />
      <Route path="/view-refferal/:id" element={<ViewReferralD3 />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/recommendations" element={<Recommendations />} />
      {/* <Route path="/provider-chat" element={<ProviderChat />} /> */}

      <Route
        path="/provider-chat"
        element={
          <FeatureRoute
            feature="messaging"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <ProviderChat />
          </FeatureRoute>
        }
      />

      <Route path="/partner-training" element={<Vendortraining />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/document" element={<Document />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/scoring" element={<Scoring />} />
      {/* <Route path="/contacts" element={<Contacts />} /> */}

      <Route
        path="/contacts"
        element={
          <FeatureRoute
            feature="sales_crm"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Contacts />
          </FeatureRoute>
        }
      />
      <Route
        path="/opportunites"
        element={
          <FeatureRoute
            feature="sales_crm"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Opportunites />
          </FeatureRoute>
        }
      />

      <Route path="/create-template/:id" element={<Createtemplate />} />
      <Route path="/document-editor/:id" element={<DocumentEditor />} />
      <Route path="/email" element={<Emails />} />
      {/* <Route path="/automation" element={<Automation />} /> */}

      <Route
        path="/automation"
        element={
          <FeatureRoute
            feature="accounting"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Automation />
          </FeatureRoute>
        }
      />

      <Route path="/create-template" element={<Createtemplate />} />
      <Route path="/appointment" element={<Appointment />} />

      <Route
        path="/assistant"
        element={
          <FeatureRoute
            feature="commercial_ai"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <AIAssistant />
          </FeatureRoute>
        }
      />

      {/* <Route path="/assistant" element={<AIAssistant />} /> */}
      <Route path="/crm-overview" element={<CrmOverview />} />
      <Route path="/suppliers" element={<SupplierPage />} />
      {/* <Route path="/treasury" element={<Treasury />} /> */}

      <Route
        path="/treasury"
        element={
          <FeatureRoute
            feature="accounting"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Treasury />
          </FeatureRoute>
        }
      />

      {/* <Route path="/payment-setting" element={<Paymentsetting />} /> */}

      <Route
        path="/payment-setting"
        element={
          <FeatureRoute
            feature="accounting"
            onBlocked={() => {
              window.dispatchEvent(new CustomEvent("feature-blocked"));
            }}
          >
            <Paymentsetting />
          </FeatureRoute>
        }
      />

      <Route path="/notifications" element={<Notifications />} />
      <Route path="/email-templates" element={<EmailTemplates />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProviderRoutes;
