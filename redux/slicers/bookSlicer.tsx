import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BookType } from "../../types/bookTypes";

export interface BookState {
  books: Array<BookType>;
}
const initialState: BookState = {
  books: [],
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    addBookToBooks: (state, action) => {
      state.books.unshift(action.payload);
    },
    editBookFromBooks: (state, action) => {
      const updatedBook = action.payload;
      state.books = state.books.map((book) =>
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
    removeBookFromBooks: (state, action) => {
      state.books = state.books.filter((book) => book.isbn !== action.payload);
    },
  },
});

export const {
  setBooks,
  addBookToBooks,
  editBookFromBooks,
  removeBookFromBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
