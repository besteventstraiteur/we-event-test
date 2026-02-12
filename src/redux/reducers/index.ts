import { combineReducers } from "redux";
import LoginReducer from "../../module/Auth/Login/LoginReducer";
import RequestReducer from "./requestReducer";


const rootReducer = combineReducers({
  request: RequestReducer,
  login: LoginReducer,
});

export default rootReducer;
