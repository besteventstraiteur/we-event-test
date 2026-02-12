import AuthLayout from "../components/AuthLayout";
import ResetpasswordForm from "../components/auth/Resetpassword";

const ResetpasswordPage = () => {
  return (
    <AuthLayout
      title="Réinitialisez votre mot de passe"
      subtitle="Nous vous avons envoyé un lien sécurisé par e-mail pour réinitialiser votre mot de passe."
    >
      <ResetpasswordForm />
    </AuthLayout>
  );
};

export default ResetpasswordPage;
