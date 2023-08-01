import { BookType, ImageFileType, ReturnBookType } from "../types/bookTypes";
import { supabase } from "./supabase";

const getAuthor = async (name: string) => {
  const { data, error: authErr } = await supabase
    .from("authors")
    .select("name")
    .eq("name", name)
    .single();

  if (data?.name) return { name: data.name, needUpdate: false };

  const { data: authorData, error } = await supabase
    .from("authors")
    .insert({ name: name })
    .select("name")
    .single();

  if (authorData?.name) return { name: authorData?.name, needUpdate: true };
};

const getType = async (name: string) => {
  const { data, error: authErtypeErr } = await supabase
    .from("types")
    .select("name")
    .eq("name", name)
    .single();

  if (data?.name) return { name: data.name, needUpdate: false };
  const { data: typeData, error } = await supabase
    .from("types")
    .insert({ name })
    .select("name")
    .single();

  if (typeData) return { name: typeData.name, needUpdate: true };
};

const addBook = async (
  isbn: string,
  publisher_id: string | undefined,
  type: string,
  title: string,
  cover: ImageFileType | null,
  authors: string
) => {
  const typeData = await getType(type);
  const { data: bookData, error: bookErr } = await supabase
    .from("books")
    .insert({
      isbn,
      publisher_id,
      type: typeData?.name,
      title,
      cover_url_suffix: cover ? cover.name : "placeholder",
    })
    .select(
      "isbn,type(name),title,cover_url_suffix,created_at,publisher_id(username)"
    )
    .single();
  if (bookErr?.code == "23505") {
    return { err: "This book already exists", data: null };
  }

  var authorArray = authors.split("-");
  var hasErr = false;

  let authorArr = [];
  let authorNeedsUpdate = false;
  for (let i = 0; i < authorArray.length; i++) {
    const authorData = await getAuthor(authorArray[i]);
    authorNeedsUpdate = authorNeedsUpdate || (authorData?.needUpdate ?? false);
    if (bookData) {
      const { data: authBookData, error: authBookErr } = await supabase
        .from("AuthorBook")
        .insert({ author: authorData?.name, book: bookData.isbn })
        .select("author(name)")
        .single();
      // @ts-expect-error
      authorArr.push(authBookData?.author.name);
      hasErr = hasErr && authBookErr != null;
    }
  }

  if (hasErr) {
    return { err: "Something went wrong during the insertion", data: null };
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

  let bookObj: BookType = {
    authors: authorArr,
    cover_url_suffix: bookData?.cover_url_suffix,
    created_at: bookData?.created_at,
    isbn: bookData?.isbn,
    title: bookData?.title,
    type: typeData?.name,
    // @ts-expect-error
    publisher: bookData?.publisher_id.username,
  };
  return {
    err: null,
    data: bookObj,
    authorNeedsUpdate,
    typeNeedsUpdate: typeData?.needUpdate,
  };
};

const deleteBook = async (isbn: string, coverUrl: string) => {
  const { error } = await supabase.from("books").delete().eq("isbn", isbn);
  if (coverUrl !== "placeholder") {
    const { data, error: imageErr } = await supabase.storage
      .from("book_covers")
      .remove([coverUrl]);
  }

  return error;
};

const editBook = async (
  isbn: string,
  type: string,
  title: string,
  cover: ImageFileType | "placeholder" | null,
  oldCover: string,
  authors: string
) => {
  const typeData = await getType(type);
  const cover_url_suffix =
    cover == "placeholder" ? (cover as string) : cover ? cover.name : oldCover;
  const { error } = await supabase
    .from("books")
    .update({ type: typeData?.name, title, cover_url_suffix })
    .eq("isbn", isbn);

  if (error) return { err: error.message, data: null };
  // supabase doesn't allow to relational update for now.
  // Maybe we can write an edge function to handle this but for now,
  // lets delete and insert again.

  const { data, error: delErr } = await supabase
    .from("AuthorBook")
    .select("id")
    .eq("book", isbn);

  if (delErr) return { err: "Something went wrong", data: null };
  let hasError = false;
  data?.map(async (el) => {
    const { error: delErr } = await supabase
      .from("AuthorBook")
      .delete()
      .eq("id", el.id);
    hasError = hasError && delErr != null;
  });

  if (hasError) return { err: "Something went wrong", data: null };

  var authorArray = authors.split("-");
  var hasErr = false;
  let authorArr = [];
  let authorNeedsUpdate = false;
  for (let i = 0; i < authorArray.length; i++) {
    if (authorArr[i] == "") continue;
    const authorData = await getAuthor(authorArray[i]);
    authorNeedsUpdate = authorNeedsUpdate || (authorData?.needUpdate ?? false);

    const { data: authBookData, error: authBookErr } = await supabase
      .from("AuthorBook")
      .insert({ author: authorData?.name, book: isbn })
      .select("author(name)")
      .single();

    // @ts-expect-error
    authorArr.push(authBookData?.author.name);

    hasErr = hasErr && authBookErr != null;
  }
  if (hasError) return { err: "Something went wrong", data: null };

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
  /*
                       cover_url   cover       oldCover
  Old exists new not-ex -> placeholder placeholder qwe1690831946332
  Old not-ex new exists -> qwe1690831999053 {"name": "qwe1690831999053", "type": "image/*", "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/7170ea22-4180-46ca-acf0-8fdcdde4b4bf.jpg"} placeholder
  Old exists new exists -> qwe1690832027446 {"name": "qwe1690832027446", "type": "image/*", "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/f220676b-e236-4ce5-9092-161f7586b1b8.jpg"} qwe1690831999053
  Old not-ex new not-ex -> placeholder placeholder placeholder
  **/

  let bookObj: BookType = {
    authors: authorArr,
    isbn,
    cover_url_suffix,
    title,
    type: typeData?.name,
    created_at: "",
    publisher: "",
  };

  return {
    err: null,
    data: bookObj,
    authorNeedsUpdate,
    typeNeedsUpdate: typeData?.needUpdate,
  };
};

const getBooks = async () => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), AuthorBook(author)"
    )
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBooksByPublisher = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), AuthorBook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBookByISBN = async (isbn: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), AuthorBook(author)"
    )
    .eq("isbn", isbn)
    .single();

  return formatSingleBook(data);
};

const getUsersBooks = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url_suffix,users(username), AuthorBook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getUsersFavBooks = async (user_id: string) => {
  const { data, error } = await supabase
    .from("UserFavBook")
    .select("isbn(cover_url_suffix)")
    .match({ user_id })
    .order("created_at", { ascending: false });
  return data;
};

const addBookFromUserFavBooks = async (isbn: string, user_id: string) => {
  const { data, error } = await supabase
    .from("UserFavBook")
    .insert({ isbn, user_id });
};

const removeBookFromUserFavBooks = async (isbn: string, user_id: string) => {
  const { data, error } = await supabase
    .from("UserFavBook")
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
    authors: book.AuthorBook.map((b) => b.author),
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
      authors: book.AuthorBook.map((b) => b.author),
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
  addBookFromUserFavBooks,
  removeBookFromUserFavBooks,
};

export default BookService;
