import React from "react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const ResetPassworSuc: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {/* <img src={mainImage} /> */}
      <h2>Reset Password successfully!</h2>
      <p>
        Your password has been successfully reset. You can now log in with your
        new password.
      </p>
      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    </div>
  );
};

export default ResetPassworSuc;
