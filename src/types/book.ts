export type Book = {
  isbn: string;
  title: string;
  author: string;
};

export type BookDetails = {
  title: string;
  numberOfPages?: number;
  byStatement?: string;
};

export type SearchResult = {
  key: string;
  title: string;
  author: string;
  isbn?: string;
};
