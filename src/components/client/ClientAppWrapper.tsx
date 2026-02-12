
import React from "react";
import { Outlet } from "react-router-dom";
import FloatingAIAssistant from "../ai-assistant/FloatingAIAssistant";

const ClientAppWrapper: React.FC = () => {
  return (
    <>
      <Outlet />
      <FloatingAIAssistant />
    </>
  );
};

export default ClientAppWrapper;
