import {
  VERIFY,
  LOGIN,
  LOGOUT,
  UPDATE,
  UPDATE_SUCCESS,
} from "./LoginConstants";

export const loginAction = (data, navigate, query) => ({
  type: LOGIN,
  payload: data,
  navigate,
  query,
});

export const verifyAction = (data) => ({
  type: VERIFY,
  payload: data,
});

export const logoutAction = (callback) => ({
  type: LOGOUT,
  payload: { callback },
});

// This action is dispatched AFTER a successful update (already has the latest user payload)
export const updateUserAccountAction = (data) => ({
  type: UPDATE_SUCCESS,
  payload: data,
});
