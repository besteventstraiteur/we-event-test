import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRequest,
  cancelRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import DocumentPreview from "./DocumentPreview";
import AcceptQuoteForm from "./AcceptQuoteForm";
import { useToast } from "../../../utils/toast";
import { CheckCircle } from "lucide-react";
import AcceptedInfoBanner from "./AcceptedInfoBanner";
import DepositPaymentBox from "./DepositPaymentBox";

interface AcceptQuoteFormValues {
  fullName: string;
  email: string;
}

const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState<any>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${PROVIDER.DOCUMENT}/public/${id}`);
      const doc = res?.data?.data;

      if (!doc?.templateJson) return;

      setTemplateData(doc.templateJson);
      setDocumentData(doc);
    } catch (err) {
      console.error("Failed to fetch document", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDocument();
    return () => cancelRequest();
  }, [id]);

  const onSubmit = async (data: AcceptQuoteFormValues) => {
    setBtnLoading(true);
    try {
      const acceptMode = allowDepositPayment ? "deposit" : "no_payment";

      const res = await postRequest(
        `${PROVIDER.DOCUMENT}/${documentData?.id}/accept`,
        {
          name: data.fullName,
          email: data.email,
          acceptMode,
        }
      );

      const payload = res?.data?.data;

      if (payload?.paymentRequired && payload?.checkout?.url) {
        window.location.href = payload.checkout.url;
        return;
      }

      toast.success("Document accepté avec succès.");
      await fetchDocument();
    } catch {
      toast.error("Erreur lors de l'acceptation du document.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="text-gray-500">Loading document…</span>
      </div>
    );
  }

  if (!templateData || !documentData) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="text-red-500">Document not found</span>
      </div>
    );
  }

  const handleStripeRedirect = () => {
    if (!checkoutData?.url) return;
    window.location.href = checkoutData.url;
  };
  const isQuote = documentData?.type === "quote";
  const isInvoice = documentData?.type === "invoice";
  const payableAmount = isInvoice
    ? documentData?.balanceAmount
    : documentData?.calculated?.minPayableAmount;
  const allowDepositPayment =
    documentData?.createdBy?.paymentSettings?.allowDepositPayment === true;

  const handleInvoicePayment = async (email: string) => {
    try {
      setBtnLoading(true);
      
      const res = await postRequest(
        `${PROVIDER.DOCUMENT}/${documentData?.id}/pay`,
        { email: documentData?.customerEmail }
      );

      const payload = res?.data?.data;

      if (payload?.checkout?.url) {
        window.location.href = payload.checkout.url;
        return;
      }

      toast.success("Paiement effectué avec succès.");
      await fetchDocument();
    } catch {
      toast.error("Erreur lors du paiement.");
    } finally {
      setBtnLoading(false);
    }
  };

  const isDepositPaid = document?.isDepositPaid === true;
  const isFullyPaid = document?.isFullyPaid === true;
  const isAccepted =
    document?.status === "accepted" || document?.acceptedByName;

  return (
    <div className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between bg-white p-4">
        <h2 className="text-lg mb-0">Devis Template - Standard</h2>
        {isAccepted && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
            <CheckCircle size={14} />
            Accepted
          </span>
        )}
      </div>

      {/* ACCEPTED INFO */}
      {isAccepted && (
        <AcceptedInfoBanner
          acceptedAt={documentData.acceptedAt}
          acceptedByName={documentData.acceptedByName}
        />
      )}

      <DocumentPreview
        data={templateData}
        document={documentData}
        setBlockSettings={() => {}}
      />

      {isQuote && !isAccepted && (
        <AcceptQuoteForm
          type="quote"
          onSubmit={onSubmit}
          btnLoading={btnLoading}
          showPayment={allowDepositPayment}
          paymentInfo={
            allowDepositPayment
              ? {
                  amount: documentData?.calculated?.minPayableAmount,
                  currency: "EUR",
                }
              : null
          }
        />
      )}

      {isInvoice && !isFullyPaid && (
        <DepositPaymentBox
          loading={btnLoading}
          amount={{
            amount: document?.balanceAmount,
            currency: "EUR",
          }}
          onPay={(email: string) => handleInvoicePayment(email)}
        />
      )}
    </div>
  );
};

export default ViewDocument;
