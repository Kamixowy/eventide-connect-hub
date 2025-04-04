import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CollaborationType } from '@/types/collaboration';

// Interface for creating collaboration option
interface CollaborationOptionCreate {
  collaboration_id: string;
  sponsorship_option_id: string;
}

// Interface for creating a new collaboration
interface CollaborationCreate {
  sponsor_id: string;
  organization_id: string;
  event_id: string;
  status: string;
  message: string;
  total_amount: number;
}

// Interface for creating custom option
interface CustomOptionCreate {
  event_id: string;
  title: string;
  description?: string;
  price: number;
}

// Function to fetch all collaborations for authenticated user
export const fetchCollaborations = async (userType?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Determine query based on user type
    let query;

    if (userType === 'organization') {
      query = supabase
        .from('collaborations')
        .select(`
          *,
          events:event_id(*),
          sponsor:sponsor_id(
            id,
            profiles:user_id(*)
          )
        `)
        .eq('organization_id', user.id);
    } else {
      query = supabase
        .from('collaborations')
        .select(`
          *,
          events:event_id(*),
          organization:organization_id(
            id,
            name,
            description,
            logo_url,
            profiles:user_id(*)
          )
        `)
        .eq('sponsor_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching collaborations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch collaborations:', error);
    throw error;
  }
};

// Create a new collaboration
export const createCollaboration = async (
  eventId: string,
  organization: { id: string },
  selectedOptions: Array<{ id: string }>,
  customOptions: Array<{ title: string, description?: string, price: number }>,
  message: string,
  totalAmount: number
) => {
  try {
    console.log('Creating collaboration with data:', {
      eventId,
      organization,
      selectedOptions,
      customOptions,
      message,
      totalAmount
    });

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // 1. Create the collaboration record
    const { data: collaboration, error: collaborationError } = await supabase
      .from('collaborations')
      .insert({
        sponsor_id: user.id,
        organization_id: organization.id,
        event_id: eventId,
        status: 'Przesłana',
        message: message,
        total_amount: totalAmount
      })
      .select()
      .single();

    if (collaborationError) {
      console.error('Error creating collaboration:', collaborationError);
      throw new Error(`Błąd podczas tworzenia współpracy: ${collaborationError.message}`);
    }

    if (!collaboration) {
      throw new Error('Nie udało się utworzyć współpracy');
    }

    const collaborationId = collaboration.id;
    
    // 2. Create custom sponsorship options if needed
    if (customOptions && customOptions.length > 0) {
      const customOptionsData = customOptions.map(option => ({
        event_id: eventId,
        title: option.title,
        description: option.description || '',
        price: option.price
      }));

      const { data: createdCustomOptions, error: customOptionsError } = await supabase
        .from('sponsorship_options')
        .insert(customOptionsData)
        .select();

      if (customOptionsError) {
        console.error('Error creating custom options:', customOptionsError);
        // Continue with existing options, don't fail the whole process
      }

      // Add the custom options to selectedOptions for the next step
      if (createdCustomOptions) {
        selectedOptions = [...selectedOptions, ...createdCustomOptions];
      }
    }

    // 3. Link the selected options to the collaboration
    if (selectedOptions && selectedOptions.length > 0) {
      const optionLinks = selectedOptions.map(option => ({
        collaboration_id: collaborationId,
        sponsorship_option_id: option.id
      }));

      const { error: optionsLinkError } = await supabase
        .from('collaboration_options')
        .insert(optionLinks);

      if (optionsLinkError) {
        console.error('Error linking options to collaboration:', optionsLinkError);
        // Continue despite the error
      }
    }

    return { success: true, collaborationId };
  } catch (error: any) {
    console.error('Error in createCollaboration:', error);
    throw new Error(`Błąd podczas tworzenia współpracy: ${error.message}`);
  }
};

// Gets collaboration details by ID
export const getCollaborationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        events:event_id(*),
        sponsor:sponsor_id(
          id,
          profiles:user_id(*)
        ),
        organization:organization_id(
          id,
          name,
          description,
          logo_url,
          profiles:user_id(*)
        ),
        options:collaboration_options(
          id,
          sponsorship_options:sponsorship_option_id(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching collaboration:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch collaboration:', error);
    throw error;
  }
};

// Updates collaboration status
export const updateCollaborationStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaboration status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update collaboration status:', error);
    throw error;
  }
};

// Send a message in a collaboration conversation
export const sendCollaborationMessage = async (
  collaborationId: string,
  content: string
) => {
  try {
    // First, check if this collaboration has a conversation
    const { data: collaboration, error: collabError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', collaborationId)
      .single();

    if (collabError) {
      console.error('Error fetching collaboration:', collabError);
      throw new Error('Nie znaleziono współpracy');
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a new message in direct_messages table
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: 'your-conversation-id', // You need to implement a way to get or create conversation ID for collaborations
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Nie udało się wysłać wiadomości');
    }

    return message;
  } catch (error: any) {
    console.error('Error in sendCollaborationMessage:', error);
    throw new Error(`Błąd podczas wysyłania wiadomości: ${error.message}`);
  }
};

// Get messages for a collaboration
export const getCollaborationMessages = async (collaborationId: string) => {
  try {
    // First, get the conversation ID for this collaboration
    // You need to implement a way to get conversation ID for collaborations

    // Then fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', 'your-conversation-id') // Replace with actual conversation ID
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw new Error('Nie udało się pobrać wiadomości');
    }

    return messages || [];
  } catch (error: any) {
    console.error('Error in getCollaborationMessages:', error);
    throw new Error(`Błąd podczas pobierania wiadomości: ${error.message}`);
  }
};

// Mark all messages in a collaboration as read
export const markCollaborationMessagesAsRead = async (collaborationId: string) => {
  try {
    // First, get the conversation ID for this collaboration
    // You need to implement a way to get conversation ID for collaborations

    // Call the RPC function to mark messages as read
    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      conversation_id: 'your-conversation-id' // Replace with actual conversation ID
    });

    if (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Nie udało się oznaczyć wiadomości jako przeczytane');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in markCollaborationMessagesAsRead:', error);
    throw new Error(`Błąd podczas oznaczania wiadomości jako przeczytane: ${error.message}`);
  }
};
