
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";

import rootReducer from "../reducers";
import RootSaga from "../rootSaga";
import secureStorage from "../secureStorage";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage: secureStorage,
  whitelist: ["login"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(RootSaga);

// ✅ Create persistor once
export const persistor = persistStore(store);

// ✅ Types (for TypeScript users)
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

// ✅ Default export (optional, for compatibility)
export default { store, persistor };