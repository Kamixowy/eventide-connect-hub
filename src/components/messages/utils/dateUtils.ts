
// Format date to display only the date part
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL');
};

// Format time to display in messages
export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) + 
         ' • ' + 
         date.toLocaleDateString('pl-PL');
};
