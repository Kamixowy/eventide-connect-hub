
// Export message types
export * from './types';

// Export message operations
export { fetchMessages } from './operations/fetchMessages';
export { sendMessage } from './operations/sendMessage';
export { fetchConversations } from './operations/fetchConversations';
export { startConversation } from './operations/startConversation';
export { fetchOrganizations } from './organizationsService';

// Export message utilities
export { checkConversationParticipation, markMessagesAsRead } from './utils/messageUtils';
export { getRecipient } from './utils/conversationUtils';

// Export hooks for message subscriptions
export { useMessageSubscription } from './hooks/useMessageSubscription';
export { useConversationsSubscription } from './hooks/useConversationsSubscription';

// Legacy export for backward compatibility
export * from './messagesService';
