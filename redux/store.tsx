import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slicers/userSlicer";

export const store = configureStore({
  reducer: {
    userData: userReducer,
  },
});

//https://redux.js.org/usage/usage-with-typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
