
// Ten plik jest utrzymywany dla wstecznej kompatybilności
// Reeksportuje funkcje z nowej modułowej struktury

export { fetchMessages } from './operations/fetchMessages';
export { 
  sendMessageToConversation,
  startConversationWithMessage, 
  createTestConversation 
} from './operations/sendMessageService';
export { markMessagesAsRead } from './utils/messageUtils';

// Eksportuj alias dla wstecznej kompatybilności
export { sendMessageToConversation as sendMessage } from './operations/sendMessageService';
