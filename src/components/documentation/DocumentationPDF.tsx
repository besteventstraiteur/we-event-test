
import React, { useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface DocumentationPDFProps {
  onClose: () => void;
}

const DocumentationPDF: React.FC<DocumentationPDFProps> = ({ onClose }) => {
  const generatePDF = () => {
    const element = document.getElementById('documentation-content');
    
    const opt = {
      margin: 10,
      filename: 'we-event-documentation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };
  
  useEffect(() => {
    // Auto-generate PDF when component mounts
    generatePDF();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Documentation We Event</h2>
        <p className="text-gray-500 mb-6">Votre documentation est en cours d'export vers PDF...</p>
        
        <div id="documentation-content" className="hidden">
          <h1 className="text-3xl font-bold mb-6">Documentation complète We Event</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Structure et fonctionnalités de la plateforme We Event</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">Architecture globale de l'application</h3>
            <p className="mb-4">
              L'application est structurée selon une architecture modulaire avec séparation des responsabilités. 
              Elle est développée avec React, TypeScript, et utilise Supabase comme backend. L'architecture est 
              détaillée dans le fichier `ARCHITECTURE.md` et suit le modèle suivant:
            </p>
            <ul className="list-disc pl-5 mb-6">
              <li>Modularité avec séparation des composants par rôle utilisateur (Admin, Client, Partner)</li>
              <li>Lazy loading pour optimiser le chargement</li>
              <li>Context API pour les états globaux légers et Zustand pour les états complexes</li>
              <li>React Query pour la gestion des états serveur</li>
              <li>Interface responsive avec Tailwind CSS et Shadcn UI</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Types d'utilisateurs</h3>
            <p className="mb-2">L'application gère trois types principaux d'utilisateurs:</p>
            <ol className="list-decimal pl-5 mb-6">
              <li><strong>Clients</strong> - Les personnes organisant des événements</li>
              <li><strong>Partenaires</strong> - Les prestataires de services (photographes, traiteurs, etc.)</li>
              <li><strong>Administrateurs</strong> - Gestion de la plateforme</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Documentation détaillée des fonctionnalités We Event</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">1. Système d'authentification</h3>
            <h4 className="text-lg font-semibold mt-4 mb-2">Login/Register</h4>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Email/Password</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Inscription avec validation email (désactivable)</li>
                  <li>Connexion avec option "Se souvenir de moi"</li>
                  <li>Récupération de mot de passe</li>
                  <li>Déconnexion avec nettoyage des sessions</li>
                </ul>
              </li>
              <li><strong>Social Login</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Google (en cours)</li>
                  <li>Facebook (prévu)</li>
                  <li>Apple (prévu)</li>
                </ul>
              </li>
              <li><strong>2FA (Two-Factor Authentication)</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Code par SMS/Email</li>
                  <li>Authentification biométrique pour mobile (prévu)</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-lg font-semibold mt-4 mb-2">Gestion des sessions</h4>
            <ul className="list-disc pl-5 mb-6">
              <li>Token JWT stocké dans localStorage/sessionStorage</li>
              <li>Rafraîchissement automatique du token</li>
              <li>Déconnexion automatique après inactivité</li>
              <li>Protection des routes par rôle</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">2. Espace Client</h3>
            <h4 className="text-lg font-semibold mt-4 mb-2">Dashboard Client</h4>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Vue d'ensemble</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Countdown jusqu'à l'événement</li>
                  <li>To-do list prioritaire</li>
                  <li>Stats rapides (budget, invités, tâches)</li>
                  <li>Suggestions de prestataires</li>
                  <li>Derniers podcasts/talkshows</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-lg font-semibold mt-4 mb-2">Gestion des invités</h4>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Liste des invités</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Import CSV/Excel</li>
                  <li>Import depuis contacts mobile</li>
                  <li>Filtrage multi-critères</li>
                  <li>Export des données</li>
                </ul>
              </li>
              <li><strong>Gestion RSVP</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Génération de liens uniques</li>
                  <li>Suivi des réponses</li>
                  <li>Relances automatiques</li>
                  <li>Statistiques de participation</li>
                </ul>
              </li>
              <li><strong>Plan de tables</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Éditeur drag & drop</li>
                  <li>Tables rondes/rectangulaires</li>
                  <li>Contraintes de placement</li>
                  <li>Suggestions d'arrangement IA</li>
                  <li>Export PDF/Image</li>
                </ul>
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">3. Espace Partenaire</h3>
            <h4 className="text-lg font-semibold mt-4 mb-2">Dashboard Partenaire</h4>
            <ul className="list-disc pl-5 mb-4">
              <li>Demandes en attente</li>
              <li>Événements à venir</li>
              <li>Stats du mois</li>
              <li>Notifications importantes</li>
            </ul>

            <h4 className="text-lg font-semibold mt-4 mb-2">CRM</h4>
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Contacts</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Fiche client détaillée</li>
                  <li>Historique des interactions</li>
                  <li>Tags et notes</li>
                  <li>Import/Export</li>
                </ul>
              </li>
              <li><strong>Opportunités</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Pipeline de vente</li>
                  <li>Scoring automatique</li>
                  <li>Suivi des conversions</li>
                  <li>Rappels et tâches</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Inventaire complet des pages We Event</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">FRONT OFFICE PUBLIC (10 pages)</h3>
            <ol className="list-decimal pl-5 mb-6">
              <li><strong>Page d'accueil (/home)</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Présentation générale de la plateforme</li>
                  <li>Sections: héros, présentation, catégories, témoignages</li>
                  <li>Appels à l'action pour les clients et partenaires</li>
                  <li>Vidéo de présentation</li>
                </ul>
              </li>
              <li><strong>Page de connexion (/login)</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Formulaire de connexion (email/mot de passe)</li>
                  <li>Option "Se souvenir de moi"</li>
                  <li>Lien vers récupération de mot de passe</li>
                  <li>Connexion rapide (comptes de démonstration)</li>
                </ul>
              </li>
              <li><strong>Page d'inscription (/register)</strong>
                <ul className="list-disc pl-5 my-2">
                  <li>Formulaire d'inscription</li>
                  <li>Choix du type de compte (client/partenaire)</li>
                  <li>Validation des données</li>
                  <li>Redirection vers le dashboard approprié</li>
                </ul>
              </li>
              <li><strong>Page des partenaires (/partners)</strong></li>
              <li><strong>Page catégorie de partenaires (/partners/:categoryId)</strong></li>
              <li><strong>Page contact (/contact)</strong></li>
              <li><strong>Page de confidentialité (/privacy)</strong></li>
              <li><strong>Page de conditions d'utilisation (/terms)</strong></li>
              <li><strong>Page de récupération de mot de passe (/reset-password)</strong></li>
              <li><strong>Page d'accès invité (/guest?token=xxx)</strong></li>
            </ol>

            <h3 className="text-xl font-bold mt-6 mb-3">BACK OFFICE CLIENT (16 pages)</h3>
            <ol className="list-decimal pl-5 mb-6">
              <li><strong>Dashboard client (/client/dashboard)</strong></li>
              <li><strong>Liste de tâches (/client/todo-list)</strong></li>
              <li><strong>Budget (/client/budget)</strong></li>
              <li><strong>Prestataires (/client/partners)</strong></li>
              <li><strong>Invités (/client/guests)</strong></li>
              <li><strong>Plan de salle (/client/floor-plans)</strong></li>
              <li><strong>Menus (/client/menus)</strong></li>
              <li><strong>Inspiration (/client/pinterbest)</strong></li>
              <li><strong>Photos (/client/photos)</strong></li>
              <li><strong>Playlists (/client/music-playlists)</strong></li>
              <li><strong>Demandes (/client/requests)</strong></li>
              <li><strong>Mini-site (/client/mini-site)</strong></li>
              <li><strong>Compte (/client/account)</strong></li>
              <li><strong>Talkshows (/client/talkshows)</strong></li>
              <li><strong>Podcasts (/client/podcasts)</strong></li>
              <li><strong>Communication jour J (/client/day-of-communication)</strong></li>
            </ol>

            <h3 className="text-xl font-bold mt-6 mb-3">BACK OFFICE PARTENAIRE (22 pages)</h3>
            <ol className="list-decimal pl-5 mb-6">
              <li><strong>Dashboard partenaire (/partner/dashboard)</strong></li>
              <li><strong>Profil (/partner/profile)</strong></li>
              <li><strong>Tâches (/partner/tasks)</strong></li>
              <li><strong>Calendrier (/partner/calendar)</strong></li>
              <li><strong>Photos (/partner/photos)</strong></li>
              <li><strong>Demandes clients (/partner/requests)</strong></li>
              <li><strong>Statistiques (/partner/stats)</strong></li>
              <li><strong>Menus (/partner/menus)</strong></li>
              <li><strong>Best Awards (/partner/best-awards)</strong></li>
              <li><strong>Playlists (/partner/playlists)</strong></li>
              <li><strong>Plans de salle (/partner/floor-plans)</strong></li>
              <li><strong>Livestream (/partner/livestream)</strong></li>
              <li><strong>Abonnement (/partner/subscription)</strong></li>
              <li><strong>Recommandations (/partner/recommendations)</strong></li>
              <li><strong>Formation (/partner/training)</strong></li>
              <li><strong>Gamification (/partner/gamification)</strong></li>
              <li><strong>MLM (/partner/mlm)</strong></li>
              <li><strong>Talkshows (/partner/talkshows)</strong></li>
              <li><strong>Podcasts (/partner/podcasts)</strong></li>
              <li><strong>CRM (/partner/crm)</strong></li>
              <li><strong>CRM Opportunités (/partner/crm/opportunities)</strong></li>
              <li><strong>CRM Contacts (/partner/crm/contacts)</strong></li>
            </ol>

            <h3 className="text-xl font-bold mt-6 mb-3">BACK OFFICE ADMIN (20 pages)</h3>
            <ol className="list-decimal pl-5 mb-6">
              <li><strong>Dashboard admin (/admin/dashboard)</strong></li>
              <li><strong>Statistiques (/admin/statistics)</strong></li>
              <li><strong>Clients (/admin/clients)</strong></li>
              <li><strong>Partenaires (/admin/partners)</strong></li>
              <li><strong>Types de partenaires (/admin/partner-types)</strong></li>
              <li><strong>Abonnements (/admin/subscriptions)</strong></li>
              <li><strong>Réseau MLM (/admin/mlm)</strong></li>
              <li><strong>Invités (/admin/guests)</strong></li>
              <li><strong>Lieux (/admin/venues)</strong></li>
              <li><strong>Présentation (/admin/presentations)</strong></li>
              <li><strong>Forfaits mariage (/admin/wedding-packages)</strong></li>
              <li><strong>Évaluations (/admin/ratings)</strong></li>
              <li><strong>Recommandations (/admin/recommendations)</strong></li>
              <li><strong>Talkshows (/admin/talkshows)</strong></li>
              <li><strong>Podcasts (/admin/podcasts)</strong></li>
              <li><strong>KPI Dashboard (/admin/kpi-dashboard)</strong></li>
              <li><strong>Partenaires gamifiés (/admin/partner-gamification)</strong></li>
              <li><strong>Sauvegarde (/admin/backup)</strong></li>
              <li><strong>Filtres de catégorie (/admin/category-filters)</strong></li>
              <li><strong>Paramètres système (/admin/system-settings)</strong></li>
            </ol>

            <h3 className="text-xl font-bold mt-6 mb-3">RÉCAPITULATIF GÉNÉRAL</h3>
            <ul className="list-disc pl-5 mb-6">
              <li><strong>Front Office Public</strong>: 10 pages</li>
              <li><strong>Back Office Client</strong>: 16 pages</li>
              <li><strong>Back Office Partenaire</strong>: 22 pages</li>
              <li><strong>Back Office Admin</strong>: 20 pages</li>
            </ul>
            <p><strong>Total</strong>: 68 pages</p>
          </section>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={generatePDF} className="flex items-center space-x-2">
            <FileDown className="h-4 w-4" />
            <span>Télécharger à nouveau</span>
          </Button>
          <Button onClick={onClose} variant="outline">Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPDF;
