import { useState } from 'react';

import useBookNavigation from '@/features/scan/hooks/useBookNavigation';
import useScanFeedback from '@/features/scan/hooks/useScanFeedback';
import { IsbnService } from '@/features/scan/services/IsbnService';

export default function useManualIsbnEntry() {
  const { openBookDetail } = useBookNavigation();
  const { vibrateOnSuccess } = useScanFeedback();
  const [isbnInput, setIsbnInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitIsbn = async () => {
    if (!IsbnService.isValid(isbnInput)) {
      setInputError('ISBN invalide');
      return;
    }
    setInputError(null);
    setIsSubmitting(true);
    await vibrateOnSuccess();
    await openBookDetail(IsbnService.normalize(isbnInput));
    setIsSubmitting(false);
  };

  return { isbnInput, setIsbnInput, inputError, isSubmitting, submitIsbn };
}
