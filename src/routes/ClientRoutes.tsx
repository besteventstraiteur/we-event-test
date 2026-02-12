// src/routes/ClientRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProvidersDashboard from "../pages/client/Dashboard";
import Events from "../pages/client/Events";
import Manageguest from "../pages/client/Guest";
import Budget from "../pages/client/Budget";
import NotFound from "../module/NotFound";
import Profile from "../pages/client/Profile";
import Event_details from "../pages/client/Event-details";
import MiniSiteMain from "../pages/client/minisite/Minisitemain";
import MiniSiteCreate from "../pages/client/minisite/Minisite-create";
import Multievents from "../pages/client/Multievent";
import Tasks from "../pages/client/Tasks";

import Recommendations from "../pages/provider/Recommendations";
import ProviderChat from "../pages/provider/Provider-Chat";
import EventDashboard from "../pages/client/Eventdashboard";
import GuestBook from "../pages/client/minisite/GuestBook";
import Plans from "../pages/client/Plans";
import ClientChat from "../pages/client/Client-Chat";
import Notifications from "../pages/provider/Notification";
const ClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ProvidersDashboard />} />

      <Route path="events" element={<Events />} />

      <Route path="guests/:id" element={<Manageguest />} />

      <Route path="budget/:id" element={<Budget />} />

      <Route path="profile" element={<Profile />} />

      <Route path="event-details/:id" element={<Event_details />} />
      <Route path="event-dashboard/:id" element={<EventDashboard />} />

      {/* Profile */}
      {/* <Route path="profile" element={<ProviderProfile />} /> */}

      {/* Settings */}
      {/* <Route path="settings" element={<ProviderSettings />} /> */}

      {/* Default redirect: /provider → /provider/dashboard */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="/mini-site-editor/:id" element={<MiniSiteMain />} />
      <Route path="/mini-site/guest-book/:id" element={<GuestBook />} />
      <Route path="/mini-site-create" element={<MiniSiteCreate />} />
      <Route path="/multi-events" element={<Multievents />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* <Route path="/event-dashboard" element={<EventDashboard />} /> */}
      <Route path="/tasks/:id" element={<Tasks />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/client-chat" element={<ClientChat />} />
      <Route path="/plans" element={<Plans />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoutes;
