
import React, { useRef, useEffect } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeviceType } from "@/hooks/use-mobile";

interface PartnerCategory {
  id: string;
  name: string;
}

interface PartnerCategoryTabsProps {
  categories: PartnerCategory[];
  activeCategory: string;
}

const PartnerCategoryTabs: React.FC<PartnerCategoryTabsProps> = ({ categories, activeCategory }) => {
  const { t } = useLanguage();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Scroll active tab into view on mobile
  useEffect(() => {
    if (isMobile && tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('[data-state="active"]');
      if (activeTab) {
        const container = tabsRef.current;
        const scrollLeft = activeTab.getBoundingClientRect().left - 
                           container.getBoundingClientRect().left + 
                           container.scrollLeft - 
                           (container.clientWidth - (activeTab as HTMLElement).offsetWidth) / 2;
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory, isMobile]);
  
  return (
    <div ref={tabsRef} className="overflow-x-auto scrollbar-hide -mx-3 px-3">
      <TabsList className="bg-white border border-vip-gray-300 w-full inline-flex flex-nowrap overflow-x-auto md:flex md:flex-wrap space-x-1 p-1">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-vip-gold data-[state=active]:text-white whitespace-nowrap"
        >
          {t('partners.allCategory')}
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="data-[state=active]:bg-vip-gold data-[state=active]:text-white whitespace-nowrap"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default PartnerCategoryTabs;
