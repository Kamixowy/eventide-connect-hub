
-- Update function to return table with conversation_id to match other similar functions
CREATE OR REPLACE FUNCTION public.find_conversation_with_organization(p_user_id UUID, p_organization_id UUID)
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
  WHERE p1.user_id = p_user_id
    AND p2.organization_id = p_organization_id;
END;
$$;
