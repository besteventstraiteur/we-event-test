import { CheckCircle } from "lucide-react";

interface Props {
  acceptedAt: string;
  acceptedByName?: string | null;
}

const AcceptedInfoBanner = ({ acceptedAt, acceptedByName }: Props) => {
  const date = new Date(acceptedAt).toLocaleDateString("fr-FR");

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center gap-2  bg-green-100 rounded-lg px-4 py-3">
      <CheckCircle className="text-green-800" size={18} />
      <span className="text-sm text-green-800">
        This document was accepted on {date}
        {acceptedByName ? ` by ${acceptedByName}` : ""}
      </span>
    </div>
  );
};

export default AcceptedInfoBanner;
