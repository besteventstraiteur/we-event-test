
import React from "react";

interface MessageProps {
  message: {
    id: number;
    sender: string;
    content: string;
    date: string;
  };
}

const RequestMessage: React.FC<MessageProps> = ({ message }) => {
  return (
    <div 
      className={`p-3 rounded-lg ${
        message.sender === "client" 
          ? "bg-vip-gold/10 ml-8" 
          : message.sender === "partner" 
            ? "bg-vip-gray-800 mr-8" 
            : "bg-vip-gray-800/50 text-vip-gray-400 text-sm"
      }`}
    >
      <div className="flex justify-between text-xs text-vip-gray-400 mb-1">
        <span>
          {message.sender === "client" 
            ? "Vous" 
            : message.sender === "partner" 
              ? "Partenaire" 
              : "Système"}
        </span>
        <span>{message.date}</span>
      </div>
      <p>{message.content}</p>
    </div>
  );
};

export default RequestMessage;
