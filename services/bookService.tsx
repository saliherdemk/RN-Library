import { BookType, b } from "../types/bookTypes";
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
  const { data: isbnData, error: bookErr } = await supabase
    .from("books")
    .insert({ isbn, publisher_id, type, title, cover_url: "" })
    .select("isbn")
    .single();

  if (bookErr?.code == "23505") {
    return { err: "This book already exists" };
  }

  var authorArray = authors.split("-");
  var hasErr = false;
  for (let i = 0; i < authorArray.length; i++) {
    const author = await getAuthor(authorArray[i]);

    if (isbnData) {
      const { data: authBookData, error: authBookErr } = await supabase
        .from("AuthorBook")
        .insert({ author, book: isbnData.isbn })
        .select(
          "author,id,book(cover_url,created_at,isbn,title,type,users(username))"
        )
        .single();

      // let bookObj: BookType = {
      //   AuthorBook: [{ author: authBookData?.author, id: authBookData?.id }],
      //   cover_url: authBookData?.book.cover_url,
      //   created_at: authBookData?.book.created_at,
      //   isbn: authBookData?.book.isbn,
      //   title: authBookData?.book.title,
      //   type: authBookData?.book.type,
      //   users: authBookData?.bookb.users,
      // };
      // hasErr = hasErr && authBookErr != null;
    }
  }

  if (hasErr) {
    return { err: "Something went wrong during the insertion" };
  }

  return { err: null };
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

const deleteBook = async (isbn: string) => {
  const { error } = await supabase.from("books").delete().eq("isbn", isbn);
  return error;
};

const BookService = {
  addBook,
  getBooksByPublisher,
  deleteBook,
};

export default BookService;
