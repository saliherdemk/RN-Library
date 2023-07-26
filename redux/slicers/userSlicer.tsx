import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import { User } from "@supabase/supabase-js";
import { BookType } from "../../types/bookTypes";

// https://github.com/orgs/supabase/discussions/2222
export interface userState {
  user: User | null;
  userBooks: Array<BookType> | null;
  userImageUrl: string | null;
}

const initialState: userState = {
  user: null,
  userBooks: null,
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

    setUserBooks: (state, action: PayloadAction<Array<BookType> | null>) => {
      state.userBooks = action.payload;
    },
    addBookToUserBooks: (state, action: PayloadAction<BookType>) => {
      state.userBooks = state.userBooks
        ? [...state.userBooks, action.payload]
        : [action.payload];
    },

    removeBookFromUserBooks: (state, action: PayloadAction<string>) => {
      state.userBooks = state.userBooks
        ? state.userBooks.filter((book) => book.isbn !== action.payload)
        : null;
    },

    removeUser: (state, _) => {
      state.user = null;
      state.userBooks = null;
      state.userImageUrl = null;
    },
  },
});

export const {
  setUser,
  setUserImageUrl,
  setUserBooks,
  addBookToUserBooks,
  removeBookFromUserBooks,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer;
