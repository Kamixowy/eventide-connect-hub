
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
  
  // Fetch event posts using the "from" method with the any type to bypass type checking
  const { data: postsData, error: postsError } = await supabase
    .from('event_posts' as any)
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false });
    
  if (postsError) {
    console.error('Error fetching event posts:', postsError);
  }
  
  // Add sponsorship options and posts to the event data
  const fullEventData = {
    ...eventData,
    sponsorshipOptions: sponsorshipData || [],
    posts: postsData || []
  };
  
  return fullEventData;
};
