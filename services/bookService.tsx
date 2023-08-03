import { trimString } from "../helper/trim";
import { BookType, ImageFileType, ReturnBookType } from "../types/bookTypes";
import { supabase } from "./supabase";

const addBook = async (
  isbn: string,
  publisher_id: string | undefined,
  type: string,
  title: string,
  cover: ImageFileType | null,
  authors: string[]
) => {
  const cover_url = cover ? cover.name : "placeholder";
  const { data, error } = await supabase.rpc("add_book", {
    _isbn: isbn as string,
    _title: title,
    _type: type,
    _publisher_id: publisher_id,
    _cover_url_suffix: cover_url,
    _authors: authors,
  });

  if (error?.message == "Book already exists") {
    return { err: "This book already exists", data: null };
  }

  if (cover) {
    const { data, error } = await supabase.storage
      .from("book_covers")
      //@ts-expect-error
      .upload(cover.name, cover, {
        contentType: "image/*",
      });
    if (error) {
      return { err: "Error uploading cover.", data: null };
    }
  }
  const bookData = data[0];
  const returnAuthor = trimString(bookData?.return_authors).split(",");
  let bookObj: BookType = {
    authors: returnAuthor,
    cover_url_suffix: cover_url,
    created_at: bookData?.return_created_at,
    isbn: bookData?.return_isbn,
    title: bookData?.return_title,
    type: bookData?.return_type,
    publisher: bookData?.return_publisher_username,
  };

  return {
    err: null,
    data: {
      ...bookObj,
      authorNeedsUpdate: bookData?.author_needs_update,
      typeNeedsUpdate: bookData?.type_needs_update,
    },
  };
};

const deleteBook = async (isbn: string, coverUrl: string) => {
  const { data, error } = await supabase.rpc("delete_book", { _isbn: isbn });
  if (coverUrl !== "placeholder") {
    const { data, error: imageErr } = await supabase.storage
      .from("book_covers")
      .remove([coverUrl]);
  }
  return { ...data[0], err: error };
};

const editBook = async (
  isbn: string,
  type: string,
  title: string,
  cover: ImageFileType | "placeholder" | null,
  oldCover: string,
  authors: string
) => {
  const cover_url_suffix =
    cover == "placeholder" ? (cover as string) : cover ? cover.name : oldCover;

  const { data: a, error: b } = await supabase.rpc("edit_book", {
    _isbn: isbn,
    _new_type: type,
    _new_title: title,
    _new_cover_url_suffix: cover_url_suffix,
    _new_authors: trimString(authors).split("-"),
  });

  if (oldCover !== "placeholder") {
    const { error: imageErr } = await supabase.storage
      .from("book_covers")
      .remove([oldCover]);
    if (imageErr) return { err: "Something went wrong", data: null };
  }

  if (cover && cover !== "placeholder") {
    const { data, error } = await supabase.storage
      .from("book_covers")
      //@ts-expect-error
      .upload(cover.name, cover, {
        contentType: "image/*",
      });
  }

  const bookData = a[0];
  const returnAuthor = trimString(bookData?.return_authors).split(",");

  let bookObj: BookType = {
    authors: returnAuthor,
    isbn,
    cover_url_suffix,
    title: bookData?.return_title,
    type: bookData?.return_type,
    created_at: "",
    publisher: "",
  };

  return {
    err: null,
    data: {
      ...bookObj,
      authorNeedsUpdate: bookData?.author_needs_update,
      typeNeedsUpdate: bookData?.type_needs_update,
    },
  };

  /*
                       cover_url   cover       oldCover
  Old exists new not-ex -> placeholder placeholder qwe1690831946332
  Old not-ex new exists -> qwe1690831999053 {"name": "qwe1690831999053", "type": "image/*", "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/7170ea22-4180-46ca-acf0-8fdcdde4b4bf.jpg"} placeholder
  Old exists new exists -> qwe1690832027446 {"name": "qwe1690832027446", "type": "image/*", "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/f220676b-e236-4ce5-9092-161f7586b1b8.jpg"} qwe1690831999053
  Old not-ex new not-ex -> placeholder placeholder placeholder
  **/
};

const getBooks = async () => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), authorbook(author)"
    )
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBooksByPublisher = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), authorbook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBookByISBN = async (isbn: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), authorbook(author)"
    )
    .eq("isbn", isbn)
    .single();

  return formatSingleBook(data);
};

const getUsersBooks = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), authorbook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getUsersFavBooks = async (user_id: string) => {
  const { data, error } = await supabase
    .from("userfavbook")
    .select("isbn(cover_url_suffix,isbn)")
    .match({ user_id })
    .order("created_at", { ascending: false });
  return data?.map((item) => item.isbn);
};

const addBookToUserFavBooks = async (isbn: string, user_id: string) => {
  const { data: d, error: err } = await supabase
    .from("userfavbook")
    .select("isbn(cover_url_suffix,isbn)")
    .match({ isbn, user_id });
  if (d) return;

  const { data, error } = await supabase
    .from("userfavbook")
    .insert({ isbn: isbn, user_id: user_id });
};

const removeBookFromUserFavBooks = async (isbn: string, user_id: string) => {
  const { data, error } = await supabase
    .from("userfavbook")
    .delete()
    .match({ isbn, user_id });
};

const formatData = (data: ReturnBookType[] | null) => {
  const result = data?.map((book) => ({
    cover_url_suffix: book.cover_url_suffix,
    created_at: book.created_at,
    isbn: book.isbn,
    title: book.title,
    type: book.type,
    authors: book.authorbook.map((b) => b.author),
    //@ts-expect-error
    publisher: book.users?.username || "",
  }));
  return result;
};

const formatSingleBook = (book: ReturnBookType | null) => {
  var result = null;
  if (book) {
    result = {
      cover_url_suffix: book.cover_url_suffix,
      created_at: book.created_at,
      isbn: book.isbn,
      title: book.title,
      type: book.type,
      authors: book.authorbook.map((b) => b.author),
      //@ts-expect-error
      publisher: book.users?.username || "",
    };
  }
  return result;
};

const BookService = {
  addBook,
  getBooksByPublisher,
  deleteBook,
  editBook,
  getBookByISBN,
  getBooks,
  getUsersBooks,
  getUsersFavBooks,
  addBookToUserFavBooks,
  removeBookFromUserFavBooks,
};

export default BookService;
