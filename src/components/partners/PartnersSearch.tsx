
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useKeyboard } from "@/hooks/use-keyboard";
import { useDeviceType } from "@/hooks/use-mobile";

interface PartnersSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PartnersSearch: React.FC<PartnersSearchProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useLanguage();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const { isVisible: isKeyboardVisible } = useKeyboard();
  
  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vip-gray-500" 
        size={isMobile ? 16 : 18} 
      />
      <Input
        type="search"
        placeholder={t('partners.searchPlaceholder')}
        className={`${isMobile ? 'h-10 text-sm' : 'h-11'} pl-10 border-vip-gray-300 rounded-full`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {isMobile && isKeyboardVisible && (
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vip-gold text-sm font-medium"
          onClick={() => document.activeElement instanceof HTMLElement && document.activeElement.blur()}
        >
          {t('common.done')}
        </button>
      )}
    </div>
  );
};

export default PartnersSearch;
