
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useEventsData = (
  selectedOrganizationId: string,
  initialEventId?: string
) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(
    initialEventId ? [initialEventId] : []
  );
  
  // Load events for selected organization
  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedOrganizationId) {
        setEvents([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, start_date, image_url')
          .eq('organization_id', selectedOrganizationId);
          
        if (error) throw error;
        
        setEvents(data || []);
      } catch (error: any) {
        console.error('Błąd podczas ładowania wydarzeń:', error);
      }
    };
    
    loadEvents();
  }, [selectedOrganizationId]);
  
  const toggleEvent = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      setSelectedEventIds(selectedEventIds.filter(id => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  return {
    events,
    selectedEventIds,
    setSelectedEventIds,
    toggleEvent
  };
};
