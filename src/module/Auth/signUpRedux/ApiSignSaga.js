const { default: actions } = require("@/redux/actions");
import { all, call, takeLatest, put } from "redux-saga/effects";
import { AuthEndPoint, SIGNUP, SIGNUP_SUCCESS } from "./SignupConstants";
import { postRequest } from "@/utils/http-client/axiosClient";
import { RESPONSE_CODE } from "@/utils/constants";
import { AUTH } from "@/utils/endPoints";

export function* signUp({ payload }) {
  yield put({ type: actions.INIT_LOADER, payload: { loader: true } });

  try {
    const { data, status } = yield call(() =>
      postRequest(AUTH.SIGNUP, payload)
    );
    if (status === RESPONSE_CODE[200] && data.success) {
      yield put({
        type: SIGNUP_SUCCESS,
        payload: data.success,
        index: SIGNUP_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: actions.FAILURE,
      payload: error.response?.data,
      index: actions.FAILURE,
    });
  }
}
