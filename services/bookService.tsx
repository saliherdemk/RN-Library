import { useAppDispatch } from "../redux/hooks";
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

  let bookObj = {
    AuthorBook: [] as { author: any; id: any }[],
    cover_url: bookData?.cover_url,
    created_at: bookData?.created_at,
    isbn: bookData?.isbn,
    title: bookData?.title,
    type: bookData?.type,
    users: bookData?.publisher_id,
  };

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
  bookObj.AuthorBook = authorArr;

  if (hasErr) {
    return { err: "Something went wrong during the insertion", data: null };
  }

  return { err: null, data: bookObj };
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
