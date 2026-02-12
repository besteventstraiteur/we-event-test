
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MiniSiteTheme } from "@/types/miniSiteTypes";

interface FontsEditorProps {
  theme: MiniSiteTheme;
  setTheme: React.Dispatch<React.SetStateAction<MiniSiteTheme>>;
}

const fontOptions = [
  { value: "Inter", label: "Inter (Sans-serif)" },
  { value: "Playfair Display", label: "Playfair Display (Serif)" },
  { value: "Montserrat", label: "Montserrat (Sans-serif)" },
  { value: "Lora", label: "Lora (Serif)" },
  { value: "Roboto", label: "Roboto (Sans-serif)" },
  { value: "Merriweather", label: "Merriweather (Serif)" },
  { value: "Open Sans", label: "Open Sans (Sans-serif)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond (Serif)" },
];

export const FontsEditor: React.FC<FontsEditorProps> = ({
  theme,
  setTheme
}) => {
  const handleFontChange = (fontType: keyof MiniSiteTheme["fonts"], value: string) => {
    setTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="heading-font">Police des titres</Label>
          <Select 
            value={theme.fonts.heading} 
            onValueChange={(value) => handleFontChange('heading', value)}
          >
            <SelectTrigger id="heading-font">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div 
            className="mt-2 p-2 border rounded"
            style={{ fontFamily: theme.fonts.heading }}
          >
            <p className="text-xl">Exemple de titre</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="body-font">Police du texte</Label>
          <Select 
            value={theme.fonts.body} 
            onValueChange={(value) => handleFontChange('body', value)}
          >
            <SelectTrigger id="body-font">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div 
            className="mt-2 p-2 border rounded"
            style={{ fontFamily: theme.fonts.body }}
          >
            <p>Exemple de texte de paragraphe.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium mb-2">Combinaisons de polices recommandées</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { heading: "Playfair Display", body: "Inter" },
            { heading: "Montserrat", body: "Lora" },
            { heading: "Cormorant Garamond", body: "Montserrat" },
            { heading: "Roboto", body: "Merriweather" },
            { heading: "Lora", body: "Open Sans" },
            { heading: "Merriweather", body: "Roboto" }
          ].map((combo, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start text-left"
              onClick={() => setTheme(prev => ({ 
                ...prev, 
                fonts: { heading: combo.heading, body: combo.body } 
              }))}
            >
              <p style={{ fontFamily: combo.heading }} className="text-lg mb-1">
                {combo.heading}
              </p>
              <p style={{ fontFamily: combo.body }} className="text-sm">
                {combo.body}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
