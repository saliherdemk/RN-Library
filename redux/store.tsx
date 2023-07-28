import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slicers/userSlicer";
import bookReducer from "./slicers/bookSlicer";
import filterSlicer from "./slicers/filterSlicer";

export const store = configureStore({
  reducer: {
    userData: userReducer,
    bookData: bookReducer,
    filtersData: filterSlicer,
  },
});

//https://redux.js.org/usage/usage-with-typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
