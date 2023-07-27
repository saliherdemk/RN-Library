import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BookType } from "../../types/bookTypes";
import { RootState } from "../store";

export interface BookState {
  books: Array<BookType>;
  filters: {
    title: string | null;
    isbn: string | null;
    author: string | null;
    type: string | null;
    published_by: string | null;
  };
  sortBy: keyof BookType | null;
  sortOrder: "asc" | "desc";
}
const initialState: BookState = {
  books: [],
  filters: {
    title: null,
    isbn: null,
    author: null,
    type: null,
    published_by: null,
  },
  sortBy: null,
  sortOrder: "asc",
};

export const updateShownBooks = createAsyncThunk<
  BookType[],
  void,
  { state: RootState }
>("books/updateShownBooks", async (_, { getState }) => {
  const { books, filters, sortBy, sortOrder } = getState().bookData;

  let shownBooks = [...books];

  if (filters.title) {
    shownBooks = shownBooks.filter((book) => book.title === filters.title);
  }

  if (filters.isbn) {
    shownBooks = shownBooks.filter((book) => book.isbn === filters.isbn);
  }

  if (filters.author) {
    shownBooks = shownBooks.filter((book) =>
      book.AuthorBook.some((a) => a.author === filters.author)
    );
  }

  if (filters.type) {
    shownBooks = shownBooks.filter((book) => book.type === filters.type);
  }

  if (sortBy) {
    shownBooks.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // @ts-expect-error
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  if (filters.published_by) {
    shownBooks = shownBooks.filter(
      (book) => book.users.username === filters.published_by
    );
  }

  return shownBooks;
});

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
        book.isbn === updatedBook.isbn ? { ...updatedBook } : book
      );
    },
    removeBookFromBooks: (state, action) => {
      state.books = state.books.filter((book) => book.isbn !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateShownBooks.fulfilled, (state, action) => {
      // Since the updated books are returned by the thunk, we don't need the shownBooks field anymore.
      state.books = action.payload;
    });
  },
});

export const {
  setBooks,
  addBookToBooks,
  editBookFromBooks,
  removeBookFromBooks,
  setFilters,
  setSortOrder,
  setSortBy,
} = bookSlice.actions;

export default bookSlice.reducer;
