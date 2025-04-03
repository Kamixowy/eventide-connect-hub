
-- Create a function to find a conversation between two users
CREATE OR REPLACE FUNCTION public.find_conversation_between_users(user_one UUID, user_two UUID)
RETURNS TABLE(conversation_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id
  FROM direct_conversations c
  JOIN conversation_participants p1 ON c.id = p1.conversation_id
  JOIN conversation_participants p2 ON c.id = p2.conversation_id
  WHERE p1.user_id = user_one
    AND p2.user_id = user_two
    AND p1.user_id <> p2.user_id;
END;
$$;
