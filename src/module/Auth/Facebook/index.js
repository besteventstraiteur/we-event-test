import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

function LoginWithFacebook() {
  return (
    <>
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} className="facebook-btn">
            {/* <FaFacebookF size={18} /> */}
            <span>Continue with Facebook</span>
          </button>
        )}
      />
    </>
  );
}

export default LoginWithFacebook;
