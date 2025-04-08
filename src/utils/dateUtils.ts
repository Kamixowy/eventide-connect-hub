
// Format date to readable format
export const formatDate = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return 'Nieprawidłowa data';
  }
  
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Format time for messages
export const formatMessageTime = (dateString: string): string => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format full date with time for messages
export const formatMessageDate = (dateString: string): string => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  let formattedDate;
  
  if (isToday) {
    formattedDate = 'Dziś';
  } else if (isYesterday) {
    formattedDate = 'Wczoraj';
  } else {
    formattedDate = new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  }
  
  const time = new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
  
  return `${formattedDate}, ${time}`;
};
