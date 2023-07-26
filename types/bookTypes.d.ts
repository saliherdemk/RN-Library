export interface BookType {
  AuthorBook: Array<AuthBook>;
  cover_url: string;
  isbn: string;
  title: string;
  type: string;
  users: { username: string };
  created_at: string;
}

export interface AuthBook {
  author: string;
  id: number;
}

export interface authBookData {
  author: string;
  id: number;
  book: {
    cover_url: string;
    created_at: string;
    isbn: string;
    title: string;
    users: {
      username: string | null;
    };
  };
}

export interface b {
  cover_url: any;
  isbn: any;
  title: any;
  type: any;
  users: { username: any };
  created_at: any;
}
