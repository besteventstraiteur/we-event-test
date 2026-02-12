// SignupWithGoogleCodeButton.tsx
import Button from "@/components/Button";
import { AUTH } from "@/utils/endPoints";
import { postRequest } from "@/utils/http-client/axiosClient";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function SignupWithGoogleCodeButton() {
  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (token) => {
      // 1) Fetch profile right on the client
      const resp = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );
      const profile = await resp.json(); // { sub, name, given_name, family_name, email, picture, email_verified, ... }
      console.log("profile", profile);

      try {
        const payload = {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          email: profile?.email,
          provider: "google",
          providerId: profile?.sub,
          role: "sp",
        };
        console.log(payload, "checlkpaydjkbsd");
        return;
        const postRequest = await postRequest(`${AUTH.SOCIAL_LOGIN}`);
      } catch (error) {
        toast.error("Error , Please try again");
        console.log(error);
      }
    },
    onError: (err) => console.error("Google login failed", err),
  });

  return (
    <Button
      onClick={() => login()}
      className="btn btn-outline btn-outline-light w-100"
    >
      <img src="/images/google-icon.svg" alt="signup with google" />
      Sign up with Google
    </Button>
  );
}
