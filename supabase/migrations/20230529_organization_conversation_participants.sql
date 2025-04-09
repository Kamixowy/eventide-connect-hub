
-- Add columns to conversation_participants for organization support
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS is_organization BOOLEAN DEFAULT false;
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Update existing policies to include the new column
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
CREATE POLICY "Users can view participants in their conversations" ON public.conversation_participants
FOR SELECT
USING (public.is_conversation_participant(conversation_id) OR 
       EXISTS (
         SELECT 1 FROM public.organizations o
         JOIN public.conversation_participants cp ON cp.organization_id = o.id
         WHERE o.user_id = auth.uid() AND cp.conversation_id = conversation_participants.conversation_id
       ));

-- Create a new policy to allow organizations to add participants
CREATE POLICY IF NOT EXISTS "Organizations can add participants" ON public.conversation_participants
FOR INSERT
WITH CHECK (
  (NOT is_organization AND user_id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_id AND o.user_id = auth.uid()
  )
);

-- Update the is_conversation_participant function to check for organization participation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = $1 AND (user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.organizations o
        WHERE o.user_id = auth.uid() AND o.id = organization_id
      ))
  );
END;
$$;

-- Update conversation security policies to include organization access
DROP POLICY IF EXISTS "Users can view conversations they are participants in" ON public.direct_conversations;
CREATE POLICY "Users can view conversations they are participants in" ON public.direct_conversations
FOR SELECT
USING (
  public.is_conversation_participant(id)
);

-- Update direct messages policies for organization access
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.direct_messages;
CREATE POLICY "Users can view messages in their conversations" ON public.direct_messages
FOR SELECT
USING (
  public.is_conversation_participant(conversation_id)
);

DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.direct_messages;
CREATE POLICY "Users can insert messages in their conversations" ON public.direct_messages
FOR INSERT
WITH CHECK (
  public.is_conversation_participant(conversation_id) AND (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organizations o
      JOIN public.conversation_participants cp ON cp.organization_id = o.id
      WHERE o.user_id = auth.uid() AND cp.conversation_id = conversation_id
    )
  )
);
