// import award from "../assets/images/award.svg";
// import certificatebg from "../assets/images/certificate-bg.jpg";
// import weblogo from "../assets/images/WE-Event-Logo-bkp.svg";
// import Button from "../components/ui/Button";
// const Certificate = () => {
//   return (
//     <>
//       <div
//         className="border-10 border-double border-[#689492] max-w-5xl mx-auto my-9 p-9"
//         style={{
//           backgroundImage: `url(${certificatebg})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="relative">
//           <img src={award} alt="award" className="mx-auto block w-20" />
//           <span className="absolute text-[#C7AD75] top-1/2 -translate-y-1/2 right-0">
//             No.[Certificate Number]
//           </span>
//         </div>
//         <div className="text-center mt-5">
//           <h1 className="uppercase text-4xl font-bold text-[#C7AD75] tracking-widest">
//             Certificate of achievement
//           </h1>
//           <p className="text-[#C7AD75] uppercase text-center text-lg font-medium tracking-widest mt-3">
//             Training program
//           </p>
//           <div className="mt-9">
//             <h2 className="text-6xl font-bold text-secondary tracking-wider capitalize">
//               Participant Name
//             </h2>
//             <div className="bg-[#C7AD75] w-80 h-0.5 mx-auto mt-4"></div>

//             <span className="text-secondary text-lg uppercase block mt-8 tracking-wider font-medium">
//               Training Title
//             </span>
//             <div>
//               <span className="text-secondary block mt-4 mb-2">
//                 Compeleted on [Date]
//               </span>
//             </div>
//           </div>

//           <div className="text-left mt-5">
//             <span className="text-secondary uppercase block mb-2">
//               Competencies
//             </span>
//             <ul className="text-secondary text-sm list-disc text-left ml-[15px] pl-0 space-y-1">
//               <li>[Competencies or objective 1]</li>
//               <li>[Competencies or objective 1]</li>
//               <li>[Competencies or objective 1]</li>
//             </ul>
//           </div>

//           <div className="flex justify-end mt-6">
//             <img src={weblogo} alt="logo" className="max-w-48" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Certificate;

import award from "../assets/images/award.svg";
import certificatebg from "../assets/images/certificate-bg.jpg";
import weblogo from "../assets/images/WE-Event-Logo-bkp.svg";
import { useSelector } from "react-redux";

const Certificate = ({ cert }: any) => {
  const login = useSelector((state: any) => state.login);

  const userName = `${login?.user?.firstName || ""} ${
    login?.user?.lastName || ""
  }`.trim();

  return (
    <>
      <div
        className="border-10 border-double border-[#689492] max-w-5xl mx-auto my-9 p-9"
        style={{
          backgroundImage: `url(${certificatebg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative">
          <img src={award} alt="award" className="mx-auto block w-20" />
          <span className="absolute text-[#C7AD75] top-1/2 -translate-y-1/2 right-0">
            No.{cert?.id}
          </span>
        </div>

        <div className="text-center mt-5">
          <h1 className="uppercase text-4xl font-bold text-[#C7AD75] tracking-widest">
            Certificate of achievement
          </h1>

          <p className="text-[#C7AD75] uppercase text-center text-lg font-medium tracking-widest mt-3">
            Training program
          </p>

          <div className="mt-9">
            <h2 className="text-6xl font-bold text-secondary tracking-wider capitalize">
              {userName || "Participant Name"}
            </h2>

            <div className="bg-[#C7AD75] w-80 h-0.5 mx-auto mt-4"></div>

            <span className="text-secondary text-lg uppercase block mt-8 tracking-wider font-medium">
              {cert?.title}
            </span>

            <div>
              <span className="text-secondary block mt-4 mb-2">
                Completed on{" "}
                {cert?.completedAt
                  ? new Date(cert.completedAt).toLocaleDateString()
                  : "[Date]"}
              </span>
            </div>
          </div>

          <div className="text-left mt-5">
            <span className="text-secondary uppercase block mb-2">
              Competencies
            </span>

            <ul className="text-secondary text-sm list-disc ml-[15px] space-y-1">
              <li>Successfully completed the training</li>
              <li>Demonstrated required competencies</li>
              <li>Achieved certification standards</li>
            </ul>
          </div>

          <div className="flex justify-end mt-6">
            <img src={weblogo} alt="logo" className="max-w-48" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
