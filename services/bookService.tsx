import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { BookType } from "../types/bookTypes";
import { supabase } from "./supabase";

const getAuthor = async (name: string) => {
  const { data, error: authErr } = await supabase
    .from("authors")
    .select("name")
    .eq("name", name)
    .single();
  if (data?.name) return { data: data.name, needUpdate: false };

  const { data: authorData, error } = await supabase
    .from("authors")
    .insert({ name })
    .select("name")
    .single();

  if (authorData) return { data: authorData.name, needUpdate: true };
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
  cover_url: string,
  authors: string
) => {
  const typeData = await getType(type);
  const { data: bookData, error: bookErr } = await supabase
    .from("books")
    .insert({ isbn, publisher_id, type: typeData?.name, title, cover_url: "" })
    .select("isbn,type(name),title,cover_url,created_at,publisher_id(username)")
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
    authorNeedsUpdate = authorNeedsUpdate && (authorData?.needUpdate ?? false);
    if (bookData) {
      const { data: authBookData, error: authBookErr } = await supabase
        .from("AuthorBook")
        .insert({ authorData: authorData?.data, book: bookData.isbn })
        .select("author,id")
        .single();

      authorArr.push({
        author: authBookData?.author,
        id: authBookData?.id,
      });
      hasErr = hasErr && authBookErr != null;
    }
  }

  if (hasErr) {
    return { err: "Something went wrong during the insertion", data: null };
  }
  let bookObj: BookType = {
    AuthorBook: [] as { author: any; id: any }[],
    cover_url: bookData?.cover_url,
    created_at: bookData?.created_at,
    isbn: bookData?.isbn,
    title: bookData?.title,
    type: typeData?.name,
    users: bookData?.publisher_id ?? [],
  };

  bookObj.AuthorBook = authorArr;

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
  cover_url: string,
  authors: string
) => {
  const typeData = await getType(type);
  const { error } = await supabase
    .from("books")
    .update({ type: typeData?.name, title, cover_url })
    .eq("isbn", isbn);

  if (error) return { err: error.message, data: null };
  // supabase doen't allow to relational update for now.
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
    const authorData = await getAuthor(authorArray[i]);
    authorNeedsUpdate = authorNeedsUpdate && (authorData?.needUpdate ?? false);

    const { data: authBookData, error: authBookErr } = await supabase
      .from("AuthorBook")
      .insert({ authorData: authorData?.data, book: isbn })
      .select("author,id")
      .single();

    authorArr.push({
      author: authBookData?.author,
      id: authBookData?.id,
    });
    hasErr = hasErr && authBookErr != null;
  }
  if (hasError) return { err: "Something went wrong", data: null };
  let bookObj: BookType = {
    AuthorBook: [] as { author: any; id: any }[],
    isbn,
    cover_url: cover_url,
    title: title,
    type: typeData?.name,
    created_at: "",
    users: { username: "" },
  };

  bookObj.AuthorBook = authorArr;

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
      "isbn, created_at,title,type,cover_url,users(username), AuthorBook(author,id)"
    )
    .order("created_at", { ascending: false });
  return data;
};

const getBooksByPublisher = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url,users(username), AuthorBook(author,id)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return data;
};

const getBookByISBN = async (isbn: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url,users(username), AuthorBook(author,id)"
    )
    .eq("isbn", isbn)
    .single();
  return data;
};

const getUsersBooks = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select(
      "isbn, created_at,title,type,cover_url,users(username), AuthorBook(author,id)"
    )
    .eq("publisher_id", id)
    .order("created_at", { ascending: false });

  return data;
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
