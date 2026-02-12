import { motion } from "motion/react";
import Leafimage from "../assets/images/leaf.svg";

import memoriesone from "../assets/images/memories-1.jpg";
import memoriestwo from "../assets/images/memories-2.jpg";
import memoriesthree from "../assets/images/memories-3.jpg";
import memoriesfour from "../assets/images/memories-4.jpg";

const Memories = () => {
 
  return (
    <>
      <section className="section-padding-y pt-0">
        <div className="container-large">
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
            <h2 className="text-size-2xl font-bold mb-2 max-w-[550px] mx-auto ">
              De jolis souvenirs
            </h2>

            <p className="text-center text-gray-600 max-w-[768px] mx-auto">
              Nos moments capturés
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10">
              <div>
                <img
                  src={memoriesone}
                  alt="memories"
                  className="rounded-t-full"
                />
              </div>

              <div className="md:pt-10">
                <img src={memoriestwo} alt="memories" />
              </div>

              <div className="md:pt-10">
                <img src={memoriesthree} alt="memories" />
              </div>

              <div>
                <img
                  src={memoriesfour}
                  alt="memories"
                  className="rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Memories;
