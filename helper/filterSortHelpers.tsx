import { BookType } from "../types/bookTypes";
import { AppliedFilterType, AppliedSortsType } from "../types/filters";

export function sortBooks(
  books: Array<BookType>,
  appliedSorts: AppliedSortsType
) {
  let sortedBooks = [...books];
  let key = appliedSorts.sortBy;
  if (!key || key === "created_at") {
    sortedBooks.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
  } else {
    switch (key) {
      case "title":
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "publisher":
        sortedBooks.sort((a, b) => a.publisher.localeCompare(b.publisher));
        break;
      case "isbn":
        sortedBooks.sort((a, b) => a.isbn.localeCompare(b.isbn));
        break;
      default:
        break;
    }
  }

  if (appliedSorts.sortOrder === "asc") {
    sortedBooks.reverse();
  }

  return sortedBooks;
}

export function filterBooks(
  books: Array<BookType>,
  { isbn, title, publisher, types, authors }: AppliedFilterType
) {
  if (!(isbn || title || publisher || types.length || authors.length)) {
    return books;
  }
  let filteredBooks = [...books];

  if (isbn) {
    filteredBooks = filteredBooks.filter((book) => book.isbn === isbn);
  }

  if (title) {
    filteredBooks = filteredBooks.filter((book) => book.title.includes(title));
  }

  if (publisher) {
    filteredBooks = filteredBooks.filter(
      (book) => book.publisher === publisher
    );
  }

  if (types.length) {
    filteredBooks = filteredBooks.filter((book) => types.includes(book.type));
  }

  if (authors.length) {
    filteredBooks = filteredBooks.filter((book) =>
      authors.every((author) => book.authors.includes(author))
    );
  }

  return filteredBooks;
}
