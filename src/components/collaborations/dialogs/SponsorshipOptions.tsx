
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { CollaborationOption } from '@/services/collaborations/types';

interface SponsorshipOption {
  id: string;
  title: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
}

interface SponsorshipOptionsProps {
  selectedEventIds: string[];
  sponsorshipOptions: SponsorshipOption[];
  selectedOptions: CollaborationOption[];
  toggleOption: (option: SponsorshipOption) => void;
  addCustomOption: () => void;
}

const SponsorshipOptions: React.FC<SponsorshipOptionsProps> = ({
  selectedEventIds,
  sponsorshipOptions,
  selectedOptions,
  toggleOption,
  addCustomOption
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Opcje sponsoringu</h3>
      
      {selectedEventIds.length > 0 ? (
        sponsorshipOptions.length > 0 ? (
          <div className="space-y-3">
            {sponsorshipOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  border rounded-lg p-3 cursor-pointer transition
                  ${selectedOptions.some(o => o.sponsorship_option_id === option.id) 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => toggleOption(option)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.description || 'Brak opisu'}
                    </p>
                    
                    {option.benefits && option.benefits.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {option.benefits.map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-bold">{option.price} PLN</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-4">
            Wybrane wydarzenia nie mają zdefiniowanych opcji sponsoringu
          </p>
        )
      ) : (
        <p className="text-muted-foreground mb-4">
          Najpierw wybierz wydarzenie
        </p>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        className="mt-4"
        onClick={addCustomOption}
      >
        <Plus size={16} className="mr-2" /> 
        Dodaj własną opcję
      </Button>
    </div>
  );
};

export default SponsorshipOptions;
