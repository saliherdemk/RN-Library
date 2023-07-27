import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import { User } from "@supabase/supabase-js";
import { BookType } from "../../types/bookTypes";

// https://github.com/orgs/supabase/discussions/2222
export interface userState {
  user: User | null;
  userBooks: Array<BookType>;
  userImageUrl: string | null;
}

const initialState: userState = {
  user: null,
  userBooks: [],
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

    setUserBooks: (state, action: PayloadAction<Array<BookType>>) => {
      state.userBooks = action.payload;
    },

    addBookToUserBooks: (state, action: PayloadAction<BookType>) => {
      state.userBooks = state.userBooks
        ? [action.payload, ...state.userBooks]
        : [action.payload];
    },

    editBookFromUserBooks: (state, action: PayloadAction<BookType>) => {
      let updatedBook = action.payload;

      state.userBooks = state.userBooks.map((book) =>
        book.isbn == updatedBook.isbn
          ? {
              ...updatedBook,
              created_at: book.created_at,
              isbn: book.isbn,
              users: book.users,
            }
          : book
      );
    },

    removeBookFromUserBooks: (state, action: PayloadAction<string>) => {
      state.userBooks = state.userBooks
        ? state.userBooks.filter((book) => book.isbn !== action.payload)
        : [];
    },

    removeUser: (state, _) => {
      state.user = null;
      state.userBooks = [];
      state.userImageUrl = null;
    },
  },
});

export const {
  setUser,
  setUserImageUrl,
  setUserBooks,
  addBookToUserBooks,
  editBookFromUserBooks,
  removeBookFromUserBooks,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer;
