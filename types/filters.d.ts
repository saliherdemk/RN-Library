export interface AppliedFilterType {
  title: string;
  isbn: string;
  publisher: string;
  types: Array<string>;
  authors: Array<string>;
}

export interface AppliedSortsType {
  sortBy: keyof BookType | null;
  sortOrder: "asc" | "desc" | null;
}
