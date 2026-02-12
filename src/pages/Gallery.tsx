import { motion } from "motion/react";
import Leafimage from "../assets/images/leaf.svg";

import galleryone from "../assets/images/gallery-1.jpg";
import gallerytwo from "../assets/images/gallery-2.jpg";
import gallerythree from "../assets/images/gallery-3.jpg";
import galleryfour from "../assets/images/gallery-4.jpg";
import galleryfive from "../assets/images/gallery-5.jpg";
import gallerysix from "../assets/images/gallery-6.jpg";

const Gallery = () => {
 
  return (
    <>
      <section className="section-padding-y">
        <div className="max-w-[1600px] w-full mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="columns-2 gap-3 md:grid md:grid-cols-6 md:gap-5 md:items-center">
              <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={gallerysix} alt="memories" className="rounded-lg w-full" />
              </div>

               <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={gallerythree} alt="memories" className="rounded-lg w-full" />
              </div>

                 <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={galleryfive} alt="memories" className="rounded-lg w-full" />
              </div>

             <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={gallerytwo} alt="memories" className="rounded-lg w-full" />
              </div>

               <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={galleryfour} alt="memories" className="rounded-lg w-full" />
              </div>

                 <div className="break-inside-avoid mb-3 p-3 md:mb-0 md:p-0">
                <img src={galleryone} alt="memories" className="rounded-lg w-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
