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
  favBooks: Array<BookType>;
}

const initialState: userState = {
  user: null,
  userBooks: [],
  userImageUrl: null,
  favBooks: [],
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

    setUserBooks: (state, action) => {
      state.userBooks = action.payload;
    },
    addBookToUserBooks: (state, action) => {
      state.userBooks = [action.payload, ...state.userBooks];
    },
    editBookFromUserBooks: (state, action) => {
      const updatedBook = action.payload;
      state.userBooks = state.userBooks?.map((book) =>
        book.isbn === updatedBook.isbn
          ? {
              ...updatedBook,
              created_at: book.created_at,
              isbn: book.isbn,
              publisher: book.publisher,
            }
          : book
      );
    },
    removeBookFromUserBooks: (state, action) => {
      state.userBooks = state.userBooks.filter(
        (book) => book.isbn !== action.payload
      );
    },

    setFavBooks: (state, action) => {
      state.favBooks = action.payload;
    },
    addBookToFavBooks: (state, action) => {
      state.favBooks = [action.payload, ...state.favBooks];
    },
    removeBookFromFavBooks: (state, action) => {
      state.favBooks = state.favBooks.filter(
        (book) => book.isbn !== action.payload
      );
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
  setFavBooks,
  addBookToFavBooks,
  removeBookFromFavBooks,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer;
