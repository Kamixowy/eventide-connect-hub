
-- Enable realtime for direct_conversations table
ALTER TABLE direct_conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_conversations;

-- Enable realtime for direct_messages table
ALTER TABLE direct_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;

-- Enable realtime for conversation_participants table
ALTER TABLE conversation_participants REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
