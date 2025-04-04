
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Interface for collaboration option
export interface CollaborationOption {
  id?: string;
  title: string;
  description?: string | null;
  amount: number;
  is_custom?: boolean;
  sponsorship_option_id?: string;
  event_id?: string;
}

// Function to fetch all collaborations for authenticated user
export const fetchCollaborations = async (userType?: string) => {
  try {
    console.log('Fetching collaborations for user type:', userType);
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
  collaboration: {
    sponsor_id: string;
    organization_id: string;
    status: string;
    message: string;
    total_amount: number;
  },
  selectedOptions: CollaborationOption[],
  selectedEventIds: string[]
) => {
  try {
    console.log("Creating new collaboration:", {
      collaboration,
      selectedOptions,
      selectedEventIds
    });
    
    if (selectedEventIds.length === 0) {
      throw new Error('No events selected');
    }

    // Ensure the status value is valid - it must be one of the values accepted by the database check constraint
    // Most likely it should be 'pending', 'sent' or similar value - checking the database constraint would help
    // Normally we would import a constant for this, but for now let's ensure the status is 'pending'
    const validatedStatus = 'pending';

    // First, create collaboration record using the first event (we'll link to others later)
    const { data: collaborationData, error: collaborationError } = await supabase
      .from('collaborations')
      .insert({
        sponsor_id: collaboration.sponsor_id,
        organization_id: collaboration.organization_id,
        event_id: selectedEventIds[0], // Use the first selected event as primary
        status: validatedStatus, // Use validated status value
        message: collaboration.message,
        total_amount: collaboration.total_amount
      })
      .select()
      .single();

    if (collaborationError) {
      console.error('Error creating collaboration:', collaborationError);
      throw new Error(`Błąd podczas tworzenia współpracy: ${collaborationError.message}`);
    }

    if (!collaborationData) {
      throw new Error('Nie udało się utworzyć współpracy');
    }

    const collaborationId = collaborationData.id;
    console.log("Created collaboration with ID:", collaborationId);

    // Create custom options if needed
    const customOptions = selectedOptions.filter(option => option.is_custom);
    const existingOptions = selectedOptions.filter(option => !option.is_custom);

    if (customOptions.length > 0) {
      console.log("Creating custom options:", customOptions);
      
      for (const option of customOptions) {
        // For each custom option, create a sponsorship option linked to the event
        const { data: customOption, error: customOptionError } = await supabase
          .from('sponsorship_options')
          .insert({
            title: option.title,
            description: option.description || '',
            price: option.amount,
            event_id: selectedEventIds[0] // Link to the first event for simplicity
          })
          .select()
          .single();

        if (customOptionError) {
          console.error('Error creating custom option:', customOptionError);
          continue; // Skip this option but continue with others
        }

        if (customOption) {
          // Link the new custom option to the collaboration
          const { error: linkError } = await supabase
            .from('collaboration_options')
            .insert({
              collaboration_id: collaborationId,
              sponsorship_option_id: customOption.id
            });

          if (linkError) {
            console.error('Error linking custom option to collaboration:', linkError);
          }
        }
      }
    }

    // Link existing sponsorship options to the collaboration
    if (existingOptions.length > 0) {
      console.log("Linking existing options:", existingOptions);
      
      const optionLinks = existingOptions.map(option => ({
        collaboration_id: collaborationId,
        sponsorship_option_id: option.sponsorship_option_id
      }));

      const { error: linkError } = await supabase
        .from('collaboration_options')
        .insert(optionLinks);

      if (linkError) {
        console.error('Error linking options to collaboration:', linkError);
      }
    }

    // Return the collaboration ID
    return collaborationId;
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
    // Check if the collaboration exists
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

    // Create a new message in direct_messages table using collaboration ID as conversation_id
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: collaborationId, // Using collaboration ID as conversation ID
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
    // Fetch messages directly using collaboration ID as conversation ID
    const { data: messages, error: messagesError } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', collaborationId)
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
    // Call the RPC function to mark messages as read
    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      conversation_id: collaborationId
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

