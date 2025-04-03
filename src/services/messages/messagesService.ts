
// This file is maintained for backward compatibility
// It re-exports functions from the new modular structure

export { fetchMessages } from './operations/fetchMessages';
export { sendMessage } from './operations/sendMessage';
export { checkConversationParticipation } from './operations/checkConversationParticipation';
export { markMessagesAsRead } from './utils/messageUtils';
