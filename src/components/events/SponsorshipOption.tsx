
import React from 'react';
import { Check } from 'lucide-react';
import SponsorshipTooltip from './SponsorshipTooltip';
import { useAuth } from '@/contexts/AuthContext';

interface SponsorshipOptionProps {
  option: {
    title: string;
    description: string;
    price: {
      from: number | string;
      to: number | string;
    };
    benefits: string[];
  };
  isSelected?: boolean;
  onSelect?: () => void;
  showPrice?: boolean;
}

const SponsorshipOption: React.FC<SponsorshipOptionProps> = ({ 
  option, 
  isSelected = false,
  onSelect,
  showPrice = true
}) => {
  return (
    <SponsorshipTooltip benefits={option.benefits}>
      <div 
        className={`border rounded-md p-4 space-y-3 ${onSelect ? 'cursor-pointer hover:border-ngo/50' : ''} ${isSelected ? 'border-ngo bg-ngo/5' : ''}`}
        onClick={onSelect}
      >
        <h4 className="font-semibold">{option.title}</h4>
        
        <p className="text-sm text-muted-foreground">
          {option.description}
        </p>
        
        {showPrice && (
          <div className="mt-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Wartość współpracy: </span>
              <span className="font-medium">
                {option.price.from === option.price.to 
                  ? `${option.price.from} PLN` 
                  : `${option.price.from} - ${option.price.to} PLN`
                }
              </span>
            </p>
          </div>
        )}
        
        {!showPrice && (
          <p className="text-sm italic text-muted-foreground">
            Cena dostępna po zalogowaniu
          </p>
        )}
      </div>
    </SponsorshipTooltip>
  );
};

export default SponsorshipOption;
