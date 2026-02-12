import { all, takeLatest } from "redux-saga/effects";
import { LOGIN, LOGOUT, UPDATE } from "../../module/Auth/Login/LoginConstants";
import {
  login,
  logout,
  updateUserAccount,
} from "../../module/Auth/Login/ApiLoginSaga";

export default function* rootSaga() {
  yield all([takeLatest(LOGIN, login)]);
  yield all([takeLatest(LOGOUT, logout)]);
  yield all([takeLatest(UPDATE, updateUserAccount)]);
}
