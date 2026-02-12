// src/routes/ProviderRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "../module/NotFound";
import Profile from "../pages/client/Profilebck";
import AdminDashboard from "../pages/Admin/Dashboard";
import ManageContacts from "../pages/Admin/ManageContacts";
import ManageUsers from "../pages/Admin/ManageUsers";
import Managecontactpage from "../pages/Admin/Managecontactpage";
import Managehomepage from "../pages/Admin/Homepagecontent";
import ManageAllContent from "../pages/Admin/ManageContent";
import Manageplans from "../pages/Admin/Manageplans";
import Manageroadmap from "../pages/Admin/Manageroadmap";
import Statistics from "../pages/Admin/Statistics";
import Subscriptions from "../pages/Admin/Subscriptions";
import ManageSubscriptions from "../pages/Admin/ManageSubscription";
import AdminParrainage from "../pages/Admin/ManageReferral";
import Viewrefferal from "../pages/Admin/Viewrefferal";
import ReferralPayouts from "../pages/Admin/ManagePayouts";
import ViewReferralD3 from "../pages/Admin/Viewrefferal";
import Admintraining from "../pages/Admin/Admintraining";
import ManageRecomendation from "../pages/Admin/ManageRecomendation";
import ManageSubscribers from "../pages/Admin/ManageSubscriptionList";
import EmailTemplatesAdmin from "../pages/Admin/EmailtemplateAdmin";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* Profile */}
      <Route path="profile" element={<Profile />} />

      {/* Manage home page content */}
      <Route path="manage-content" element={<ManageAllContent />} />

      <Route path="manage-users" element={<ManageUsers />} />

      {/* Manage contact page */}
      <Route path="manage-contactpage/:id" element={<Managecontactpage />} />
      <Route path="manage-homepage/:id" element={<Managehomepage />} />
      <Route path="contact-enquires" element={<ManageContacts />} />
      <Route path="manage-plans" element={<Manageplans />} />
      <Route path="manage-roadmap" element={<Manageroadmap />} />
      <Route path="stats" element={<Statistics />} />
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="manage-subscriptions" element={<ManageSubscriptions />} />
      <Route path="manage-payouts" element={<ReferralPayouts />} />
      <Route path="manage-recomendation" element={<ManageRecomendation />} />

      <Route path="manage-refferals" element={<AdminParrainage />} />
      <Route path="view-refferal/:id" element={<ViewReferralD3 />} />
      <Route path="/admin-training" element={<Admintraining />} />
      <Route path="/manage-subscribers" element={<ManageSubscribers />} />
      <Route path="email-templates" element={<EmailTemplatesAdmin />} />

      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Catch-all inside /provider */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
