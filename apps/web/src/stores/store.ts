import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/model/auth.slice";
import accountReducer from "@/features/account/model/account.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      account: accountReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== "production",
  });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
