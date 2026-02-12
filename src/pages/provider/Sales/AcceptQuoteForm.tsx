import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CheckCircle, CreditCard } from "lucide-react";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";

interface AcceptQuoteFormValues {
  fullName: string;
  email: string;
}

interface AcceptQuoteFormProps {
  type: "quote" | "invoice";
  onSubmit?: (data: AcceptQuoteFormValues) => void; // quote
  onPay?: (email: string) => void; // invoice
  btnLoading: boolean;
  showPayment?: boolean;
  paymentInfo?: {
    amount: number;
    currency: string;
  } | null;
}

const schema = yup.object({
  fullName: yup.string().required("Nom complet est requis"),
  email: yup.string().email("Email invalide").required("Email est requis"),
});

const AcceptQuoteForm = ({
  type,
  onSubmit,
  onPay,
  btnLoading,
  showPayment = false,
  paymentInfo = null,
}: AcceptQuoteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AcceptQuoteFormValues>({
    resolver: yupResolver(schema),
  });

  const emailValue = watch("email");
  
  return (
    <div className="p-4">
    <div className="w-full max-w-4xl mx-auto p-5 md:p-10 border-2 border-borderlight rounded-2xl bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6 text-lg font-medium">
        <CheckCircle />
        {type === "invoice"
          ? "Paiement de la facture"
          : "Accepter et signer le document"}
      </div>

      {/* ================= QUOTE FLOW ================= */}
      {type === "quote" && onSubmit && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* FULL NAME */}
          <InputGroup
            label="Nom complet *"
            placeholder="Votre nom complet"
            error={errors.fullName}
            inputProps={register("fullName")}
          />

          {/* EMAIL */}
          <InputGroup
            label="Email *"
            type="email"
            placeholder="votre@email.com"
            error={errors.email}
            inputProps={register("email")}
          />

          {/* PAYMENT INFO (DEPOSIT) */}
          {showPayment && paymentInfo && (
            <div className="border rounded-xl p-5 bg-green-50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
                <CreditCard size={18} />
                Paiement de l’acompte
              </div>

              <div className="text-sm text-green-900">
                Un acompte de{" "}
                <strong>
                  {paymentInfo.amount} {paymentInfo.currency}
                </strong>{" "}
                est requis.
              </div>

              <div className="border rounded-md p-3 bg-white text-sm flex items-center gap-2">
                <input type="radio" checked readOnly />
                Carte bancaire (Stripe)
              </div>
            </div>
          )}

          <Button
            loading={btnLoading}
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            {showPayment
              ? "Accepter et payer l’acompte"
              : "Accepter le document"}
          </Button>
        </form>
      )}

      {/* ================= INVOICE FLOW ================= */}
      {type === "invoice" && paymentInfo && onPay && (
        <div className="space-y-5">
          {/* EMAIL */}
          {/* <InputGroup
            label="Email *"
            type="email"
            placeholder="votre@email.com"
            error={errors.email}
            inputProps={register("email")}
          /> */}

          <div className="border rounded-xl p-5 bg-green-50 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
              <CreditCard size={18} />
              Paiement
            </div>

            <div className="text-sm text-green-900">
              Montant à payer :{" "}
              <strong>
                {paymentInfo.amount} {paymentInfo.currency}
              </strong>
            </div>

            <div className="border rounded-md p-3 bg-white text-sm flex items-center gap-2">
              <input type="radio" checked readOnly />
              Carte bancaire (Stripe)
            </div>
          </div>

          <Button
            loading={btnLoading}
            type="button"
            // disabled={!emailValue}
            onClick={() => onPay(emailValue)}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            Payer la facture
          </Button>
        </div>
      )}
    </div>
    </div>
  );
};

export default AcceptQuoteForm;
