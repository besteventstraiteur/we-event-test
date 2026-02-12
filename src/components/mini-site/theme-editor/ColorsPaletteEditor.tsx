
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MiniSiteTheme } from "@/types/miniSiteTypes";

interface ColorsPaletteEditorProps {
  theme: MiniSiteTheme;
  setTheme: React.Dispatch<React.SetStateAction<MiniSiteTheme>>;
}

export const ColorsPaletteEditor: React.FC<ColorsPaletteEditorProps> = ({
  theme,
  setTheme
}) => {
  const handleColorChange = (colorType: keyof MiniSiteTheme["colors"], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color" className="flex items-center justify-between">
            Couleur principale
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: theme.colors.primary }}
            />
          </Label>
          <div className="flex">
            <Input
              id="primary-color"
              type="color"
              value={theme.colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input
              type="text"
              value={theme.colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="flex-1 ml-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondary-color" className="flex items-center justify-between">
            Couleur secondaire
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: theme.colors.secondary }}
            />
          </Label>
          <div className="flex">
            <Input
              id="secondary-color"
              type="color"
              value={theme.colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input
              type="text"
              value={theme.colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="flex-1 ml-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accent-color" className="flex items-center justify-between">
            Couleur d'accent
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: theme.colors.accent }}
            />
          </Label>
          <div className="flex">
            <Input
              id="accent-color"
              type="color"
              value={theme.colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input
              type="text"
              value={theme.colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="flex-1 ml-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="background-color" className="flex items-center justify-between">
            Couleur de fond
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: theme.colors.background }}
            />
          </Label>
          <div className="flex">
            <Input
              id="background-color"
              type="color"
              value={theme.colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input
              type="text"
              value={theme.colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="flex-1 ml-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="text-color" className="flex items-center justify-between">
            Couleur du texte
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: theme.colors.text }}
            />
          </Label>
          <div className="flex">
            <Input
              id="text-color"
              type="color"
              value={theme.colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="w-12 p-1 h-10"
            />
            <Input
              type="text"
              value={theme.colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="flex-1 ml-2"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">Palettes prédéfinies</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: "Or & Noir", colors: { primary: "#D4AF37", secondary: "#333333", accent: "#F5F5F5", background: "#FFFFFF", text: "#333333" } },
            { name: "Bleu Marine & Or", colors: { primary: "#14213D", secondary: "#FCA311", accent: "#E5E5E5", background: "#FFFFFF", text: "#14213D" } },
            { name: "Rose & Gris", colors: { primary: "#F28482", secondary: "#84A59D", accent: "#F7EDE2", background: "#FFFFFF", text: "#333333" } },
            { name: "Vert Olive & Crème", colors: { primary: "#606C38", secondary: "#BC6C25", accent: "#FEFAE0", background: "#FFFFFF", text: "#283618" } },
            { name: "Lavande & Blanc", colors: { primary: "#7209B7", secondary: "#3A0CA3", accent: "#F8EDEB", background: "#FFFFFF", text: "#333333" } },
            { name: "Eucalyptus", colors: { primary: "#617B5C", secondary: "#9D9C62", accent: "#F5F3EE", background: "#FFFFFF", text: "#333333" } },
            { name: "Sable & Terracotta", colors: { primary: "#CB997E", secondary: "#6B705C", accent: "#EDDCD2", background: "#FFFFFF", text: "#333333" } },
            { name: "Bordeaux & Or", colors: { primary: "#7D0633", secondary: "#D4AF37", accent: "#F5F5F5", background: "#FFFFFF", text: "#333333" } }
          ].map((palette, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-2 flex flex-col items-center"
              onClick={() => setTheme(prev => ({ ...prev, colors: palette.colors }))}
            >
              <div className="flex mb-2">
                {Object.values(palette.colors).map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs">{palette.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
