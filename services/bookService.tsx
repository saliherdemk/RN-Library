import { BookType, ReturnBookType } from "../types/bookTypes";
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
  cover: {
    uri: string;
    name: string | undefined;
    type: string;
  } | null,
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
      has_cover: cover != null,
    })
    .select("isbn,type(name),title,has_cover,created_at,publisher_id(username)")
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
      .upload(isbn, cover, {
        contentType: "image/*",
      });
    if (error) {
      return { err: "Error uploading cover.", data: null };
    }
  }

  let bookObj: BookType = {
    authors: authorArr,
    has_cover: bookData?.has_cover,
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

const deleteBook = async (isbn: string) => {
  const { error } = await supabase.from("books").delete().eq("isbn", isbn);
  return error;
};

const editBook = async (
  isbn: string,
  type: string,
  title: string,
  has_cover: boolean,
  authors: string
) => {
  const typeData = await getType(type);
  const { error } = await supabase
    .from("books")
    .update({ type: typeData?.name, title, has_cover })
    .eq("isbn", isbn);

  if (error) return { err: error.message, data: null };
  // supabase doesn't allow to relational update for now.
  // Maybe we can write an edge function to handle this butt for now,
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
  let bookObj: BookType = {
    authors: authorArr,
    isbn,
    has_cover,
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
      "isbn, created_at,title,type,has_cover,users(username), AuthorBook(author)"
    )
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBooksByPublisher = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,has_cover,users(username), AuthorBook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const getBookByISBN = async (isbn: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,has_cover,users(username), AuthorBook(author)"
    )
    .eq("isbn", isbn)
    .single();

  return formatSingleBook(data);
};

const getUsersBooks = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,has_cover,users(username), AuthorBook(author)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return formatData(data);
};

const formatData = (data: ReturnBookType[] | null) => {
  const result = data?.map((book) => ({
    has_cover: book.has_cover,
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
      has_cover: book.has_cover,
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
};

export default BookService;
