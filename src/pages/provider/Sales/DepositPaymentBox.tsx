interface DepositPaymentBoxProps {
  checkout: any;
  onPayNow: () => void;
  onPayLater: () => void;
}

const DepositPaymentBox = ({
  checkout,
  onPayNow,
  onPayLater,
}: DepositPaymentBoxProps) => {
  return (
    <div className="border rounded-lg p-5 bg-white space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        💳 Paiement de l’acompte
      </div>

      <div className="bg-green-50 text-green-800 p-3 rounded text-sm">
        Un acompte de{" "}
        <strong>
          {checkout.amount.toFixed(2)} {checkout.currency}
        </strong>{" "}
        est requis
      </div>

      <div className="border rounded p-3 flex items-center gap-2 text-sm">
        <input type="radio" checked readOnly />
        Carte bancaire (Stripe)
      </div>

      <button
        onClick={onPayNow}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
      >
        Accepter et payer l’acompte ({checkout.amount} €)
      </button>

      <button
        onClick={onPayLater}
        className="w-full border py-2 rounded text-sm"
      >
        Accepter sans payer maintenant
      </button>

      <p className="text-xs text-gray-500 text-center">
        Vous pourrez payer l’acompte plus tard selon les modalités du
        prestataire.
      </p>
    </div>
  );
};

export default DepositPaymentBox;
