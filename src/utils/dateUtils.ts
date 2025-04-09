
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy', { locale: pl });
};
