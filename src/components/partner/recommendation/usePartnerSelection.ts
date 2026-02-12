
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { categories, RecommendationFormValues } from "./types";

export const usePartnerSelection = (form: UseFormReturn<RecommendationFormValues>) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  const onSelectCategory = (category: string) => {
    try {
      setSelectedCategory(category);
      const partners = categories.find(c => c.value === category)?.partners || [];
      
      if (selectAll) {
        const partnerIds = partners.map(p => p.id);
        setSelectedPartners(partnerIds);
        form.setValue("partners", partnerIds);
      } else {
        setSelectedPartners([]);
        form.setValue("partners", []);
      }
    } catch (error) {
      console.error("Error selecting category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la sélection de la catégorie",
      });
    }
  };

  const toggleSelectAll = () => {
    try {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      
      if (selectedCategory) {
        const partners = categories.find(c => c.value === selectedCategory)?.partners || [];
        if (newSelectAll) {
          const partnerIds = partners.map(p => p.id);
          setSelectedPartners(partnerIds);
          form.setValue("partners", partnerIds);
        } else {
          setSelectedPartners([]);
          form.setValue("partners", []);
        }
      }
    } catch (error) {
      console.error("Error toggling select all:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la sélection des prestataires",
      });
    }
  };

  const togglePartner = (partnerId: string) => {
    try {
      const isSelected = selectedPartners.includes(partnerId);
      let newSelectedPartners;
      
      if (isSelected) {
        newSelectedPartners = selectedPartners.filter(id => id !== partnerId);
      } else {
        newSelectedPartners = [...selectedPartners, partnerId];
      }
      
      setSelectedPartners(newSelectedPartners);
      form.setValue("partners", newSelectedPartners);
      
      const categoryPartners = categories.find(c => c.value === selectedCategory)?.partners || [];
      setSelectAll(newSelectedPartners.length === categoryPartners.length);
    } catch (error) {
      console.error("Error toggling partner:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la sélection du prestataire",
      });
    }
  };

  const getPartnerName = (partnerId: string) => {
    try {
      for (const category of categories) {
        const partner = category.partners.find(p => p.id === partnerId);
        if (partner) return partner.name;
      }
      return partnerId;
    } catch (error) {
      console.error("Error getting partner name:", error);
      return partnerId;
    }
  };

  const removePartner = (partnerId: string) => {
    try {
      const newSelectedPartners = selectedPartners.filter(id => id !== partnerId);
      setSelectedPartners(newSelectedPartners);
      form.setValue("partners", newSelectedPartners);
      setSelectAll(false);
    } catch (error) {
      console.error("Error removing partner:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la suppression du prestataire",
      });
    }
  };

  return {
    selectedCategory,
    selectedPartners,
    selectAll,
    onSelectCategory,
    toggleSelectAll,
    togglePartner,
    getPartnerName,
    removePartner,
  };
};
