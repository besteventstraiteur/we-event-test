import { call, put } from "redux-saga/effects";
import {
  LOGOUT_SUCCESS,
  UPDATE_SUCCESS,
  VERIFY_SUCCESS,
} from "./LoginConstants";

import axios from "axios";
import { AUTH } from "../../../utils/endPoints";
import { RESPONSE_CODE, STORAGE_INDEXES } from "../../../utils/constants";
import { setOnLocalStorage } from "../../../utils/localStorage";
import actions from "../../../redux/actions";
import { postRequest } from "../../../utils/http-client/axiosClient";
import { defaultInitialState } from "../../../utils/seeds/Authseeders";

export function* login({ payload, navigate, query }) {
  yield put({ type: actions.INIT_LOADER, payload: { loader: true } });

  try {
    // Step 1: Call login API
    const {
      data: { data },
      status,
    } = yield call(() => axios.post(AUTH.LOGIN, payload));

    if (status === RESPONSE_CODE[200]) {
      const token = data.token;
      if (!token) throw new Error("Token missing in login response");

      // Step 2: Fetch user details with token
      const { data: authUserData, status: userStatus } = yield call(() =>
        axios.get(AUTH.GETUSERDETAILS, {
          headers: {
            "x-auth-token": token,
          },
        })
      );

      if (userStatus !== RESPONSE_CODE[200] || !authUserData) {
        throw new Error("Failed to fetch user data");
      }

      const authDetails = {
        access_token: token,
        user: authUserData?.data || {},
      };

      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, authDetails);

      const role = authDetails.user?.role;
    
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "client") {
        if (query) {
          navigate(`/partners/${query}`);
        } else {
          navigate("/client");
        }
      } else {
        navigate("/provider");
      }

      yield put({ type: actions.LOGIN_SUCCESS, payload: authDetails });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: actions.FAILURE,
      payload: error.response?.data || { message: error.message },
      index: actions.FAILURE,
    });
  }

  yield put({ type: actions.INIT_LOADER, payload: { loader: false } });
}

export function* verify(token) {
  yield put({ type: actions.INIT_LOADER, payload: { loader: true } });
  const { payload } = token;
  try {
    const { data, status } = yield call(() =>
      postRequest(AUTH.VERIFY, { token: payload })
    );
    if (status === RESPONSE_CODE[200]) {
      yield put({
        type: VERIFY_SUCCESS,
        payload: data,
        index: VERIFY_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: actions.FAILURE,
      payload: error.response.data,
      index: actions.FAILURE,
    });
  }
}

export function* updateUserAccount(action) {
  const _data = action.payload;
  console.log(_data, "checkdssaction in updateUserAccdssdount saga");
  // const authDetails = authUserData(_data);
  setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, action.payload);
  yield put({
    type: UPDATE_SUCCESS,
    payload: _data,
  });
}

export function* logout(action) {
  const {
    payload: { callback },
  } = action;
  yield put({
    type: LOGOUT_SUCCESS,
    payload: defaultInitialState(STORAGE_INDEXES.APP_STORAGE),
  });
  callback.push("/login");
}
