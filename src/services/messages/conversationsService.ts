
// Ten plik jest utrzymywany dla wstecznej kompatybilności
// Reeksportuje funkcje z nowej modułowej struktury

export { getRecipient } from './utils/conversationUtils';
export { fetchConversations } from './operations/fetchConversations';
export { startConversation } from './operations/startConversation';

// Powinniśmy importować bezpośrednio z operacji, aby uniknąć cyklicznych zależności
export { sendMessageToConversation as sendMessage } from './operations/sendMessageService';
