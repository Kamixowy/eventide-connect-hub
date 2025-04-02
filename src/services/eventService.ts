
import { supabase } from '@/lib/supabase';
import { EventFormValues, SocialMedia } from '@/components/events/edit/EventEditSchema';
import { processArrayFields } from '@/utils/eventHelpers';

export const fetchEventById = async (id: string) => {
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*, organizations(id, user_id)')
    .eq('id', id)
    .single();
    
  if (eventError) {
    throw eventError;
  }
  
  return eventData;
};

export const updateEvent = async (id: string, data: EventFormValues, imageUrl: string | null) => {
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
    
  if (error) throw error;
  
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
