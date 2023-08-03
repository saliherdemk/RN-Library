export interface BookType {
  authors: Array<string>;
  cover_url_suffix: string;
  isbn: string;
  title: string;
  type: string;
  publisher: string;
  created_at: string;
}
export interface ReturnBookType {
  isbn: any;
  created_at: any;
  title: any;
  type: any;
  cover_url_suffix: any;
  users: {
    username: any;
  }[];
  authorbook: {
    author: any;
  }[];
}
[] | null;

export interface TypesType {
  name: string;
}

export interface AuthorsType {
  name: string;
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

export interface ImageFileType {
  uri: string;
  name: string;
  type: string;
}
