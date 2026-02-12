
import React from "react";
import { MiniSiteTheme } from "@/types/miniSiteTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Image as ImageIcon, Layout } from "lucide-react";
import { ColorsPaletteEditor } from "./theme-editor/ColorsPaletteEditor";
import { FontsEditor } from "./theme-editor/FontsEditor";
import { ImagesEditor } from "./theme-editor/ImagesEditor";
import { LayoutEditor } from "./theme-editor/LayoutEditor";

interface MiniSiteThemeEditorProps {
  theme: MiniSiteTheme;
  setTheme: React.Dispatch<React.SetStateAction<MiniSiteTheme>>;
}

const MiniSiteThemeEditor: React.FC<MiniSiteThemeEditorProps> = ({
  theme,
  setTheme
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Couleurs
          </TabsTrigger>
          <TabsTrigger value="fonts" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typographie
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Mise en page
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <ColorsPaletteEditor theme={theme} setTheme={setTheme} />
        </TabsContent>
        
        <TabsContent value="fonts" className="space-y-4">
          <FontsEditor theme={theme} setTheme={setTheme} />
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <ImagesEditor theme={theme} setTheme={setTheme} />
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <LayoutEditor theme={theme} setTheme={setTheme} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiniSiteThemeEditor;
