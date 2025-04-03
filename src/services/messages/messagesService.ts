
// This file is maintained for backward compatibility
// It re-exports functions from the new modular structure

export { fetchMessages } from './operations/fetchMessages';
export { sendMessageToConversation, startConversationWithMessage, createTestConversation } from './operations/sendMessageService';
export { markMessagesAsRead } from './utils/messageUtils';

