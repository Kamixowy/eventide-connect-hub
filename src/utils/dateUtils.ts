
import { format, formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

// Format date for display - accepts both string and Date objects
export const formatDate = (date: string | Date) => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return format(dateObject, 'd MMMM yyyy', { locale: pl });
};

// Format message date for chat display
export const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // For today's messages, show time only
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'HH:mm');
  }
  
  // For yesterday's messages, show "Yesterday" and time
  if (date.toDateString() === yesterday.toDateString()) {
    return `Wczoraj, ${format(date, 'HH:mm')}`;
  }
  
  // For messages from this week, show day name and time
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return `${format(date, 'EEEE', { locale: pl })}, ${format(date, 'HH:mm')}`;
  }
  
  // For older messages, show full date
  return `${format(date, 'd MMM', { locale: pl })}, ${format(date, 'HH:mm')}`;
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { 
    addSuffix: true,
    locale: pl
  });
};
