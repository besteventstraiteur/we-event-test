
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MiniSiteTheme } from "@/types/miniSiteTypes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LayoutEditorProps {
  theme: MiniSiteTheme;
  setTheme: React.Dispatch<React.SetStateAction<MiniSiteTheme>>;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  theme,
  setTheme
}) => {
  const handleLayoutChange = (
    property: keyof MiniSiteTheme["layout"], 
    value: any
  ) => {
    setTheme(prev => ({
      ...prev,
      layout: {
        ...(prev.layout || {
          headerStyle: 'centered',
          sectionStyle: 'boxed',
          roundedCorners: true
        }),
        [property]: value
      }
    }));
  };

  const handleAnimationChange = (
    property: keyof MiniSiteTheme["animations"], 
    value: any
  ) => {
    setTheme(prev => ({
      ...prev,
      animations: {
        ...(prev.animations || {
          enabled: true,
          intensity: 'subtle'
        }),
        [property]: value
      }
    }));
  };

  // Ensure layout property exists
  const layout = theme.layout || {
    headerStyle: 'centered',
    sectionStyle: 'boxed',
    roundedCorners: true
  };

  // Ensure animations property exists
  const animations = theme.animations || {
    enabled: true,
    intensity: 'subtle'
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mise en page</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Style d'en-tête</Label>
            <RadioGroup 
              value={layout.headerStyle}
              onValueChange={(value) => handleLayoutChange('headerStyle', value)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="centered"
                  id="header-centered"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="header-centered"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 w-full h-5 bg-primary/30 rounded flex items-center justify-center">
                    <div className="w-1/2 h-2 bg-primary/60 rounded"></div>
                  </div>
                  <span className="text-xs">Centré</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="side-by-side"
                  id="header-side-by-side"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="header-side-by-side"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 w-full h-5 bg-primary/30 rounded flex items-center justify-between px-1">
                    <div className="w-1/3 h-2 bg-primary/60 rounded"></div>
                    <div className="w-1/3 h-2 bg-primary/60 rounded"></div>
                  </div>
                  <span className="text-xs">Côte à côte</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="overlay"
                  id="header-overlay"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="header-overlay"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 w-full h-5 bg-primary/10 rounded flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-full h-full bg-primary/30"></div>
                    <div className="relative w-1/2 h-2 bg-white rounded z-10"></div>
                  </div>
                  <span className="text-xs">Superposé</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Style des sections</Label>
            <RadioGroup 
              value={layout.sectionStyle}
              onValueChange={(value) => handleLayoutChange('sectionStyle', value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="boxed"
                  id="section-boxed"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="section-boxed"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 w-full h-10 flex flex-col gap-1 items-center">
                    <div className="w-3/4 h-2 bg-primary/60 rounded"></div>
                    <div className="w-3/4 h-2 bg-primary/60 rounded"></div>
                    <div className="w-3/4 h-2 bg-primary/60 rounded"></div>
                  </div>
                  <span className="text-xs">Contenu encadré</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="full-width"
                  id="section-full-width"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="section-full-width"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-2 w-full h-10 flex flex-col gap-1 items-center">
                    <div className="w-full h-2 bg-primary/60 rounded"></div>
                    <div className="w-full h-2 bg-primary/60 rounded"></div>
                    <div className="w-full h-2 bg-primary/60 rounded"></div>
                  </div>
                  <span className="text-xs">Pleine largeur</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="rounded-corners">Coins arrondis</Label>
            <Switch
              id="rounded-corners"
              checked={layout.roundedCorners}
              onCheckedChange={(checked) => handleLayoutChange('roundedCorners', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Animations</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-animations">Activer les animations</Label>
            <Switch
              id="enable-animations"
              checked={animations.enabled}
              onCheckedChange={(checked) => handleAnimationChange('enabled', checked)}
            />
          </div>
          
          {animations.enabled && (
            <div className="space-y-2">
              <Label>Intensité des animations</Label>
              <RadioGroup 
                value={animations.intensity}
                onValueChange={(value) => handleAnimationChange('intensity', value)}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="subtle"
                    id="animation-subtle"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="animation-subtle"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs">Subtile</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="moderate"
                    id="animation-moderate"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="animation-moderate"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs">Modérée</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="playful"
                    id="animation-playful"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="animation-playful"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs">Ludique</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
