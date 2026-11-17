import { useRouter } from 'expo-router';
import { useState } from 'react';

import useSearchBooks from '@/features/search/hooks/useSearchBooks';
import type { SearchResult } from '@/types/book.types';

export default function useSearchScreen() {
  const router = useRouter();
  const [queryInput, setQueryInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const {
    searchResults,
    isLoadingSearch,
    errorSearch,
    hasMoreSearchResults,
    isFetchingMoreSearchResults,
    fetchMoreSearchResults,
  } = useSearchBooks(submittedQuery);

  const submitSearch = () => {
    setSubmittedQuery(queryInput.trim());
  };

  const loadMoreResults = () => {
    if (hasMoreSearchResults && !isFetchingMoreSearchResults) {
      fetchMoreSearchResults();
    }
  };

  const openResult = (result: SearchResult) => {
    if (result.isbn) router.push(`/book/${result.isbn}`);
  };

  return {
    queryInput,
    setQueryInput,
    submitSearch,
    searchResults,
    isLoadingSearch,
    isFetchingMoreSearchResults,
    hasSearchError: errorSearch != null,
    loadMoreResults,
    openResult,
  };
}
