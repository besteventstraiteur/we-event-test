
import React from "react";
import { WeddingDetails, MiniSiteTheme } from "@/types/miniSiteTypes";
import { Calendar, Clock, MapPin, Users, Gift, Mail, Camera, Music, Book, Heart } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MiniSitePreviewProps {
  weddingDetails: WeddingDetails;
  theme: MiniSiteTheme;
}

const MiniSitePreview: React.FC<MiniSitePreviewProps> = ({
  weddingDetails,
  theme
}) => {
  const getFullDate = () => {
    try {
      return format(weddingDetails.date, "d MMMM yyyy", { locale: fr });
    } catch {
      return "Date à définir";
    }
  };
  
  const [viewMode, setViewMode] = React.useState<"desktop" | "mobile">("desktop");
  
  const PreviewWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white max-w-full mx-auto">
      <div className="bg-gray-100 flex items-center gap-1 px-2 py-1 border-b">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-gray-500">wedding-site.example.com</span>
        </div>
      </div>
      <div 
        className={cn(
          "overflow-y-auto",
          viewMode === "mobile" ? "w-full max-w-[375px] h-[600px] mx-auto" : "w-full h-[600px]"
        )}
      >
        {children}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aperçu du mini-site</h3>
        <div className="flex bg-secondary/20 p-1 rounded-md">
          <button
            className={cn(
              "px-3 py-1 text-sm rounded",
              viewMode === "desktop" ? "bg-white shadow" : "text-muted-foreground"
            )}
            onClick={() => setViewMode("desktop")}
          >
            Bureau
          </button>
          <button
            className={cn(
              "px-3 py-1 text-sm rounded",
              viewMode === "mobile" ? "bg-white shadow" : "text-muted-foreground"
            )}
            onClick={() => setViewMode("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>
      
      <PreviewWrapper>
        <div 
          className="min-h-full"
          style={{ 
            fontFamily: theme.fonts.body,
            color: theme.colors.text,
            backgroundColor: theme.colors.background
          }}
        >
          {/* Hero Section */}
          <div 
            className="relative h-60 bg-center bg-cover flex items-center justify-center"
            style={{ 
              backgroundImage: theme.images.hero 
                ? `url(${theme.images.hero})` 
                : `linear-gradient(${theme.colors.primary}33, ${theme.colors.secondary}33)`,
              backgroundColor: theme.colors.primary + "11"
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative text-center text-white p-6">
              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {weddingDetails.coupleNames.partner1} & {weddingDetails.coupleNames.partner2}
              </h1>
              <p className="text-xl">{getFullDate()}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div 
            className="sticky top-0 z-10 border-b shadow-sm"
            style={{ 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.primary + "33"
            }}
          >
            <div className="container mx-auto">
              <nav className="flex overflow-x-auto">
                {["Accueil", "Notre Histoire", "Détails", "RSVP", "Hébergement", "Galerie", "Livre d'or"].map((item) => (
                  <a 
                    key={item} 
                    href="#" 
                    className="px-4 py-3 whitespace-nowrap text-sm font-medium hover:opacity-80"
                    style={{ color: theme.colors.primary }}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="home">
              <TabsList className="hidden">
                <TabsTrigger value="home">Accueil</TabsTrigger>
                <TabsTrigger value="story">Notre Histoire</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="space-y-10">
                {/* Countdown */}
                <div className="text-center p-6">
                  <h2 
                    className="text-2xl mb-6 inline-block pb-2 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-current"
                    style={{ 
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.primary
                    }}
                  >
                    Nous allons nous marier
                  </h2>
                  <div className="flex justify-center gap-4">
                    <div 
                      className="w-16 h-16 flex flex-col items-center justify-center rounded-lg"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      <span className="text-xl font-bold">142</span>
                      <span className="text-xs">Jours</span>
                    </div>
                    <div 
                      className="w-16 h-16 flex flex-col items-center justify-center rounded-lg"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      <span className="text-xl font-bold">12</span>
                      <span className="text-xs">Heures</span>
                    </div>
                    <div 
                      className="w-16 h-16 flex flex-col items-center justify-center rounded-lg"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      <span className="text-xl font-bold">45</span>
                      <span className="text-xs">Minutes</span>
                    </div>
                  </div>
                </div>
                
                {/* Event Details Summary */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                  style={{ color: theme.colors.secondary }}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <Calendar 
                      className="mb-2" 
                      style={{ color: theme.colors.primary }}
                    />
                    <h3 
                      className="text-lg font-semibold mb-1"
                      style={{ fontFamily: theme.fonts.heading }}
                    >
                      Date
                    </h3>
                    <p>{getFullDate()}</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <Clock 
                      className="mb-2" 
                      style={{ color: theme.colors.primary }}
                    />
                    <h3 
                      className="text-lg font-semibold mb-1"
                      style={{ fontFamily: theme.fonts.heading }}
                    >
                      Horaires
                    </h3>
                    <p>Cérémonie: {weddingDetails.locations.ceremony?.time || "14:00"}</p>
                    <p>Réception: {weddingDetails.locations.reception?.time || "16:00"}</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <MapPin 
                      className="mb-2" 
                      style={{ color: theme.colors.primary }}
                    />
                    <h3 
                      className="text-lg font-semibold mb-1"
                      style={{ fontFamily: theme.fonts.heading }}
                    >
                      Lieu
                    </h3>
                    <p>{weddingDetails.locations.reception?.name || "Château des Fleurs"}</p>
                    <p className="text-sm">{weddingDetails.locations.reception?.address || "15 Avenue du Parc, Paris"}</p>
                  </div>
                </div>
                
                {/* Story Teaser */}
                <div className="max-w-2xl mx-auto text-center p-6">
                  <h2 
                    className="text-2xl mb-4"
                    style={{ 
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.primary
                    }}
                  >
                    Notre Histoire
                  </h2>
                  <p className="mb-4">
                    {weddingDetails.story?.substring(0, 150)}... 
                  </p>
                  <a 
                    href="#" 
                    className="inline-block text-sm font-medium"
                    style={{ color: theme.colors.primary }}
                  >
                    Lire la suite →
                  </a>
                </div>
              </TabsContent>
              
              <TabsContent value="story">
                {/* Story content would go here */}
                <div className="max-w-3xl mx-auto">
                  <h2 
                    className="text-2xl text-center mb-6"
                    style={{ 
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.primary
                    }}
                  >
                    Notre Histoire
                  </h2>
                  <p className="mb-4">
                    {weddingDetails.story || "Notre histoire a commencé il y a quelques années..."}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                {/* Details content would go here */}
                <div className="max-w-3xl mx-auto">
                  <h2 
                    className="text-2xl text-center mb-6"
                    style={{ 
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.primary
                    }}
                  >
                    Détails
                  </h2>
                  
                  <div className="mb-8">
                    <h3 
                      className="text-xl mb-4 flex items-center gap-2"
                      style={{ 
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.secondary
                      }}
                    >
                      <Calendar className="h-5 w-5" style={{ color: theme.colors.primary }} />
                      Timing de la journée
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Ceremony */}
                      <div className="flex">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.background
                          }}
                        >
                          {weddingDetails.locations.ceremony?.time?.split(":")[0] || "14"}h
                        </div>
                        <div className="ml-4">
                          <h4 
                            className="text-lg font-semibold"
                            style={{ fontFamily: theme.fonts.heading }}
                          >
                            Cérémonie
                          </h4>
                          <p>{weddingDetails.locations.ceremony?.name || "Église Saint-Michel"}</p>
                          <p className="text-sm">{weddingDetails.locations.ceremony?.address || "1 Rue de l'Église, Paris"}</p>
                        </div>
                      </div>
                      
                      {/* Reception */}
                      <div className="flex">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.background
                          }}
                        >
                          {weddingDetails.locations.reception?.time?.split(":")[0] || "16"}h
                        </div>
                        <div className="ml-4">
                          <h4 
                            className="text-lg font-semibold"
                            style={{ fontFamily: theme.fonts.heading }}
                          >
                            Réception
                          </h4>
                          <p>{weddingDetails.locations.reception?.name || "Château des Fleurs"}</p>
                          <p className="text-sm">{weddingDetails.locations.reception?.address || "15 Avenue du Parc, Paris"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 
                      className="text-xl mb-4 flex items-center gap-2"
                      style={{ 
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.secondary
                      }}
                    >
                      <Users className="h-5 w-5" style={{ color: theme.colors.primary }} />
                      Code vestimentaire
                    </h3>
                    <p>{weddingDetails.dressCode || "Tenue de cocktail"}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Footer */}
          <footer 
            className="py-4 px-6 text-center mt-10"
            style={{ 
              backgroundColor: theme.colors.primary + "11",
              borderTop: `1px solid ${theme.colors.primary}22`
            }}
          >
            <div 
              className="flex justify-center gap-4 mb-4"
              style={{ color: theme.colors.primary }}
            >
              <a href="#" className="hover:opacity-80"><Heart className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Calendar className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Book className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Gift className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Camera className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Music className="h-5 w-5" /></a>
              <a href="#" className="hover:opacity-80"><Mail className="h-5 w-5" /></a>
            </div>
            <p className="text-sm">
              {weddingDetails.coupleNames.partner1} & {weddingDetails.coupleNames.partner2} | {getFullDate()}
            </p>
          </footer>
        </div>
      </PreviewWrapper>
    </div>
  );
};

export default MiniSitePreview;
