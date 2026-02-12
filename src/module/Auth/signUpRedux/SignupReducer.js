import { SIGNUP } from "./SignupConstants";

const initialState = {
  signUp: false,
};
function AuthReducer(STATE = initialState, action, reducerType = null) {
  switch (action.type) {
    case SIGNUP:
      return {
        signUp: action.payload.data,
      };

    default:
      return initialState;
  }
}

export default AuthReducer;
