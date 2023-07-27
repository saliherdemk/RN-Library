import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { BookType } from "../types/bookTypes";
import { supabase } from "./supabase";

const getAuthor = async (name: string) => {
  const { data, error: authErr } = await supabase
    .from("authors")
    .select("name")
    .eq("name", name);
  if (data?.length) return name;

  const { data: authorData, error } = await supabase
    .from("authors")
    .insert({ name })
    .select("name")
    .single();
  if (authorData) return authorData.name;
};

const addBook = async (
  isbn: string,
  publisher_id: string | undefined,
  type: string,
  title: string,
  cover_url: string,
  authors: string
) => {
  const { data: bookData, error: bookErr } = await supabase
    .from("books")
    .insert({ isbn, publisher_id, type, title, cover_url: "" })
    .select("isbn,type,title,cover_url,created_at,publisher_id(username)")
    .single();
  if (bookErr?.code == "23505") {
    return { err: "This book already exists", data: null };
  }

  var authorArray = authors.split("-");
  var hasErr = false;

  let authorArr = [];
  for (let i = 0; i < authorArray.length; i++) {
    const author = await getAuthor(authorArray[i]);

    if (bookData) {
      const { data: authBookData, error: authBookErr } = await supabase
        .from("AuthorBook")
        .insert({ author, book: bookData.isbn })
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

  let bookObj = {
    AuthorBook: [] as { author: any; id: any }[],
    cover_url: bookData?.cover_url,
    created_at: bookData?.created_at,
    isbn: bookData?.isbn,
    title: bookData?.title,
    type: bookData?.type,
    users: bookData?.publisher_id,
  };

  bookObj.AuthorBook = authorArr;

  return { err: null, data: bookObj };
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
  const { error } = await supabase
    .from("books")
    .update({ type, title, cover_url })
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
    console.log(el.id);
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
  for (let i = 0; i < authorArray.length; i++) {
    const author = await getAuthor(authorArray[i]);

    const { data: authBookData, error: authBookErr } = await supabase
      .from("AuthorBook")
      .insert({ author, book: isbn })
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
    type: type,
    created_at: "",
    users: { username: "" },
  };

  bookObj.AuthorBook = authorArr;

  return { err: null, data: bookObj };
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
