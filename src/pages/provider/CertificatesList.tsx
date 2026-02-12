import { Award, Download } from "lucide-react";
import Button from "../../components/ui/Button";
import Certificatebg from "../../assets/images/countdown-2.webp";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Certificate from "../Certificate";
import { PROVIDER } from "../../utils/endPoints";
import { getRequest } from "../../utils/http-client/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CertificatesList = () => {
  const certRef = useRef<HTMLDivElement>(null);

  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getCertificates = async () => {
    try {
      setLoading(true);
      const res = await getRequest(PROVIDER.CERTIFICATES);
      setCertificates(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching certificates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  const downloadCertificate = async (cert: any) => {
    setSelectedCertificate(cert);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!certRef.current) return;

    const canvas = await html2canvas(certRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${cert.title}-certificate.png`;
    link.click();
  };

  return (
    <>
      <div
        className="absolute left-[-9999px] top-0 opacity-0 pointer-events-none"
        style={{
          width: "100%",
          minHeight: "1200px",
          paddingBottom: "150px",
        }}
      >
        <div ref={certRef} style={{ paddingBottom: "150px" }}>
          <Certificate cert={selectedCertificate} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {loading ? (
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-gray-200 dark:bg-neutral-600 animate-pulse"
                style={{ height: "180px" }}
              >
                <Skeleton height={25} width={140} />
                <Skeleton height={20} width={200} className="mt-3" />
                <Skeleton height={20} width={120} className="mt-2" />
                <Skeleton height={35} width={100} className="mt-5" />
              </div>
            ))}
          </>
        ) : certificates.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-300">Aucun certificat trouvé</p>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-7 rounded-2xl flex justify-between items-start bg-cover bg-center"
              style={{ backgroundImage: `url(${Certificatebg})` }}
            >
              <div>
                <div className="flex gap-1 items-center text-lg text-white font-semibold mb-3">
                  <Award /> Certificat
                </div>

                <h2 className="text-xl text-white font-semibold capitalize">
                  {cert.title}
                </h2>

                <p className="text-sm text-white mt-2">
                  Obtenu le {new Date(cert.completedAt).toLocaleDateString()}
                </p>
              </div>

              <Button size="small" onClick={() => downloadCertificate(cert)}>
                <Download size={15} /> Télécharger
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CertificatesList;
