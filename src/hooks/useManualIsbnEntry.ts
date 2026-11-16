import { useState } from 'react';

import useBookNavigation from '@/hooks/useBookNavigation';
import useScanFeedback from '@/hooks/useScanFeedback';
import { isValidIsbn, normalizeIsbn } from '@/utils/isbn';

export default function useManualIsbnEntry() {
  const { openBookDetail } = useBookNavigation();
  const { vibrateOnSuccess } = useScanFeedback();
  const [isbnInput, setIsbnInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const submitIsbn = () => {
    void vibrateOnSuccess();
    if (!isValidIsbn(isbnInput)) {
      setInputError('ISBN invalide');
      return;
    }
    setInputError(null);
    openBookDetail(normalizeIsbn(isbnInput));
  };

  return { isbnInput, setIsbnInput, inputError, submitIsbn };
}
