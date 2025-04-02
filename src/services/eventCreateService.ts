
import { supabase } from '@/lib/supabase';
import { EventCreateValues } from '@/components/events/create/EventCreateSchema';
import { SponsorshipOption } from '@/components/events/create/EventCreateSchema';

export const createEvent = async (
  data: EventCreateValues,
  organizationId: string,
  imageUrl: string | null,
  sponsorshipOptions: SponsorshipOption[]
) => {
  // Prepare location
  const location = `${data.city}, ${data.voivodeship}`;
  
  // Prepare social media links
  const socialMedia = {
    facebook: data.facebook || '',
    linkedin: data.linkedin || '',
    instagram: data.instagram || '',
  };
  
  // Create event payload
  const eventPayload = {
    title: data.title,
    category: data.category,
    description: data.description,
    start_date: data.start_date.toISOString(),
    end_date: data.end_date ? data.end_date.toISOString() : null,
    location,
    detailed_location: data.detailed_location || null,
    expected_participants: data.expected_participants ? parseInt(data.expected_participants) : null,
    organization_id: organizationId,
    audience: data.audience || [],
    tags: data.tags || [],
    image_url: imageUrl,
    social_media: socialMedia
  };

  console.log('Creating event with payload:', JSON.stringify(eventPayload, null, 2));

  // Create event in database
  const { data: eventResult, error: eventError } = await supabase
    .from('events')
    .insert(eventPayload)
    .select('id')
    .single();

  if (eventError) {
    console.error('Error creating event:', eventError);
    throw eventError;
  }

  console.log('Event created successfully with ID:', eventResult.id);

  // Add sponsorship options if any exists
  if (sponsorshipOptions.length > 0) {
    const sponsorshipData = sponsorshipOptions
      .filter(option => option.title.trim() !== '')
      .map(option => ({
        title: option.title,
        description: option.description,
        price: parseFloat(option.priceFrom) || 0,
        event_id: eventResult.id
      }));

    if (sponsorshipData.length > 0) {
      console.log('Adding sponsorship options:', sponsorshipData.length);
      
      const { error: sponsorshipError } = await supabase
        .from('sponsorship_options')
        .insert(sponsorshipData);

      if (sponsorshipError) {
        console.error('Error creating sponsorship options:', sponsorshipError);
        // We continue despite sponsorship errors since the event was created
      } else {
        console.log('Sponsorship options added successfully');
      }
    }
  }

  return eventResult.id;
};

export const getOrganizationByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }

  return data;
};

export const uploadEventBanner = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    console.log('Starting banner upload process');
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      throw new Error('Nieprawidłowy format pliku. Dozwolone formaty: JPG, PNG, GIF, WEBP');
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Plik jest zbyt duży. Maksymalny rozmiar to 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `event-banners/${fileName}`;

    console.log('Uploading file to path:', filePath);

    // Upload to events bucket
    const { error: uploadError, data } = await supabase.storage
      .from('events')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading banner:', uploadError);
      throw uploadError;
    }

    console.log('Banner uploaded successfully, getting public URL');

    const { data: urlData } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadEventBanner:', error);
    return null;
  }
};
