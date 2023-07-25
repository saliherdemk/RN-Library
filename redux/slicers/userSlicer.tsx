import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
// import { User } from "@supabase/gotrue-js/src/lib/types";
import { User } from "@supabase/supabase-js";

// https://github.com/orgs/supabase/discussions/2222
export interface userState {
  user: User | null;
  userData: Object | null;
  userImageUrl: string | null;
}

const initialState: userState = {
  user: null,
  userData: null,
  userImageUrl: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    setUserImageUrl: (state, action: PayloadAction<string | null>) => {
      state.userImageUrl = action.payload;
    },

    removeUser: (state, _) => {
      console.log("asd");
      state.user = null;
      state.userData = null;
      state.userImageUrl = null;
    },
  },
});

export const { setUser, setUserImageUrl, removeUser } = userSlice.actions;

export default userSlice.reducer;
