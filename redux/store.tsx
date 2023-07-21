import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slicers/userSlicer";

export const store = configureStore({
  reducer: {
    userData: userReducer,
  },
});
