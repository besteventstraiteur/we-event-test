import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PackageModuleTestPage: React.FC = () => {
  const [mockData] = useState([
    { id: '1', name: 'Item 1', status: 'active' },
    { id: '2', name: 'Item 2', status: 'pending' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎁 Package Module - Test Page
              </h1>
              <p className="text-gray-600">Gestion des packages de services</p>
            </div>
            <Link
              to="/test/global-system"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Données de démonstration
          </h2>
          <div className="space-y-3">
            {mockData.map((item) => (
              <div key={item.id} className="border-2 border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="text-sm text-gray-600">Status: {item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-center">
            ⚠️ <strong>Mode MOCK</strong> - Données simulées. Backend non connecté.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageModuleTestPage;
