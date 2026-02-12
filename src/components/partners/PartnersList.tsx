import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import PartnersSearch from "./PartnersSearch";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import media from "../../assets/images/media.jpg";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import partner from "../../assets/images/Agilent-Technologies.jpg";

interface PartnerCategoryProps {
  id: string;
  name: string;
}

interface PartnerProps {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface PartnersListProps {
  partnerCategories?: PartnerCategoryProps[];
  allPartners?: PartnerProps[];
}

const PartnersList: React.FC<PartnersListProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <div className="landing-page">
        <div className="pt-32 section-gradient">
          <section className="max-w-[768px] mx-auto">
            <div className="container">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-4xl text-center font-bold font-inter"
              >
                Discover our selection of professionals for all types of events
              </motion.h1>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-5xl mx-auto my-12">
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="search"
                    placeholder="Search For Service Provider"
                    className="pl-10 w-full bg-white rounded-full py-6 px-12 shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[300px] bg-white rounded-full py-6 px-12 shadow-none">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="venues">Lieux de réception</SelectItem>
                    <SelectItem value="catering">
                      Traiteurs & Restauration
                    </SelectItem>
                    <SelectItem value="entertainment">
                      Animation & Musique
                    </SelectItem>
                    <SelectItem value="decoration">
                      Décoration & Design
                    </SelectItem>
                    <SelectItem value="photo-video">Photo & Vidéo</SelectItem>
                    <SelectItem value="planners">
                      Services Événementiels
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white rounded-2xl p-4 mb-10"
              >
                <h3 className="text-2xl font-bold mb-5">Showcase Media</h3>
                <div className="media grid grid-cols-4 gap-4">
                  <div className="w-100 h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src={media}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-100 h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src={media}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-100 h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src={media}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-100 h-[200px] rounded-2xl overflow-hidden">
                    <img
                      src={media}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-4 gap-4 section-padding-y pt-0">
                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>

                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>

                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>

                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>

                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>

                <div className="bg-white text-center py-14 px-4 rounded-md transition-shadow shadow hover:shadow-md">
                  <Link
                    to="/partners/catering"
                    className="flex flex-col items-center"
                  >
                    <img src={partner} className="max-w-40" />
                    <h3 className="text-xl font-semibold my-3">
                      Agilent Solutions
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cuisine gastronomique, buffets, cocktails pour tous types
                      de réceptions
                    </p>
                    <span className="bg-we-gold text-white text-sm w-[120px] h-[35px] flex items-center justify-center rounded-full">
                      Premium
                    </span>
                    <div className="flex gap-1 text-center mt-4">
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F] fill-current" />
                      <Star size={18} className="text-[#E2A03F]" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PartnersList;
