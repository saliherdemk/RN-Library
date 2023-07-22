import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
// import { User } from "@supabase/gotrue-js/src/lib/types";
import { User } from "@supabase/supabase-js";

// https://github.com/orgs/supabase/discussions/2222
export interface userState {
  user: User | null;
}

const initialState: userState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: (state, _) => {
      state.user = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
