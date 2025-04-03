
// Ten plik jest utrzymywany dla wstecznej kompatybilności
// Reeksportuje funkcje z nowej modułowej struktury

export { getRecipient } from './utils/conversationUtils';
export { fetchConversations } from './operations/fetchConversations';
export { createOrGetConversation as startConversation } from './operations/createOrGetConversation';

// Unikamy eksportu z messagesService aby uniknąć cyklicznych zależności
export { sendMessageToConversation as sendMessage } from './operations/sendMessageService';
