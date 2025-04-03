
import { supabase } from '@/lib/supabase';
import { EventFormValues, SocialMedia } from '@/components/events/edit/EventEditSchema';
import { processArrayFields } from '@/utils/eventHelpers';
import { SponsorshipOption } from '@/components/events/edit/EventEditSchema';

export const fetchEventById = async (id: string) => {
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*, organizations(id, user_id)')
    .eq('id', id)
    .single();
    
  if (eventError) {
    throw eventError;
  }
  
  // Fetch sponsorship options for the event
  const { data: sponsorshipData, error: sponsorshipError } = await supabase
    .from('sponsorship_options')
    .select('*')
    .eq('event_id', id);
    
  if (sponsorshipError) {
    console.error('Error fetching sponsorship options:', sponsorshipError);
  }
  
  // Add sponsorship options to the event data
  const fullEventData = {
    ...eventData,
    sponsorshipOptions: sponsorshipData || []
  };
  
  return fullEventData;
};

export const updateEvent = async (id: string, data: EventFormValues, imageUrl: string | null, sponsorshipOptions?: SponsorshipOption[]) => {
  console.log('Updating event with ID:', id);
  console.log('Event data:', data);
  console.log('Sponsorship options:', sponsorshipOptions);
  
  // Process array fields
  const audienceArray = processArrayFields(data.audience || '');
  const tagsArray = processArrayFields(data.tags || '');
  
  // Format social media links
  const socialMedia: SocialMedia = {
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
  };
  
  // Create event object
  const updatedEvent = {
    title: data.title,
    description: data.description,
    start_date: data.start_date.toISOString(),
    end_date: data.end_date ? data.end_date.toISOString() : null,
    location: data.location || null,
    detailed_location: data.detailed_location || null,
    expected_participants: data.expected_participants ? parseInt(data.expected_participants) : null,
    category: data.category || null,
    audience: audienceArray.length > 0 ? audienceArray : null,
    tags: tagsArray.length > 0 ? tagsArray : null,
    social_media: socialMedia,
    image_url: imageUrl || null,
  };
  
  // Update event in the database
  const { error } = await supabase
    .from('events')
    .update(updatedEvent)
    .eq('id', id);
    
  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }
  
  // Update sponsorship options if provided
  if (sponsorshipOptions && sponsorshipOptions.length > 0) {
    try {
      console.log('Deleting existing sponsorship options for event:', id);
      // First, delete all existing sponsorship options
      const { error: deleteError } = await supabase
        .from('sponsorship_options')
        .delete()
        .eq('event_id', id);
        
      if (deleteError) {
        console.error('Error deleting sponsorship options:', deleteError);
        throw deleteError;
      }
      
      // Prepare the new options for insertion
      const sponsorshipData = sponsorshipOptions.map(option => ({
        event_id: id,
        title: option.title,
        description: option.description,
        price: parseFloat(option.priceFrom) || 0,
        benefits: option.benefits.length > 0 ? option.benefits : []
      }));
      
      console.log('Inserting new sponsorship options:', sponsorshipData);
      
      // Then, insert the new ones
      const { error: insertError } = await supabase
        .from('sponsorship_options')
        .insert(sponsorshipData);
        
      if (insertError) {
        console.error('Error inserting sponsorship options:', insertError);
        throw insertError;
      }
      
      console.log('Successfully updated sponsorship options');
    } catch (error) {
      console.error('Error updating sponsorship options:', error);
      throw error;
    }
  } else {
    console.log('No sponsorship options to update');
  }
  
  return true;
};

export const updateEventStatus = async (id: string, status: string) => {
  // Use a proper type annotation to indicate we're updating only the status field
  interface StatusUpdate {
    status: string;
  }
  
  const updateData: StatusUpdate = { status };
  
  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id);
    
  if (error) throw error;
  
  return true;
};
