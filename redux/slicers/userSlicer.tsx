import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase";
import { User } from "@supabase/supabase-js";
import { BookType } from "../../types/bookTypes";

// https://github.com/orgs/supabase/discussions/2222
export interface userState {
  user: User | null;
  data: {
    userBooks: Array<BookType>;
    favBooks: Array<BookType>;
  };
}

const initialState: userState = {
  user: null,
  data: {
    userBooks: [],
    favBooks: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    setUserData: (state, action) => {
      state.data = action.payload;
    },

    addBookToUserBooks: (state, action) => {
      state.data = {
        ...state.data,
        userBooks: [action.payload, ...state.data.userBooks],
      };
    },

    editBookFromUserBooks: (state, action) => {
      const updatedBook = action.payload;
      const newUserBooks = state.data.userBooks?.map((book) =>
        book.isbn === updatedBook.isbn
          ? {
              ...updatedBook,
              created_at: book.created_at,
              isbn: book.isbn,
              publisher: book.publisher,
            }
          : book
      );

      state.data = { ...state.data, userBooks: newUserBooks };
    },

    removeBookFromUserBooks: (state, action) => {
      const newUserBooks = state.data.userBooks.filter(
        (book) => book.isbn !== action.payload
      );

      state.data = { ...state.data, userBooks: newUserBooks };
    },

    addBookToFavBooks: (state, action) => {
      state.data = {
        ...state.data,
        favBooks: [action.payload, ...state.data.favBooks],
      };
    },

    removeBookFromFavBooks: (state, action) => {
      const newUserBooks = state.data.favBooks.filter(
        (book) => book.isbn !== action.payload
      );

      state.data = { ...state.data, favBooks: newUserBooks };
    },
    removeUser: (state, _) => {
      state.user = null;
      state.data = initialState.data;
    },
  },
});

export const {
  setUser,
  addBookToUserBooks,
  editBookFromUserBooks,
  removeBookFromUserBooks,
  addBookToFavBooks,
  removeBookFromFavBooks,
  removeUser,
  setUserData,
} = userSlice.actions;

export default userSlice.reducer;
