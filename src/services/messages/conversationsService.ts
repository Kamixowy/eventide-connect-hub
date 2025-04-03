
// This file is maintained for backward compatibility
// It re-exports functions from the new modular structure

export { getRecipient } from './utils/conversationUtils';
export { fetchConversations } from './operations/fetchConversations';
export { startConversation } from './operations/startConversation';

// Import from messageService to avoid circular dependencies
import { sendMessage } from './messagesService';
export { sendMessage };
