import { STORAGE_INDEXES } from "../constants";
import { getFromLocalStorage, setOnLocalStorage } from "../localStorage";

// export const getToken = () => {
//   const appStorage = getFromLocalStorage(STORAGE_INDEXES.APP_STORAGE);

//   if (!appStorage) {
//     return null;
//   }

//   return appStorage[STORAGE_INDEXES.ACCESS_TOKEN] || null;
// };
// export const saveAuth = (token: string, user?: any) => {
//   const data = { token, user };
//   setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, data);
// };
export const saveAuth = (access_token: string, user?: any) => {
  const data = { access_token, user };
  setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, data);
};

export const getToken = () => {
  const appStorage = getFromLocalStorage(STORAGE_INDEXES.APP_STORAGE);
  return appStorage?.access_token || null;
};
