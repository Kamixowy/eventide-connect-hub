
// This file is maintained for backward compatibility
// It re-exports functions from the new modular structure

export { getRecipient } from './utils/conversationUtils';
export { fetchConversations } from './operations/fetchConversations';
export { startConversation } from './operations/startConversation';

// We should import from the operations directly to avoid circular dependencies
export { sendMessageToConversation as sendMessage } from './operations/sendMessageService';
