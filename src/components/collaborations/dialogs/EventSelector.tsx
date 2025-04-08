
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface EventSelectorProps {
  events: any[];
  selectedEventIds: string[];
  toggleEvent: (eventId: string) => void;
  eventId?: string;
  selectedOrganizationId: string;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  events,
  selectedEventIds,
  toggleEvent,
  eventId,
  selectedOrganizationId
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Wybierz wydarzenia</h3>
      
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center space-x-2">
              <Checkbox
                id={`event-${event.id}`}
                checked={selectedEventIds.includes(event.id)}
                onCheckedChange={() => toggleEvent(event.id)}
                disabled={!!eventId && eventId !== event.id}
              />
              <Label htmlFor={`event-${event.id}`} className="cursor-pointer">
                {event.title}
              </Label>
            </div>
          ))}
        </div>
      ) : (
        selectedOrganizationId ? (
          <p className="text-muted-foreground">
            Ta organizacja nie ma jeszcze żadnych wydarzeń
          </p>
        ) : (
          <p className="text-muted-foreground">
            Najpierw wybierz organizację
          </p>
        )
      )}
    </div>
  );
};

export default EventSelector;
