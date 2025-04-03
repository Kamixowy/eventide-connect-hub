
-- Enable Row Level Security for direct_conversations
ALTER TABLE IF EXISTS public.direct_conversations ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for direct_messages
ALTER TABLE IF EXISTS public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for conversation_participants
ALTER TABLE IF EXISTS public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is a participant in a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = $1 AND user_id = auth.uid()
  );
END;
$$;

-- Create a policy to allow users to view conversations they are participants in
CREATE POLICY IF NOT EXISTS "Users can view conversations they are participants in"
  ON public.direct_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

-- Create a policy to allow users to insert conversations
CREATE POLICY IF NOT EXISTS "Users can create conversations"
  ON public.direct_conversations
  FOR INSERT
  WITH CHECK (true);

-- Create a policy to allow users to update conversations they are participants in
CREATE POLICY IF NOT EXISTS "Users can update conversations they are participants in"
  ON public.direct_conversations
  FOR UPDATE
  USING (public.is_conversation_participant(id));

-- Create a policy to allow users to view messages in conversations they are participants in
CREATE POLICY IF NOT EXISTS "Users can view messages in their conversations"
  ON public.direct_messages
  FOR SELECT
  USING (public.is_conversation_participant(conversation_id));

-- Create a policy to allow users to insert messages in conversations they are participants in
CREATE POLICY IF NOT EXISTS "Users can insert messages in their conversations"
  ON public.direct_messages
  FOR INSERT
  WITH CHECK (public.is_conversation_participant(conversation_id) AND sender_id = auth.uid());

-- Create a policy to allow users to view conversation participants in their conversations
CREATE POLICY IF NOT EXISTS "Users can view participants in their conversations"
  ON public.conversation_participants
  FOR SELECT
  USING (public.is_conversation_participant(conversation_id));

-- Create a policy to allow users to add participants to conversations they are in
CREATE POLICY IF NOT EXISTS "Users can add participants to their conversations"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (public.is_conversation_participant(conversation_id) OR user_id = auth.uid());
