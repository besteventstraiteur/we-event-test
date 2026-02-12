import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";

import Propertyimage from "../../assets/images/property.jpg";
import { Link } from "react-router-dom";

function Slider({ serviceId }: { serviceId?: number }) {
  const [businesses, setBusinesses] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

 const fetchAllContent = async () => {
  try {
    const url = `${PROVIDER.GET_ALL_PROFILES}?page=1&limit=8${
      serviceId ? `&services=${serviceId}` : ""
    }`;

    const res = await getRequest(url);
    const data = res?.data?.data?.businesses || [];
    setBusinesses(data);
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }
};


  useEffect(() => {
    fetchAllContent();
  }, [serviceId]);

  return (
    <>
      <div className="relative w-full">
        <button
          ref={prevRef}
          className="custom-prev-btn hidden md:flex justify-center items-center cursor-pointer absolute z-10 left-0 top-1/4 hover:!bg-[#0b6495]"
        >
          <ChevronLeft size={30} className="text-white" />
        </button>
        <button
          ref={nextRef}
          className="custom-next-btn hidden md:flex justify-center items-center cursor-pointer absolute z-10 right-0 top-1/4 hover:!bg-[#0b6495]"
        >
          <ChevronRight size={30} className="text-white" />
        </button>
        <div className="w-full px-0 lg:px-16">
          <Swiper
            loop={false}
            pagination={false}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              // To fix refs not set on first render
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 15 },
              640: { slidesPerView: 2.3, spaceBetween: 24 },
              768: { slidesPerView: 2.3, spaceBetween: 30 },
              1024: { slidesPerView: 2, spaceBetween: 30 },
            }}
          >
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <SwiperSlide key={business.id}>
                  <Link
                    to={`/partners/${business.id}`}
                    className="property-listing group relative"
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                          <img
                            src={
                              business.portfolioImages &&
                              business.portfolioImages.length > 0
                                ? business.portfolioImages[0]
                                : Propertyimage
                            }
                            alt={business.name}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-120"
                          />
                        </div>

                        <div className="flex flex-col items-start">
                          <span className="text-size-large heading-font capitalize mb-2 dark:text-neutral-100">
                            {business.name}
                          </span>

                          <div className="flex w-full gap-2 items-center justify-between">
                            <span className="text-gray-600 dark:text-neutral-400 text-sm capitalize">
                              {business.services && business.services.length > 0
                                ? business?.services?.join(", ")
                                : ""}
                            </span>

                            <span className="text-gray-600 dark:text-neutral-400 text-sm capitalize">
                              {business.address || ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start">
                        <div className="w-full">
                          <div className="flex items-center gap-2 w-full">
                            <div className="w-full h-[1px] bg-gray-400"></div>
                            <ArrowRight
                              size={16}
                              className="text-gray-600 dark:text-neutral-400 relative rotate-0 transition-transform duration-300 group-hover:-rotate-45"
                            />
                          </div>

                          <p className="text-gray-600 dark:text-neutral-300 text-sm mt-2 line-clamp-3">
                            {business?.description
                              ?.replace(/<[^>]*>/g, "")
                              ?.trim()}
                          </p>

                          <p className="text-gray-600 dark:text-neutral-400 text-sm mt-4 flex items-center gap-1">
                            <Star
                              size={16}
                              className="fill-yellow-500 text-yellow-500"
                            />
                            {business.rating?.totalCount > 0
                              ? `${business.rating.totalCount} Avis clients`
                              : "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-center py-10 w-full dark:text-neutral-400">Aucune entreprise trouvée.</p>
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default Slider;
