
-- Create a function to safely add a participant to a conversation
-- This function runs with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.add_participant_to_conversation(
  conversation_id UUID,
  participant_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the participant is already in the conversation
  IF NOT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = add_participant_to_conversation.conversation_id
    AND user_id = add_participant_to_conversation.participant_id
  ) THEN
    -- Add the participant
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (
      add_participant_to_conversation.conversation_id,
      add_participant_to_conversation.participant_id
    );
  END IF;
END;
$$;

-- Grant execution permission to all users
GRANT EXECUTE ON FUNCTION public.add_participant_to_conversation TO public;
