
// This file is maintained for backward compatibility
// It re-exports functions from the new modular structure

export { fetchMessages } from './operations/fetchMessages';
export { 
  sendMessageToConversation, 
  startConversationWithMessage, 
  createTestConversation 
} from './operations/sendMessageService';
export { markMessagesAsRead } from './utils/messageUtils';

// Export the alias for backward compatibility
export { sendMessageToConversation as sendMessage } from './operations/sendMessageService';
