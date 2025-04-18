
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CollaborationOption } from '@/services/collaborations/types';

interface CollaborationSummaryProps {
  organizations: any[];
  events: any[];
  selectedOrganizationId: string;
  selectedEventIds: string[];
  selectedOptions: CollaborationOption[];
  totalAmount: number;
  isLoading: boolean;
  handleSubmit: () => void;
}

const CollaborationSummary: React.FC<CollaborationSummaryProps> = ({
  organizations,
  events,
  selectedOrganizationId,
  selectedEventIds,
  selectedOptions,
  totalAmount,
  isLoading,
  handleSubmit
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Podsumowanie</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Organizacja</p>
          <p className="font-medium">
            {organizations.find(o => o.id === selectedOrganizationId)?.name || 'Nie wybrano'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Wydarzenia</p>
          {selectedEventIds.length > 0 ? (
            <ul className="list-disc list-inside">
              {selectedEventIds.map(id => {
                const event = events.find(e => e.id === id);
                return (
                  <li key={id} className="font-medium">
                    {event?.title || 'Nieznane wydarzenie'}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-medium">Nie wybrano</p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Wybrane opcje</p>
          {selectedOptions.length > 0 ? (
            <ul className="list-disc list-inside">
              {selectedOptions.map((option, i) => (
                <li key={i} className="font-medium">
                  {option.title} - {option.amount} PLN
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-medium">Nie wybrano</p>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-lg font-semibold">Łączna kwota</p>
          <p className="text-2xl font-bold">{totalAmount} PLN</p>
        </div>
      </div>
      
      <Button 
        className="w-full mt-6" 
        onClick={handleSubmit}
        disabled={
          isLoading || 
          !selectedOrganizationId || 
          selectedOptions.length === 0 ||
          selectedEventIds.length === 0
        }
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Wysyłanie...
          </>
        ) : (
          "Wyślij propozycję"
        )}
      </Button>
    </Card>
  );
};

export default CollaborationSummary;
