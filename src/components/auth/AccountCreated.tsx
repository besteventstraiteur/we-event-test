// import React from "react";
// import Button from "../ui/Button";
// import Accountlight from "../../assets/images/account-successfully.png";
// import accountdark from "../../assets/images/account-create.png";
// import { useNavigate } from "react-router-dom";

// const AccountCreated: React.FC = () => {
//   const savedTheme = localStorage.getItem("theme");

//   const navigate = useNavigate();
//   return (
//     <div data-no-translate className="space-y-4 text-center">
//       <img
//         src={savedTheme === "light" ? Accountlight : accountdark}
//         className="mx-auto"
//       />
//       <h2 className="font-bold text-lg dark:text-neutral-300">
//         Compte créé avec succès !
//       </h2>
//       <p className="text-gray-600 dark:text-neutral-300">
//         Bienvenue sur We Event ! Vous êtes prêt(e) à organiser ou à proposer des
//         services événementiels exceptionnels.
//       </p>
//       {/* Submit */}
//       <Button
//         onClick={() => navigate("/login")}
//         type="submit"
//         variant="primary"
//         size="large"
//         className="w-full"
//       >
//         Commençons !
//       </Button>
//     </div>
//   );
// };

// export default AccountCreated;

import React from "react";
import Button from "../ui/Button";
import Accountlight from "../../assets/images/account-successfully.png";
import accountdark from "../../assets/images/account-create.png";
import { useNavigate, useSearchParams } from "react-router-dom";

const AccountCreated: React.FC = () => {
  const savedTheme = localStorage.getItem("theme");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // "partner" | "client"
  const isPartner = type === "partner";

  return (
    <div data-no-translate className="space-y-4 text-center">
      <img
        src={savedTheme === "light" ? Accountlight : accountdark}
        className="mx-auto"
        alt="Account created"
      />

      <h2 className="font-bold text-lg dark:text-neutral-300">
        Compte créé avec succès !
      </h2>

      {/* CONTENT */}
      {!isPartner ? (
        <p className="text-gray-600 dark:text-neutral-300">
          Bienvenue sur We Event&nbsp;! Vous êtes prêt(e) à organiser ou à
          proposer des services événementiels exceptionnels.
        </p>
      ) : (
        <p className="text-gray-600 dark:text-neutral-300">
          Votre compte partenaire a bien été enregistré et est actuellement en
          cours de validation par un membre de l’équipe{" "}
          <strong>We Event</strong>.
          <br />
          <br />
          Une fois votre compte validé, vous recevrez un{" "}
          <strong>email de confirmation</strong> vous permettant de vous
          connecter à votre espace partenaire.
        </p>
      )}

      {/* CTA — only for client */}
      {!isPartner && (
        <Button
          onClick={() => navigate("/login")}
          type="button"
          variant="primary"
          size="large"
          className="w-full"
        >
          Commençons !
        </Button>
      )}
    </div>
  );
};

export default AccountCreated;
