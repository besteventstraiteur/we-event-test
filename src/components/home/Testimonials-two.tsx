// import Swiper core and required modules
import { useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pause, Play, Star } from "lucide-react";

import Leafimage from "../../assets/images/leaf.svg";
import testimonialsbg1 from "../../assets/images/review-bg.webp";
import quoteicon from "../../assets/images/quote-icon.svg";
import { motion } from "motion/react";
import Button from "../ui/Button";
import customervideo from "../../assets/images/customer-video.mp4";
import customerthumb from "../../assets/images/customer-thumbnail.webp";
import partnerthumb from "../../assets/images/partner-thumb.webp";
import partnervideo from "../../assets/images/partner-video.mp4";
import ctathumb from "../../assets/images/cta-thumb.webp";

const TestimonialsSlider = () => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);
  return (
    <>
      <section className="section-padding-y relative pt-0 testimonials-ver2 before:content-[] before:w-full before:h-1/2 before:absolute before:top-0 before:left-0 before:bg-secondary">
        <div className="container-1180">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              pagination={{ clickable: true }}
              className="md:h-[600px] rounded-3xl"
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 0 },
                768: { slidesPerView: 1, spaceBetween: 0 },
                1024: { slidesPerView: 1, spaceBetween: 0 },
              }}
              onSlideChange={(swiper) => {
                videoRefs.current.forEach((v) => v?.pause());
                setPlayingIndex(null);

                const active = swiper.activeIndex;

                // if (videoRefs.current[active]) {
                //   if (active === 0) videoRefs.current[active].currentTime = 3;
                //   if (active === 1) videoRefs.current[active].currentTime = 5;
                // }
              }}
            >
              {/* SLIDE 1 */}
              <SwiperSlide className="!h-auto bg-tertiary">
                <div className="testimonials__item w-full aspect-video overflow-hidden rounded-3xl">
                  {/* Only show overlay if this slide's video is NOT playing */}
                  {playingIndex !== 0 && (
                    <div
                      className="flex justify-center items-center absolute z-50 inset-0
    bg-gradient-to-br from-gray-900/80 via-gray-800/75 to-gray-900/80"
                    >
                      <span
                        onClick={() => {
                          const video = videoRefs.current[0];
                          if (!video) return;

                          video.play();
                          setPlayingIndex(0);
                        }}
                        className="w-14 h-14 md:w-24 md:h-24 rounded-full flex justify-center items-center bg-white/80 cursor-pointer"
                      >
                        <Play className="text-secondary w-[20px] h-[20px] md:w-[60px] md:h-[60px]" />
                      </span>
                    </div>
                  )}

                  {/* VIDEO */}
                  <video
                    ref={(el) => (videoRefs.current[0] = el)}
                    playsInline
                    loop
                    poster={customerthumb}
                    className="absolute inset-0 w-full h-full object-contain  lg:object-cover"
                  >
                    <source src={customervideo} type="video/mp4" />
                  </video>
                </div>
              </SwiperSlide>

              {/* SLIDE 2 — Same logic */}
              <SwiperSlide className="!h-auto bg-tertiary">
                <div className="testimonials__item w-full aspect-video overflow-hidden rounded-3xl">
                  {playingIndex !== 1 && (
                    <div className="flex justify-center items-center absolute z-50 inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/75 to-gray-900/80">
                      <span
                        onClick={() => {
                          const video = videoRefs.current[1];
                          if (!video) return;

                          video.play();
                          setPlayingIndex(1);
                        }}
                        className="w-14 h-14 md:w-24 md:h-24 rounded-full flex justify-center items-center bg-white/80 cursor-pointer"
                      >
                        <Play
                          size={60}
                          className="text-secondary w-[20px] h-[20px] md:w-[60px] md:h-[60px]"
                        />
                      </span>
                    </div>
                  )}

                  <video
                    ref={(el) => (videoRefs.current[1] = el)}
                    playsInline
                    loop
                    poster={partnerthumb}
                    className="absolute inset-0 w-full h-full object-contain lg:object-cover"
                  >
                    <source src={partnervideo} type="video/mp4" />
                  </video>
                </div>
              </SwiperSlide>

              <SwiperSlide className="!h-auto">
                <div
                  className="testimonials__item relative overflow-hidden flex flex-col items-center text-center justify-center h-full rounded-3xl px-4 pt-8 pb-12 md:pt-20 md:pb-36 !bg-cover !bg-no-repeat before:content-[] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-black/30"
                  style={{ background: `URL(${ctathumb})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/75 to-gray-900/80"></div>
                  <div className="relative z-1 text-center">
                    <h3 className="text-2xl md:text-4xl lg:text-6xl text-white font-bold tracking-wider">
                      Prêt à rejoindre l'aventure ?
                    </h3>
                    <div className="max-w-3xl my-1 md:my-6">
                      <p className="text-white/95 text-base lg:text-xl">
                        Que vous organisiez un événement ou soyez prestataire,
                        We Event simplifie tout
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-3">
                      <Button
                        onClick={() => window.open("https://we-event.eu/login")}
                        className="bg-white hover:bg-white/95 px-6 !py-3 !text-mainclr"
                      >
                        Créer mon événement
                      </Button>
                      <Button
                        onClick={() =>
                          window.open("https://we-event.eu/register")
                        }
                        variant="outline"
                        className="px-6 bg-white/0 border border-white text-white"
                      >
                        Devenir partenaire
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSlider;
