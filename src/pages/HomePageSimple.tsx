import React from "react";
import { Link } from "react-router-dom";

const HomePageSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-8">
          ✅ We Event Application
        </h1>
        
        <p className="text-2xl text-gray-700 mb-12">
          Plateforme tout-en-un pour organiser vos événements
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            to="/providers-list" 
            className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <h3 className="text-xl font-bold text-blue-600 mb-2">📋 Prestataires</h3>
            <p className="text-gray-600">Découvrez nos prestataires</p>
          </Link>

          <Link 
            to="/login" 
            className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <h3 className="text-xl font-bold text-green-600 mb-2">🔐 Connexion</h3>
            <p className="text-gray-600">Accédez à votre compte</p>
          </Link>

          <Link 
            to="/register" 
            className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <h3 className="text-xl font-bold text-purple-600 mb-2">✨ Inscription</h3>
            <p className="text-gray-600">Créez votre compte</p>
          </Link>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Fonctionnalités</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div>
              <div className="text-3xl mb-2">📦</div>
              <div className="font-semibold">Packages</div>
            </div>
            <div>
              <div className="text-3xl mb-2">📅</div>
              <div className="font-semibold">Bookings</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold">Ratings</div>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold">Messages</div>
            </div>
            <div>
              <div className="text-3xl mb-2">📸</div>
              <div className="font-semibold">Photos</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎥</div>
              <div className="font-semibold">Videos</div>
            </div>
            <div>
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold">Analytics</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold">Events</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-gray-500">
          <p>Version 3.0 | React 18 + TypeScript + Vite</p>
        </div>
      </div>
    </div>
  );
};

export default HomePageSimple;
