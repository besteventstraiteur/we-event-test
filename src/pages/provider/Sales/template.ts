export type PageType = "design" | "document";

export interface TemplatePage {
  id: string;
  type: PageType;
  blocks: string[];
}

export interface TemplateData {
  blocks: string[];
  pages: TemplatePage[];
  blockSettings: Record<string, any>;
  globalStyle: {
    coverUrl?: string | null;

    colors: {
      primary: string;
      secondary: string;
    };

    typography: {
      titleFont: string;
      textFont: string;
    };
  };
  companyInfo: {
    name: string;
    addressLine1: string;
    postalCode: string;
    city: string;
  };
}
