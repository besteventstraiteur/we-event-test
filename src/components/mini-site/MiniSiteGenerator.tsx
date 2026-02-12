
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WeddingDetails, MiniSiteTheme } from "@/types/miniSiteTypes";
import MiniSiteDetailsForm from "./MiniSiteDetailsForm";
import MiniSiteThemeEditor from "./MiniSiteThemeEditor";
import MiniSitePreview from "./MiniSitePreview";
import ScheduleEditor from "./ScheduleEditor";
import { Link2, Eye, Code, Download, Share2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultWeddingDetails: WeddingDetails = {
  title: "Notre Mariage",
  coupleNames: {
    partner1: "Prénom",
    partner2: "Prénom"
  },
  date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  locations: {
    ceremony: {
      name: "Église Saint-Michel",
      address: "1 Rue de l'Église, 75001 Paris",
      time: "14:00",
    },
    reception: {
      name: "Château des Fleurs",
      address: "15 Avenue du Parc, 75001 Paris",
      time: "16:00",
    }
  },
  accommodations: [],
  dressCode: "Tenue de cocktail",
  story: "Notre histoire a commencé il y a quelques années...",
  schedule: []
};

const defaultTheme: MiniSiteTheme = {
  colors: {
    primary: "#D4AF37",
    secondary: "#545454",
    accent: "#F5F5F5",
    background: "#FFFFFF",
    text: "#333333"
  },
  fonts: {
    heading: "Playfair Display",
    body: "Inter"
  },
  images: {},
  layout: {
    headerStyle: 'centered',
    sectionStyle: 'boxed',
    roundedCorners: true
  },
  animations: {
    enabled: true,
    intensity: 'subtle'
  }
};

const MiniSiteGenerator: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>(defaultWeddingDetails);
  const [siteTheme, setSiteTheme] = useState<MiniSiteTheme>(defaultTheme);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate publishing process
    setTimeout(() => {
      const generatedUrl = `https://votre-mariage.com/${weddingDetails.coupleNames.partner1.toLowerCase()}-${weddingDetails.coupleNames.partner2.toLowerCase()}`;
      setSiteUrl(generatedUrl);
      setIsPublishing(false);
      
      toast({
        title: "Mini-site publié !",
        description: "Votre mini-site de mariage est maintenant en ligne.",
      });
    }, 2000);
  };

  const handleCopyLink = () => {
    if (siteUrl) {
      navigator.clipboard.writeText(siteUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de votre mini-site a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
              <path d="M12 20L4 12L12 4L20 12L12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Générateur de Mini-Site
          </CardTitle>
          <CardDescription>
            Créez un mini-site élégant pour votre mariage que vous pourrez partager avec vos invités.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Informations</TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Programme
              </TabsTrigger>
              <TabsTrigger value="theme">Thème & Design</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <MiniSiteDetailsForm 
                weddingDetails={weddingDetails}
                setWeddingDetails={setWeddingDetails}
              />
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4">
              <ScheduleEditor 
                weddingDetails={weddingDetails}
                setWeddingDetails={setWeddingDetails}
              />
            </TabsContent>
            
            <TabsContent value="theme" className="space-y-4">
              <MiniSiteThemeEditor 
                theme={siteTheme}
                setTheme={setSiteTheme}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <MiniSitePreview 
                weddingDetails={weddingDetails}
                theme={siteTheme}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-wrap gap-3 pt-6">
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isPublishing ? "Publication en cours..." : "Publier le mini-site"}
            </Button>
            
            {siteUrl && (
              <>
                <Button variant="outline" onClick={handleCopyLink} className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Copier le lien
                </Button>
                
                <Button variant="outline" asChild className="gap-2">
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                    Voir le site
                  </a>
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Code className="h-4 w-4" />
                  Télécharger le code
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniSiteGenerator;
