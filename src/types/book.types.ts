export type Book = {
  isbn: string;
  title: string;
  author: string;
  numberOfPages?: number;
};

export type SearchResult = {
  key: string;
  title: string;
  author: string;
  isbn?: string;
};

export type SearchPage = {
  results: SearchResult[];
  page: number;
  hasMore: boolean;
};
