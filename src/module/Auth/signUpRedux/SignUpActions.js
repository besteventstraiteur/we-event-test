import { SIGNUP } from "./SignupConstants";

export const signUpAction = (data, callBackAcknowledge) => ({
    type: SIGNUP,
    payload:data,
    callback: callBackAcknowledge,
  });