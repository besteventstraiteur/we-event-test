// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Star } from "lucide-react";

import user1 from "../../assets/images/user-1.jpg";
import user2 from "../../assets/images/user-2.jpg";
import user3 from "../../assets/images/user-3.jpg";
import user4 from "../../assets/images/user-4.jpg";
import Leafimage from "../../assets/images/leaf.svg";
import { motion } from "motion/react";

const TestimonialsSection = () => {
 
  return (
    <>
      <section className="section-padding-y pt-0 testimonials-ver1">
        <div className="container-1180">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <img src={Leafimage} />
            </div>
            <h2 className="text-size-2xl font-bold mb-7 max-w-[550px] mx-auto ">
              Ce que disent nos clients
            </h2>

          
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              // slidesPerView={2}
              pagination={{ clickable: true }}
              navigation={true}
              breakpoints={{
                640: {
                  // sm screens and up
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  // md screens and up
                  slidesPerView: 1,
                  spaceBetween: 24,
                },
                1024: {
                  // lg screens and up
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
              }}
              //onSlideChange={() => console.log("slide change")}
              //onSwiper={(swiper) => console.log(swiper)}
            >
              <SwiperSlide className="!h-auto">
                <div className="testimonials__item flex flex-col items-center text-center justify-between h-full bg-[#FFFEEB] rounded-3xl p-5 md:p-10">
                  <img
                    src={user1}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="max-w-3xl w-full my-6">
                    <p className="text-gray-600 text-base sm:text-xl">
                      “Planifier un mariage nous semblait insurmontable jusqu’à
                      ce que nous rencontrions Damien. Leur équipe a repris nos
                      idées et les a transformées en une célébration au-delà de
                      tout ce que nous aurions pu imaginer. Vraiment
                      professionnels, créatifs et présents à chaque étape.”
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="heading-font text-size-xlarge">
                      Veronics & Robin
                    </span>
                    <span className="text-sm text-gray-600">
                      Mariage – 10/03/2025
                    </span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="!h-auto">
                <div className="testimonials__item flex flex-col items-center text-center justify-between h-full bg-[#FFFEEB] rounded-3xl p-5 md:p-10">
                  <img
                    src={user2}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="max-w-3xl w-full my-6">
                    <p className="text-gray-600 text-base sm:text-xl">
                      Une plateforme exceptionnelle ! Nos événements
                      d’entreprise n’ont jamais été aussi réussis grâce à leurs
                      outils.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="heading-font text-size-xlarge">
                      Innovtech Company
                    </span>
                    <span className="text-sm text-gray-600">
                      Événement d’entreprise – 12/04/2025
                    </span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="!h-auto">
                <div className="testimonials__item flex flex-col items-center text-center justify-between h-full bg-[#FFFEEB] rounded-3xl p-5 md:p-10">
                  <img
                    src={user3}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />

                  <div className="max-w-3xl w-full my-6">
                    <p className="text-gray-600 text-base sm:text-xl">
                      En tant qu’entreprise, nous avons trouvé tous les
                      prestataires dont nous avions besoin en un seul clic.
                      Remarquable !
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="heading-font text-size-xlarge">
                      Alexandre
                    </span>
                    <span className="text-sm text-gray-600">
                      Événement d’entreprise – 16/04/2025
                    </span>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="!h-auto">
                <div className="testimonials__item flex flex-col items-center text-center justify-between h-full bg-[#FFFEEB] rounded-3xl p-5 md:p-10">
                  <img
                    src={user4}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />

                  <div className="max-w-3xl w-full my-6">
                    <p className="text-gray-600 text-base sm:text-xl">
                      We Event a transformé notre mariage en une expérience
                      inoubliable. L’équipe a été à l’écoute, attentionnée et
                      extrêmement professionnelle.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="heading-font text-size-xlarge">
                      Marie & Pierre
                    </span>
                    <span className="text-sm text-gray-600">
                      Mariage – 07/06/2025
                    </span>
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

export default TestimonialsSection;
