
import { supabase } from '@/lib/supabase';
import { Collaboration, CollaborationOption, COLLABORATION_STATUSES } from '../types';

/**
 * Create a new collaboration
 * 
 * @param collaboration - Collaboration data
 * @param selectedOptions - Selected sponsorship options
 * @param selectedEventIds - IDs of selected events
 * @returns Promise with the ID of the created collaboration
 */
export const createCollaboration = async (
  collaboration: Partial<Collaboration>, // Make it partial to allow for missing event_id
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
    const validatedStatus = COLLABORATION_STATUSES.PENDING;

    // First, create collaboration record using the first event (we'll link to others later)
    const { data: collaborationData, error: collaborationError } = await supabase
      .from('collaborations')
      .insert({
        sponsor_id: collaboration.sponsor_id,
        organization_id: collaboration.organization_id,
        event_id: selectedEventIds[0], // Use the first selected event as primary
        status: validatedStatus, // Use validated status value
        message: collaboration.message || null, // Make message optional
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

    // Conversation creation is now disabled 
    console.log("Conversation creation is disabled - skipping this step");
    
    // Note: In the future, this will create a conversation between the sponsor and organization

    // Return the collaboration ID
    return collaborationId;
  } catch (error: any) {
    console.error('Error in createCollaboration:', error);
    throw new Error(`Błąd podczas tworzenia współpracy: ${error.message}`);
  }
};
