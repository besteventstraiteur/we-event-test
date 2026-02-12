import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureBlockPreviewProps {
  blockId: string;
  settings: any;
  setBlockSettings: (id: string, updater: any) => void;
}

const SignatureBlockPreview = ({
  blockId,
  settings,
  setBlockSettings,
}: SignatureBlockPreviewProps) => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const s = settings || {};
  const height = Number(s.boxHeight) || 120;

  const clearSignature = () => {
    sigRef.current?.clear();
  };

  const saveSignature = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;

    const img = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    setBlockSettings(blockId, (prev: any) => ({
      ...prev,
      signatureImage: img,
    }));
  };

  const resetSavedSignature = () => {
    setBlockSettings(blockId, (prev: any) => ({
      ...prev,
      signatureImage: null,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-borderlight dark:border-gray-600">
      {s.title && <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">{s.title}</p>}

      <div
        className="border-2 border-dashed border-borderlight dark:border-transparent rounded-lg bg-gray-50 dark:bg-darkmode flex items-center justify-center"
        style={{ height }}
      >
        {s.signatureImage ? (
          <img
            src={s.signatureImage}
            alt="Signature"
            className="max-h-full object-contain"
          />
        ) : (
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              width: 600,
              height,
              className: "w-full h-full",
            }}
          />
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-3">
        {!s.signatureImage && (
          <>
            <button
              className="text-xs px-3 py-1 bg-gray-200 rounded"
              onClick={clearSignature}
            >
              Effacer
            </button>

            <button
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
              onClick={saveSignature}
            >
              Valider la signature
            </button>
          </>
        )}

        {s.signatureImage && (
          <button
            className="text-xs px-3 py-1 bg-red-500 text-white rounded"
            onClick={resetSavedSignature}
          >
            Refaire la signature
          </button>
        )}
      </div>
    </div>
  );
};

export default SignatureBlockPreview;
