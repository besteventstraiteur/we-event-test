import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../components/AuthLayout";

const RegisterPage = () => {
  

  return (
    <>
      <AuthLayout
        title={`Créez votre compte`}
        subtitle={
          "Rejoignez We Event pour commencer à organiser des événements ou à proposer vos services pour des événements exceptionnels."
        }
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
